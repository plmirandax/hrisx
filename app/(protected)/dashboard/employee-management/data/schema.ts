import { z } from "zod"


const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  image: z.string(),
  role: z.string(),
  department: z.string(),
  contactNo: z.string(),
  address: z.string(),
});


export type Employees = z.infer<typeof userSchema>;