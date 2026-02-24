import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { name, icon, gradient, order } = body;

    const category = await prisma.skillCategory.update({
      where: { id },
      data: {
        name,
        icon,
        gradient,
        order: parseInt(order) || 0,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);

    // Check if there are skills in this category
    const skillsCount = await prisma.skill.count({
      where: { categoryId: id },
    });

    if (skillsCount > 0) {
      return NextResponse.json({ error: "Cannot delete category with associated skills" }, { status: 400 });
    }

    await prisma.skillCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
