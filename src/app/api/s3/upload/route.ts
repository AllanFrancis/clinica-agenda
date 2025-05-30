import { NextResponse } from "next/server";

import { uploadFileToS3 } from "@/lib/aws/s3";
import { isValidFileType, MAX_FILE_SIZE } from "@/lib/aws/s3-config";

export async function POST(request: Request) {
  const data = await request.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  if (!isValidFileType(file.type)) {
    return NextResponse.json(
      { error: "Tipo de arquivo não permitido" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const url = await uploadFileToS3(buffer, file.name, file.type);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao fazer upload",
      },
      { status: 500 },
    );
  }
}
