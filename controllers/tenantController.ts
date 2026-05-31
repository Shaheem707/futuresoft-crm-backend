/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import { db } from "../lib/index.js";
import { aspnetroles, aspnetuserroles, aspnetusers, invitations, tenants } from "../lib/db/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const tenantController = {
  getCompany: async (req: Request, res: Response) => {
    try {
      const [tenant] = await db
        .select({
          name: tenants.name,
          slug: tenants.slug,
          logoUrl: tenants.logoUrl,
          timezone: tenants.timezone,
          plan: tenants.plan,
        })
        .from(tenants)
        .where(eq(tenants.tenantId, req.user!.tenantId));

      if (!tenant) {
        return res.status(404).json({ message: "Company not found" });
      }

      return res.status(200).json({ tenant });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  updateCompany: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      await db
        .update(tenants)
        .set({ name })
        .where(eq(tenants.tenantId, req.user!.tenantId));

      return res.status(200).json({ message: "Company updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  generateInvite: async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.user!;
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await db.insert(invitations).values({
        id: uuidv4(),
        tenantId,
        token,
        expiresAt,
      });

      const inviteLink = `http://localhost:3000/accept-invite?token=${token}`;
      return res.status(201).json({ inviteLink });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  acceptInvite: async (req: Request, res: Response) => {
    try {
      const { token, firstName, lastName, email, password } = req.body;

      // validate token
      const [invite] = await db
        .select()
        .from(invitations)
        .where(eq(invitations.token, token));

      if (!invite) {
        return res.status(400).json({ message: "Invalid invite link" });
      }

      if (invite.isUsed) {
        return res.status(400).json({ message: "Invite already used" });
      }

      if (new Date(invite.expiresAt) < new Date()) {
        return res.status(400).json({ message: "Invite link expired" });
      }

      const normalizedEmail = email.toUpperCase();

      const existing = await db
        .select()
        .from(aspnetusers)
        .where(eq(aspnetusers.normalizedEmail, normalizedEmail));

      if (existing.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      const roleId = uuidv4();

      await db.transaction(async (tx) => {
        // create user under same tenant
        await tx.insert(aspnetusers).values({
          id: userId,
          email,
          normalizedEmail,
          userName: email,
          normalizedUserName: normalizedEmail,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          tenantId: invite.tenantId,
        });

        // create User role for this tenant
        await tx.insert(aspnetroles).values({
          id: roleId,
          name: "User",
          normalizedName: "USER",
          tenantId: invite.tenantId,
        });

        // assign role
        await tx.insert(aspnetuserroles).values({ userId, roleId });

        // mark invite as used
        await tx
          .update(invitations)
          .set({ isUsed: 1 })
          .where(eq(invitations.token, token));
      });

      return res.status(201).json({ message: "Account created successfully. Please login." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await db
        .select({
          id: aspnetusers.id,
          firstName: aspnetusers.firstName,
          lastName: aspnetusers.lastName,
          email: aspnetusers.email,
          isActive: aspnetusers.isActive,
          createdAt: aspnetusers.createdAt,
          role: aspnetroles.name,
        })
        .from(aspnetusers)
        .innerJoin(aspnetuserroles, eq(aspnetusers.id, aspnetuserroles.userId))
        .innerJoin(aspnetroles, eq(aspnetuserroles.roleId, aspnetroles.id))
        .where(eq(aspnetusers.tenantId, req.user!.tenantId));

      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  removeUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // make sure target user belongs to same tenant
      const [target] = await db
        .select({ tenantId: aspnetusers.tenantId })
        .from(aspnetusers)
        .where(eq(aspnetusers.id, userId as string));

      if (!target || target.tenantId !== req.user!.tenantId) {
        return res.status(404).json({ message: "User not found" });
      }

      // prevent removing another admin
      const [targetRole] = await db
        .select({ roleName: aspnetroles.name })
        .from(aspnetuserroles)
        .innerJoin(aspnetroles, eq(aspnetuserroles.roleId, aspnetroles.id))
        .where(eq(aspnetuserroles.userId, userId as string));

      if (targetRole?.roleName === "Admin") {
        return res.status(403).json({ message: "Cannot remove an admin" });
      }

      await db.delete(aspnetusers).where(eq(aspnetusers.id, userId as string));

      return res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};