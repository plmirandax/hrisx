"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { CreateLeaveTypeSchema } from "@/schemas";

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

  return { success: "Leave type created successfully!" };
};
