import { NextResponse } from "next/server";

import { deleteFileFromS3 } from "@/lib/aws/s3";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "Nome do arquivo não fornecido" },
        { status: 400 },
      );
    }

    await deleteFileFromS3(fileName);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro ao deletar arquivo",
      },
      { status: 500 },
    );
  }
}
