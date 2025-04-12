import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest) {
  try {
    const { fileIds } = (await req.json()) as { fileIds: string[] };

    const results = await Promise.all(
      fileIds.map((id) => cloudinary.uploader.destroy(id)),
    );

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error delete files";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
