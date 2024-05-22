import * as z from "zod";
import { Months, Periods, Statuses, UserRole } from "@prisma/client";


export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.Administrator, UserRole.User, UserRole.Approver, UserRole.PMD]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  address: z.string().optional(),
  contactNo: z.string().optional(),
  approverId: z.string(),
  department: z.string().min(1, {
    message: "Department is required."
  }),
  role: z.enum([UserRole.Administrator, UserRole.User, UserRole.Approver]).optional(),
});

export const CreateLeaveTypeSchema = z.object({
  name: z.string().min(1, {
    message: "Leave Type is required",
  }),
  description: z.string().optional(),
});

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1, {
    message: "Department name is required."
  }),
  description: z.string().optional()
})

export const CreateLeaveSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(1, {
    message: "Reason is required"
  }),
  leaveType: z.string(),
  approverId: z.string(),
  userId: z.string(),
})

export const UploadPayslipSchema = z.object({
  payslipFile: z.string().min(1, {
    message: "Payslip is required."
  }),
  months: z.enum([Months.January, Months.February, Months.March, Months.April, Months.May,
    Months.June, Months.July, Months.August, Months.September, Months.October, Months.November, Months.December
  ]),
  periods: z.enum([Periods.FirstHalf, Periods.SecondHalf]),
  userId: z.string()
})

export const ApproveLeaveSchema = z.object({
  status: z.enum([Statuses.Approved, Statuses.Declined]),
  approverRemarks: z.string().min(1, {
    message: "Approver Remarks is required."
  })
})
