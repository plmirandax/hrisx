import { Statuses } from "@prisma/client";
import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const forApprovalSchema = z.object({
  id: z.string(),
  leaveType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string(),
  approverRemarks: z.string().optional(),
  status: z.string(),
});

export type ForApproval = z.infer<typeof forApprovalSchema>;