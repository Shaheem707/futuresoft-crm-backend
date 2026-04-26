import { db } from "../lib/index.js"; // adjust path
import { aspnetusers, tenants } from "../lib/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import type { Request, Response } from "express";

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
};

export default authController;
