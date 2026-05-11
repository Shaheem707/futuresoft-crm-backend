import { db } from "../lib/index.js"; // adjust path
import {
  aspnetusers,
  fbadaccounts,
  fbadforms,
  fbadleads,
  fbadpages,
  tenants,
} from "../lib/db/schema.js";
import { and, eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import type { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import crypto from "crypto";
import { getWebhookStatus, processWebhookLead } from "../services/facebookWebhookService.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

const FB_VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN!;
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;

const authController = {
  signup: async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, companyName } = req.body;

      if (!email || !password || !companyName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const normalizedEmail = email.toUpperCase();

      const existingUser = await db
        .select()
        .from(aspnetusers)
        .where(eq(aspnetusers.normalizedEmail, normalizedEmail));

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.transaction(async (tx) => {
        const baseSlug = companyName.toLowerCase().replace(/\s+/g, "-");
        const slug = `${baseSlug}-${Date.now()}`;

        // 🔹 insert tenant
        await tx.insert(tenants).values({
          name: companyName,
          slug,
        });

        const [tenant] = await tx
          .select()
          .from(tenants)
          .where(eq(tenants.slug, slug));

        if (!tenant) {
          throw new Error("Tenant creation failed");
        }

        const tenantId = tenant.tenantId;

        if (!tenantId) {
          throw new Error("Tenant creation failed");
        }

        // 🔹 create user
        const userId = uuidv4();

        await tx.insert(aspnetusers).values({
          id: userId,
          email,
          normalizedEmail,
          userName: email,
          normalizedUserName: normalizedEmail,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          tenantId,
        });

        return { tenantId, userId };
      });

      return res.status(201).json({
        message: "Tenant + User created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const normalizedEmail = email.toUpperCase();

      // 🔹 find user
      const users = await db
        .select()
        .from(aspnetusers)
        .where(eq(aspnetusers.normalizedEmail, normalizedEmail));

      const user = users[0];

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // 🔹 check password
      const isValid = await bcrypt.compare(password, user.passwordHash!);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          tenantId: user.tenantId,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  redirectToFBAuth: async (req: Request, res: Response) => {
    const tenantId = 5; // static for now, make dynamic later

    const params = qs.stringify({
      client_id: process.env.FACEBOOK_APP_ID,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      scope:
        "leads_retrieval,pages_show_list,pages_read_engagement,pages_manage_ads",
      response_type: "code",
      state: tenantId.toString(),
      // state: req.user?.id ?? '', // pass your CRM user ID to identify them on callback
    });

    res.redirect(`https://www.facebook.com/v25.0/dialog/oauth?${params}`);
  },
  fbRedirectCallback: async (req: Request, res: Response) => {
    const { code, state: tenantId } = req.query;
    const tenantIdNum = 5; // static for now

    try {
      // Exchange code for short-lived user access token
      const tokenRes = await axios.get(
        "https://graph.facebook.com/v25.0/oauth/access_token",
        {
          params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            code,
          },
        },
      );

      const shortLivedToken = tokenRes.data.access_token;

      // Exchange for long-lived token (valid 60 days)
      const longLivedRes = await axios.get(
        "https://graph.facebook.com/v25.0/oauth/access_token",
        {
          params: {
            grant_type: "fb_exchange_token",
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: shortLivedToken,
          },
        },
      );

      const longLivedToken = longLivedRes.data.access_token;

      // Fetch the user's Facebook Pages
      const pagesRes = await axios.get(
        "https://graph.facebook.com/v25.0/me/accounts",
        {
          params: { access_token: longLivedToken },
        },
      );

      const pages = pagesRes.data.data; // array of pages with their own page access tokens

      // ── Save to DB using Drizzle ──

      // 1. Upsert into fbadaccounts (one record per tenant)
      const existingAccount = await db
        .select()
        .from(fbadaccounts)
        .where(eq(fbadaccounts.tenantId, tenantIdNum))
        .limit(1);

      let fbAdAccountId: number;

      if (existingAccount.length > 0) {
        // Update existing
        await db
          .update(fbadaccounts)
          .set({ longLiveToken: longLivedToken, active: 1 })
          .where(eq(fbadaccounts.tenantId, tenantIdNum));

        // fbAdAccountId = existingAccount[0].fbAdAccountId;
        fbAdAccountId = existingAccount[0]?.fbAdAccountId ?? 0;
      } else {
        // Insert new
        const inserted = await db.insert(fbadaccounts).values({
          tenantId: tenantIdNum,
          longLiveToken: longLivedToken,
          appId: process.env.FACEBOOK_APP_ID,
          appSecret: process.env.FACEBOOK_APP_SECRET,
          active: 1,
        });

        fbAdAccountId = inserted[0].insertId;
      }

      // 2. Save each Facebook Page into fbadpages
      for (const page of pages) {
        const existingPage = await db
          .select()
          .from(fbadpages)
          .where(
            and(
              eq(fbadpages.tenantId, tenantIdNum),
              eq(fbadpages.internalId, page.id),
            ),
          )
          .limit(1);

        if (existingPage.length > 0) {
          // Update token in case it changed
          await db
            .update(fbadpages)
            .set({ token: page.access_token, active: 1 })
            // .where(eq(fbadpages.fbAdPageId, existingPage[0].fbAdPageId));
            .where(eq(fbadpages.internalId, page.id));
        } else {
          // Insert new page
          await db.insert(fbadpages).values({
            tenantId: tenantIdNum,
            fbAdAccountId,
            description: page.name,
            token: page.access_token,
            internalId: page.id,
            active: 1,
          });
        }
      }

      // Redirect back to your CRM frontend
      res.redirect(`${process.env.FRONTEND_URL}/leads?facebook=connected`);
    } catch (err) {
      const error = err as any;
      console.error(
        "Facebook OAuth error:",
        error.response?.data || error.message,
      );
      res.redirect(
        `${process.env.FRONTEND_URL}/settings/integrations?facebook=error`,
      );
    }
  },
  leadsFromFB: async (req: Request, res: Response) => {
    const { pageId } = req.query;
    // const userId = req.user?.id ?? "";
    const tenantIdNum = 5; // static for now

    try {
      // TODO: Get the stored page access token from your DB
      // Get the stored page access token from DB
      const pageRecord = await db
        .select()
        .from(fbadpages)
        .where(
          and(
            eq(fbadpages.tenantId, tenantIdNum),
            eq(fbadpages.internalId, pageId as string),
          ),
        )
        .limit(1);

      if (!pageRecord[0]) {
        res
          .status(404)
          .json({ error: "Page not found, please reconnect Facebook" });
        return;
      }

      const pageAccessToken = pageRecord[0].token;

      // Fetch all lead forms for this page
      const formsRes = await axios.get(
        `https://graph.facebook.com/v25.0/${pageId}/leadgen_forms`,
        {
          params: { access_token: pageAccessToken },
        },
      );

      const forms = formsRes.data.data;
      let allLeads: any[] = [];

      // console.log("test api")

      // Fetch leads from each form
      for (const form of forms) {
        const leadsRes = await axios.get(
          `https://graph.facebook.com/v25.0/${form.id}/leads`,
          {
            params: { access_token: pageAccessToken },
          },
        );

        // Save/update form in fbadforms
        const existingForm = await db
          .select()
          .from(fbadforms)
          .where(
            and(
              eq(fbadforms.tenantId, tenantIdNum),
              eq(fbadforms.internalId, form.id),
            ),
          )
          .limit(1);

        const toMysqlDateTime = (date: Date) =>
          date.toISOString().replace("T", " ").replace(/\..+/, "");

        const now = toMysqlDateTime(new Date());
        if (existingForm.length === 0) {
          await db.insert(fbadforms).values({
            tenantId: tenantIdNum,
            fbAdPageId: pageRecord[0].fbAdPageId,
            description: form.name,
            internalId: form.id,
            active: 1,
            initialSyncAt: toMysqlDateTime(new Date()),
            lastSyncAt: toMysqlDateTime(new Date()),
          });
        } else {
          await db
            .update(fbadforms)
            .set({ lastSyncAt: toMysqlDateTime(new Date()) })
            .where(eq(fbadforms.internalId, form.id));
        }

        const leads = leadsRes.data.data.map((lead: any) => {
          const fields: Record<string, any> = {};
          lead.field_data.forEach(
            ({ name, values }: { name: string; values: string[] }) => {
              fields[name] = values[0];
            },
          );
          return {
            id: lead.id,
            created_time: lead.created_time,
            form_name: form.name,
            ...fields,
          };
        });

        // Save raw leads into fbadleads (skip duplicates by internalId)
        for (const lead of leadsRes.data.data) {
          const existingLead = await db
            .select()
            .from(fbadleads)
            .where(eq(fbadleads.internalId, lead.id))
            .limit(1);

          if (existingLead.length === 0) {
            const fields: Record<string, any> = {};
            lead.field_data.forEach(
              ({ name, values }: { name: string; values: string[] }) => {
                fields[name] = values[0];
              },
            );

            await db.insert(fbadleads).values({
              tenantId: tenantIdNum,
              fbAdFormId: existingForm[0]?.fbAdFormId ?? 0,
              data: JSON.stringify(fields),
              internalId: lead.id,
              processed: 0,
              createdAt: lead.created_time,
            });
          }
        }

        allLeads = [...allLeads, ...leads];
      }

      res.json({ success: true, leads: allLeads, total: allLeads.length });
    } catch (err) {
      const error = err as any;
      console.error("Full error:", JSON.stringify(error, null, 2));
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  },
  facebookStatus: async (req: Request, res: Response) => {
    const tenantIdNum = 5;
    try {
      const account = await db
        .select()
        .from(fbadaccounts)
        .where(
          and(
            eq(fbadaccounts.tenantId, tenantIdNum),
            eq(fbadaccounts.active, 1),
          ),
        )
        .limit(1);

      if (!account[0]) {
        res.json({ connected: false });
        return;
      }

      const pages = await db
        .select()
        .from(fbadpages)
        .where(
          and(eq(fbadpages.tenantId, tenantIdNum), eq(fbadpages.active, 1)),
        );

      res.json({ connected: true, pages });
    } catch (err) {
      res.status(500).json({ error: "Failed to check Facebook status" });
    }
  },
  verifyFacebookWebhook: (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === FB_VERIFY_TOKEN) {
      console.log("Facebook webhook verified.");
      return res.status(200).send(challenge);
    }

    return res.status(403).json({ message: "Verification failed" });
  },
  handleFacebookWebhook: (req: Request, res: Response) => {
    // Validate signature
    const signature = req.headers["x-hub-signature-256"] as string;

    if (!signature) {
      return res.status(401).json({ message: "Missing signature" });
    }

    const rawBody = JSON.stringify(req.body);
    const expectedSignature =
      "sha256=" +
      crypto.createHmac("sha256", FB_APP_SECRET).update(rawBody).digest("hex");

    if (signature !== expectedSignature) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    // Acknowledge Facebook immediately (required within 5 seconds)
    res.status(200).send("EVENT_RECEIVED");

    // Extract lead events
    const body = req.body;

    if (body.object === "page") {
      for (const entry of body.entry) {
        const pageId = entry.id;
        for (const change of entry.changes) {
          if (change.field === "leadgen") {
            const leadgenId = change.value.leadgen_id;
            console.log(
              `New lead received — pageId: ${pageId}, leadgenId: ${leadgenId}`,
            );
            processWebhookLead(pageId, leadgenId); // fire and forget
          }
        }
      }
    }
  },
  getWebhookStatus: async (req: Request, res: Response) => {
    try {
        const tenantId = 5; // hardcoded for now, same as rest of codebase
        const status = await getWebhookStatus(tenantId);
        return res.status(200).json(status);
    } catch (error) {
        console.error("getWebhookStatus error:", error);
        return res.status(500).json({ error: "Failed to fetch webhook status" });
    }
}
};

export default authController;
