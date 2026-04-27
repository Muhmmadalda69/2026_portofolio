import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";


export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(certifications);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const certification = await prisma.certification.create({
      data: {
        ...data,
        order: parseInt(data.order) || 0,
      },
    });

    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}
