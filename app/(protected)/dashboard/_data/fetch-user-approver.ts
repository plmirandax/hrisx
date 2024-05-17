import { prisma } from "@/lib/db";

export const fetchUserApprover = async (approverId: string) => {
  try {
    const approvers = await prisma.user.findMany({
      where: {
        approverId
      }
    });
    return approvers;
  } catch (error) {
    console.error('Error fetching leave data:', error);
    return [];
  }
};
