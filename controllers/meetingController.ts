/// <reference path="../types/express.d.ts" />
import type { Request, Response } from "express";
import { db } from "../lib/index.js";
import { meetings, prospects, leads, staffs, aspnetusers } from "../lib/db/schema.js";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "../utils/mailer.js";

const meetingController = {
  // GET /meeting
  getMeeting: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tenantId = req.user!.tenantId;
      const meeting = await db
        .select({
          meetingId: meetings.meetingId,
          title: meetings.title,
          meetingType: meetings.meetingType,
          status: meetings.status,
          scheduledAt: meetings.scheduledAt,
          durationMinutes: meetings.durationMinutes,
          address: meetings.address,
          notes: meetings.notes,
          leadId: meetings.leadId,
          staffId: meetings.staffId,
          prospectId: meetings.prospectId,
          prospect: {
            prospectId: prospects.prospectId,
            fullName: prospects.fullName,
            email: prospects.email,
            primaryPhone: prospects.primaryPhone,
          },
        })
        .from(meetings)
        .leftJoin(prospects, eq(meetings.prospectId, prospects.prospectId))
        .where(and(
          eq(meetings.meetingId, parseInt(id as string)),
          eq(meetings.tenantId, tenantId)
        ))
        .then((r) => r[0]);

      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }

      return res.status(200).json(meeting);
    } catch (error) {
      console.error("Error fetching meeting", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET /meetings
  getMeetings: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId;
      const allMeetings = await db
        .select({
          meetingId: meetings.meetingId,
          title: meetings.title,
          meetingType: meetings.meetingType,
          status: meetings.status,
          scheduledAt: meetings.scheduledAt,
          durationMinutes: meetings.durationMinutes,
          address: meetings.address,
          notes: meetings.notes,
          prospect: {
            prospectId: prospects.prospectId,
            fullName: prospects.fullName,
            email: prospects.email,
            primaryPhone: prospects.primaryPhone,
          },
        })
        .from(meetings)
        .leftJoin(prospects, eq(meetings.prospectId, prospects.prospectId))
        .where(eq(meetings.tenantId, tenantId));

      return res.status(200).json(allMeetings);
    } catch (error) {
      console.error("Error fetching meetings", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // POST /meetings
  createMeeting: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic
      const {
        title,
        meetingType,
        prospectId,
        leadId,
        staffId,
        scheduledAt,
        durationMinutes,
        address,
        notes,
      } = req.body;

      // Fetch prospect for email
      const prospect = await db
        .select()
        .from(prospects)
        .where(and(eq(prospects.prospectId, prospectId), eq(prospects.tenantId, tenantId)))
        .then((r) => r[0]);

      if (!prospect) {
        return res.status(404).json({ error: "Prospect not found" });
      }

      // Insert meeting
      const [inserted] = await db.insert(meetings).values({
        tenantId: tenantId,
        title,
        meetingType,
        prospectId,
        leadId: leadId ?? null,
        staffId: staffId ?? null,
        scheduledAt,
        durationMinutes: durationMinutes ?? 60,
        address: address ?? null,
        status: "pending",
        notes: notes ?? null,
      });

      const meetingId = inserted.insertId;
      const confirmUrl = `${process.env.BACKEND_URL}/apis/meeting/meetings/${meetingId}/confirm`;

      const formattedDate = new Date(scheduledAt).toLocaleString("en-PK", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Karachi",
      });

      const locationInfo =
        meetingType === "on_location"
          ? `📍 Location: ${address}<br><br><a href="https://maps.google.com/?q=${encodeURIComponent(address)}">Get Directions</a>`
          : `📅 This is an online meeting. Details will be shared upon confirmation.`;

      const staffWithEmail = staffId ? await db
        .select({
          email: aspnetusers.email,
          firstName: aspnetusers.firstName,
          lastName: aspnetusers.lastName,
        })
        .from(staffs)
        .leftJoin(aspnetusers, eq(staffs.aspNetUserId, aspnetusers.id))
        .where(and(eq(staffs.staffId, staffId), eq(staffs.tenantId, tenantId)))
        .then((r) => r[0])
        : null;

      // Email to prospect
      if (prospect.email) {
        await sendEmail(
          prospect.email,
          `Meeting Request: ${title}`,
          `
            <h2>Hello ${prospect.fullName},</h2>
            <p>You have been invited to a meeting with ${staffWithEmail?.firstName ?? 'Our Staff'} ${staffWithEmail?.lastName ?? ''}.</p>
            <p><strong>📌 ${title}</strong></p>
            <p>🕐 ${formattedDate}</p>
            <p>${locationInfo}</p>
            <br/>
            <a href="${confirmUrl}" style="
              background:#007A55;
              color:white;
              padding:12px 24px;
              border-radius:6px;
              text-decoration:none;
              font-weight:bold;
            ">Confirm Meeting</a>
            <br/><br/>
            <p>If you have any questions, please contact us.</p>
          `
        );
      }

      // Email to staff
      if (staffWithEmail?.email) {
        await sendEmail(
          staffWithEmail.email,
          `Meeting Created: ${title}`,
          `
              <h2>Hello ${staffWithEmail.firstName},</h2>
              <p>You have scheduled a new meeting with ${prospect.fullName}.</p>
              <p><strong>📌 ${title}</strong></p>
              <p>🕐 ${formattedDate}</p>
              <p>${locationInfo}</p>
              <p>Status: <strong>Pending prospect confirmation</strong></p>
            `
        );
      }

      return res.status(201).json({
        message: "Meeting created successfully",
        meetingId,
      });
    } catch (error) {
      console.error("Error creating meeting", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET /meetings/:id/confirm  (prospect clicks link in email)
  confirmMeeting: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic
      const { id } = req.params;

      const meeting = await db
        .select()
        .from(meetings)
        // .where(eq(meetings.meetingId, parseInt(id as string)))
        .where(and(eq(meetings.meetingId, parseInt(id as string)), eq(meetings.tenantId, tenantId)))
        .then((r) => r[0]);

      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }

      if (meeting.status === "confirmed") {
        return res.redirect(
          `${process.env.FRONTEND_URL}/meeting-confirmed?already=true`
        );
      }

      // Update status
      await db
        .update(meetings)
        // .set({ status: "confirmed", updatedAt: new Date().toISOString() })
        .set({ status: "confirmed", updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') })
        .where(eq(meetings.meetingId, parseInt(id as string)));

      // Fetch prospect
      const prospect = meeting.prospectId
        ? await db
          .select()
          .from(prospects)
          // .where(eq(prospects.prospectId, meeting.prospectId))
          .where(and(eq(prospects.prospectId, meeting.prospectId!), eq(prospects.tenantId, tenantId)))
          .then((r) => r[0])
        : null;

      const formattedDate = new Date(meeting.scheduledAt!).toLocaleString("en-PK", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Karachi",
      });

      const locationInfo =
        meeting.meetingType === "on_location"
          ? `📍 Location: ${meeting.address}<br><a href="https://maps.google.com/?q=${encodeURIComponent(meeting.address ?? "")}">Get Directions</a>`
          : `This is an online meeting.`;

      const staffDetails = meeting.staffId
        ? await db
          .select({
            firstName: aspnetusers.firstName,
            lastName: aspnetusers.lastName,
            email: aspnetusers.email,
          })
          .from(staffs)
          .leftJoin(aspnetusers, eq(staffs.aspNetUserId, aspnetusers.id))
          .where(and(eq(staffs.staffId, meeting.staffId), eq(staffs.tenantId, tenantId)))
          .then((r) => r[0])
        : null;

      // Confirmation email to prospect
      if (prospect?.email) {
        await sendEmail(
          prospect.email,
          `Meeting Confirmed: ${meeting.title}`,
          `
            <h2>Hello ${prospect.fullName},</h2>
            <p>Your meeting has been <strong>confirmed with ${staffDetails?.firstName} ${staffDetails?.lastName}</strong>!</p>
            <p><strong>📌 ${meeting.title}</strong></p>
            <p>🕐 ${formattedDate}</p>
            <p>${locationInfo}</p>
            <p>We look forward to seeing you!</p>
          `
        );
      }

      // Redirect prospect to a nice confirmation page
      return res.redirect(
        `${process.env.FRONTEND_URL}/meeting-confirmed`
      );
    } catch (error) {
      console.error("Error confirming meeting", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // PATCH /meetings/:id
  updateMeeting: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic
      const { id } = req.params;
      const updates = req.body;

      await db
        .update(meetings)
        // .set({ ...updates, updatedAt: new Date().toISOString() })
        .set({ ...updates, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') })
        .where(
          and(
            eq(meetings.meetingId, parseInt(id as string)),
            eq(meetings.tenantId, tenantId)
          )
        );

      return res.status(200).json({ message: "Meeting updated successfully" });
    } catch (error) {
      console.error("Error updating meeting", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // DELETE /meetings/:id
  deleteMeeting: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.tenantId; // 🔹 dynamic
      const { id } = req.params;

      await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.meetingId, parseInt(id as string)),
            eq(meetings.tenantId, tenantId)
          )
        );

      return res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (error) {
      console.error("Error deleting meeting", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default meetingController;