import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, password, name } = await request.json();

    // Find the current admin user (now using Supabase email)
    const admin = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: admin.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Security settings updated successfully",
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error("Security update error:", error);
    return NextResponse.json({ error: "Failed to update security settings" }, { status: 500 });
  }
}
