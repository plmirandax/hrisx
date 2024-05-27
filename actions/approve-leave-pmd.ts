"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { ApproveLeaveSchema, ApprovePMDSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const ApprovePMDRequest = async (values: z.infer<typeof ApprovePMDSchema> & { id: string }) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const ApprovedLeave = await prisma.leave.update({
      where: { id: values.id }, 
      data: {
        status: values.status,
        pmdStatus: values.pmdStatus,
        pmdRemarks: values.pmdRemarks
      },
    });

    revalidatePath('/dashboard/leave/pmd-posting')
    return { success: "Updated successfully!" };
  } catch (error) {
    return { error: "An error occurred while updating the leave request." };
  }
};
