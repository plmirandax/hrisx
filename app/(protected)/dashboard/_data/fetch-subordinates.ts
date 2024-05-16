import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const fetchSubordinates = async (approverId: string) => {
  try {
    const subordinates = await prisma.user.findMany({
      where: { approverId },
    });
    return subordinates;
  } catch (error) {
    console.error('Error fetching leave data:', error);
    return [];
  }
};
