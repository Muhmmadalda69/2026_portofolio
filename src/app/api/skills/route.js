import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
      include: {
        categoryRel: true,
      },
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Process data for Prisma
    const payload = {
      ...data,
      categoryId: data.categoryId ? parseInt(data.categoryId) : null,
    };

    // If 'category' is missing but 'categoryId' is present (new behavior),
    // we can either leave 'category' null (since it's now optional)
    // or set a placeholder for old logic if needed.
    if (!payload.category) {
      delete payload.category;
    }

    const skill = await prisma.skill.create({
      data: payload,
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
