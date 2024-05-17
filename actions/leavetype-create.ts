"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { CreateLeaveTypeSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createLeaveType = async (values: z.infer<typeof CreateLeaveTypeSchema>) => {
  const validatedFields = CreateLeaveTypeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, description } = validatedFields.data;

  await prisma.leaveType.create({
    data: {
      name,
      description
    },
  });
  revalidatePath('/dashboard/settings')
  return { success: "Leave type created successfully!" };
};
