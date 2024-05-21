"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { CreateDepartmentSchema, UploadPayslipSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { getEmailByUserId, getUserByEmail } from "@/data/user";
import { sendLeaveNotif, sendUploadNotif } from "@/lib/mail";

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

    // Retrieve the email associated with the given userId
    const email = await getEmailByUserId(userId);

    // Send email notification with the payslip URL
    await sendUploadNotif(email, payslipFile, months, periods);



  revalidatePath('/dashboard/settings')
  return { success: "Payslip uploaded successfully." };
};
