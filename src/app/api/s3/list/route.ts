import { NextResponse } from "next/server";

import { listFilesInBucket } from "@/lib/aws/s3";

export async function GET() {
  try {
    const files = await listFilesInBucket();
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro ao listar arquivos" },
      { status: 500 },
    );
  }
}
