"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { ApproveLeaveSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const ApproveLeaveRequest = async (values: z.infer<typeof ApproveLeaveSchema> & { id: string }) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const ApprovedLeave = await prisma.leave.update({
      where: { id: values.id }, // Ensure you're updating the leave by its ID
      data: {
        status: values.status,
        approverRemarks: values.approverRemarks,
      },
    });

    revalidatePath('/dashboard/leave')
    return { success: "Updated successfully!" };
  } catch (error) {
    return { error: "An error occurred while updating the leave request." };
  }
};
