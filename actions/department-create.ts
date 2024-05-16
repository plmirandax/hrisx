"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { CreateDepartmentSchema } from "@/schemas";

export const createDepartment = async (values: z.infer<typeof CreateDepartmentSchema>) => {
  const validatedFields = CreateDepartmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, description } = validatedFields.data;

  await prisma.department.create({
    data: {
      name,
      description
    },
  });

  return { success: "Department created successfully!" };
};
