import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body; // Extract userId from the request body

    if (!userId) {
      throw new Error('userId is missing in the request');
    }

    // Fetch leaves associated with the userId
    const leaves = await prisma.leave.findMany({
      where: { approverId: userId, status: 'Pending' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Return the fetched leaves data
    return NextResponse.json({
      status: 'success',
      leaves,
    });
  } catch (error) {
    console.error("Error during leaves fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching leaves',
    }, { status: 500 });
  }
}
