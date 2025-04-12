import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { encode } from "blurhash";
import { getPixels } from "@unpic/pixels";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    const folder = formData.get("folder")?.toString();

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files provided" },
        { status: 400 },
      );
    }

    const uploadPromises = files.map(async (file) => {
      if (!(file instanceof File)) {
        throw new Error("Invalid file type");
      }

      // Konversi file ke Data URI
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      // Menentukan resource_type berdasarkan file.type
      const resourceType = file.type.split("/")[0] as "image" | "video" | "raw";

      // Upload file ke Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: resourceType,
      });

      let blur = "";

      if (result.resource_type === "image") {
        const image = `https://res.cloudinary.com/dv6cln4gs/${result.resource_type}/upload/w_200/${result.public_id}`;
        const jpgData = await getPixels(image);
        const data = Uint8ClampedArray.from(jpgData.data);
        blur = encode(data, jpgData.width, jpgData.height, 4, 4);
      }

      return {
        url: result.secure_url,
        fileId: result.public_id,
        name: file.name,
        format: result.resource_type,
        blur,
      };
    });

    const results = await Promise.all(uploadPromises);
    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "File upload failed", error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json<{ fileId: string }>();
    const result = await cloudinary.uploader.destroy(body.fileId);
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error delete file" }, { status: 500 });
  }
}
