"use server";

import * as z from "zod";


import { prisma } from "@/lib/db";
import { CreateLeaveSchema, CreateLeaveTypeSchema, RegisterSchema } from "@/schemas";
import { revalidatePath } from "next/cache";


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
  revalidatePath('/dashboard');
  return { success: "Leave application successfully submitted!" };

};
