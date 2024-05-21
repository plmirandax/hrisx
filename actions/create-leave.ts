"use server";

import * as z from "zod";


import { prisma } from "@/lib/db";
import { CreateLeaveSchema, CreateLeaveTypeSchema, RegisterSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { sendLeaveNotif, sendUploadNotif } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { getEmailByApproverId, getEmailByUserId } from "@/data/user";


export const CreateLeave = async (values: z.infer<typeof CreateLeaveSchema>) => {
  const validatedFields = CreateLeaveSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { startDate, endDate, leaveType, reason, approverId, userId } = validatedFields.data;


  await prisma.leave.create({
    data: {
      startDate,
      endDate,
      reason,
      leaveType,
      userId,
      approverId
    },
  });

      // Retrieve the email associated with the given userId
      const email = await getEmailByApproverId(approverId);

      // Send email notification with the payslip URL
      await sendLeaveNotif(email, leaveType);

  revalidatePath('/dashboard');
  return { success: "Leave application successfully submitted!" };

};
