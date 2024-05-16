import { prisma } from "@/lib/db";

export const fetchDepartment = async () => {
  try {
    const leaveData = await prisma.department.findMany({
    });
    return leaveData;
  } catch (error) {
    console.error('Error fetching leave data:', error);
    return [];
  }
};
