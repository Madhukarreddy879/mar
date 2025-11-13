import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, course, message } = body;

    // Validate required fields
    if (!firstName || !email || !phone) {
      return NextResponse.json(
        { error: 'First name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if lead already exists with this email
    const existingLead = await prisma.lead.findUnique({
      where: { email }
    });

    if (existingLead) {
      return NextResponse.json(
        { error: 'A lead with this email already exists' },
        { status: 409 }
      );
    }

    // Create new lead
    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        course,
        message,
        source: 'website',
        status: 'new'
      }
    });

    return NextResponse.json(
      { 
        message: 'Lead created successfully',
        lead: {
          id: lead.id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          course: lead.course,
          message: lead.message,
          status: lead.status,
          createdAt: lead.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Protected route - Get all leads (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}