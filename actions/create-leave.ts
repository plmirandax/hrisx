"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { CreateLeaveSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { sendLeaveNotif } from "@/lib/mail"; // Adjust the import path as needed
import { getEmailByApproverId, getEmailByUserId, getUserById } from "@/data/user"; // Adjust the import path as needed

export const CreateLeave = async (values: z.infer<typeof CreateLeaveSchema>) => {
  const validatedFields = CreateLeaveSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { startDate, endDate, leaveType, reason, approverId, userId, numberOfDays, } = validatedFields.data;

  // Create leave record
  await prisma.leave.create({
    data: {
      startDate,
      endDate,
      reason,
      leaveType,
      userId,
      approverId,
      numberOfDays
    },
  });

  // Retrieve the email associated with the given approverId
  const email = await getEmailByApproverId(approverId);
  const firstName = await getEmailByUserId(userId)
  const lastName = await getEmailByUserId(userId)

  // Send email notification to the approver
  await sendLeaveNotif(email, leaveType, firstName, lastName, startDate, endDate);

  // Revalidate the path
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leave');

  return { success: "Leave application successfully submitted!" };
};
