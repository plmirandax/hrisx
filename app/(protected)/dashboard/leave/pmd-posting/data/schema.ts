import { z } from "zod"

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  image: z.string(),
});
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const leaveSchema = z.object({
  id: z.string(),
  leaveType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string(),
  status: z.string(),
  pmdStatus: z.string(),
  pmdRemarks: z.string(),
  approverRemarks: z.string(),
  user: userSchema, // Include the User schema here
});

export type Leaves = z.infer<typeof leaveSchema>;