import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all properties from the database
    const employees = await prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            contactNo: true,
            address: true,
            role: true,
            department: true
          },
          orderBy: {
            createdAt: 'desc',
          },
    });

    // Return the fetched properties
    return NextResponse.json({
      status: 'success',
      employees
    });
  } catch (error) {
    console.error("Error during properties fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching properties',
    }, { status: 500 });
  }
}