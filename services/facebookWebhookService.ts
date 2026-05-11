import axios from "axios";
import { db } from "../lib/index.js";
import {
  fbadpages,
  fbadforms,
  fbadleads,
  prospects,
  leads,
} from "../lib/db/schema.js";
import { and, desc, eq } from "drizzle-orm";

const toMysqlDateTime = (date: Date) =>
  date.toISOString().replace("T", " ").replace(/\..+/, "");

export const processWebhookLead = async (pageId: string, leadgenId: string) => {
  try {
    // Step 1: Resolve page, token and tenantId from pageId
    const pageRecord = await db
      .select()
      .from(fbadpages)
      .where(eq(fbadpages.internalId, pageId))
      .limit(1);

    if (!pageRecord[0]) {
      console.error(`Webhook: No page found for pageId ${pageId}`);
      return;
    }

    const { token: pageAccessToken, tenantId, fbAdPageId } = pageRecord[0];

    // Step 2: Fetch full lead data from Graph API
    const leadRes = await axios.get(
      `https://graph.facebook.com/v25.0/${leadgenId}`,
      {
        params: {
          access_token: pageAccessToken,
          fields: "id,created_time,field_data,form_id",
        },
      },
    );

    const lead = leadRes.data;
    // console.log("Lead data:", JSON.stringify(lead));
    const formId = lead.form_id;

    // Step 3: Find or create the form record
    const existingForm = await db
      .select()
      .from(fbadforms)
      .where(
        and(eq(fbadforms.tenantId, tenantId), eq(fbadforms.internalId, formId)),
      )
      .limit(1);

    let fbAdFormId: number;

    if (existingForm.length === 0) {
      // Fetch form details from Graph API
      const formRes = await axios.get(
        `https://graph.facebook.com/v25.0/${formId}`,
        { params: { access_token: pageAccessToken, fields: "name" } },
      );

      const formName = formRes.data.name ?? "Unknown Form";
      const now = toMysqlDateTime(new Date());

      const inserted = await db.insert(fbadforms).values({
        tenantId,
        fbAdPageId,
        description: formName,
        internalId: formId,
        active: 1,
        initialSyncAt: now,
        lastSyncAt: now,
      });

      fbAdFormId = Number(inserted[0].insertId);
    } else {
      //   fbAdFormId = existingForm[0].fbAdFormId;
      fbAdFormId = existingForm[0]!.fbAdFormId;

      // Update lastSyncAt
      await db
        .update(fbadforms)
        .set({ lastSyncAt: toMysqlDateTime(new Date()) })
        .where(eq(fbadforms.fbAdFormId, fbAdFormId));
    }

    // Step 4: Skip if lead already exists
    const existingLead = await db
      .select()
      .from(fbadleads)
      .where(eq(fbadleads.internalId, lead.id))
      .limit(1);

    if (existingLead.length > 0) {
      console.log(`Webhook: Lead ${leadgenId} already exists, skipping.`);
      return;
    }

    // Step 5: Parse field_data and save to fbadleads
    const fields: Record<string, any> = {};
    lead.field_data.forEach(
      ({ name, values }: { name: string; values: string[] }) => {
        fields[name] = values[0];
      },
    );

    await db.insert(fbadleads).values({
      tenantId,
      fbAdFormId,
      data: JSON.stringify(fields),
      internalId: lead.id,
      processed: 0,
      createdAt: toMysqlDateTime(new Date(lead.created_time)),
    });

    // Step 6: Auto-create Prospect
    const fullName = fields["full_name"] || fields["name"] || "Unknown";
    // const email = fields["email"] ?? null;
    // const primaryPhone = fields["phone_number"] ?? null;
    const email = fields["email"] ? fields["email"] : null;
    const primaryPhone = fields["phone_number"]
      ? fields["phone_number"].slice(0, 30)
      : null;
    console.log("Inserting prospect:", {
      tenantId,
      fullName,
      email,
      primaryPhone,
    });
    const insertedProspect = await db.insert(prospects).values({
      tenantId,
      fullName,
      email,
      primaryPhone,
      leadSourceId: 1,
      isActive: 1,
      createdAt: toMysqlDateTime(new Date()),
      updatedAt: toMysqlDateTime(new Date()),
    });

    const prospectId = Number(insertedProspect[0].insertId);

    // Step 7: Insert into main leads table
    await db.insert(leads).values({
      tenantId,
      prospectId,
      fbAdFormId,
      fbImportLeadId: null,
      internalId: Number(lead.id),
      leadSourceId: 1,
      leadDate: toMysqlDateTime(new Date(lead.created_time)),
      budget: "0.00",
      priority: "low",
      statusId: 1,
      staffId: null,
      saleTeamId: null,
      projectId: null,
      description: "Facebook Lead Ad",
      notes: "",
      sno: 0,
      createdAt: toMysqlDateTime(new Date()),
      updatedAt: toMysqlDateTime(new Date()),
    });

    console.log(
      `Webhook: Lead ${leadgenId} saved successfully for tenant ${tenantId}.`,
    );
  } catch (err: any) {
    console.error(
      `Webhook: Failed to process lead ${leadgenId}:`,
      err.response?.data || err.message,
    );
    console.error("Full error:", JSON.stringify(err, null, 2));
  }
};

export async function getWebhookStatus(tenantId: number): Promise<{
    lastSyncAt: string | null;
    isActive: boolean;
}> {
    const result = await db
        .select({ lastSyncAt: fbadforms.lastSyncAt })
        .from(fbadforms)
        .where(eq(fbadforms.tenantId, tenantId))
        .orderBy(desc(fbadforms.lastSyncAt))
        .limit(1);

    const lastSyncAt = result[0]?.lastSyncAt ?? null;

    if (!lastSyncAt) {
        return { lastSyncAt: null, isActive: false };
    }

    const diffMs = Date.now() - new Date(lastSyncAt).getTime();
    const isActive = diffMs <= 24 * 60 * 60 * 1000; // 24 hours

    return { lastSyncAt, isActive };
}