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
export const payslipSchema = z.object({
  id: z.string(),
  months: z.string(),
  periods: z.string(),
  payslipFile: z.string(),
  user: userSchema
});

export type Payslips = z.infer<typeof payslipSchema>;