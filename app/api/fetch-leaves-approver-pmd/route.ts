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
      where: { pmdStatus: 'Pending', status: 'Approved' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const leavesDeclined = await prisma.leave.findMany({
      where: { status: 'Declined' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const leavesApproved = await prisma.leave.findMany({
      where: { status: 'Approved' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const leavesTotal = await prisma.leave.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Return the fetched leaves data
    return NextResponse.json({
      status: 'success',
      leaves,
      leavesApproved,
      leavesDeclined,
      leavesTotal
    });
  } catch (error) {
    console.error("Error during leaves fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching leaves',
    }, { status: 500 });
  }
}
