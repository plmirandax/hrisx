"use server"
import { prisma } from "@/lib/db";


export const fetchLeaveDataApprover = async (approverId: string) => {
  try {
    const leaveData = await prisma.leave.findMany({
      where: { approverId, status: 'Pending' },
      include: {
        user: {
          select: {
            id: true,
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
