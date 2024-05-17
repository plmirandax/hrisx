"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { CreateDepartmentSchema, UploadPayslipSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const UploadPayslip = async (values: z.infer<typeof UploadPayslipSchema>) => {
  const validatedFields = UploadPayslipSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { payslipFile, months, periods, userId } = validatedFields.data;

  await prisma.payslip.create({
    data: {
      payslipFile,
      months,
      periods,
      userId
    },
  });
  revalidatePath('/dashboard/settings')
  return { success: "Payslip uploaded successfully." };
};
