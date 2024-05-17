import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const fetchLeaveDataUser = async (userId: string) => {
  try {
    const leaveData = await prisma.leave.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            department: true
          },
        },
      },
    });
    return leaveData;
  } catch (error) {
    console.error('Error fetching leave data:', error);
    return [];
  }
};
