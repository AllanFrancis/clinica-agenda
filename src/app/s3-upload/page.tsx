"use client";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ALLOWED_FILE_TYPES,
  formatFileSize,
  isValidFileType,
  MAX_FILE_SIZE,
} from "@/lib/aws/s3-config";

export default function S3UploadPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const urlBucket = process.env.NEXT_PUBLIC_AWS_BUCKET_URL;

  const fileUrl = (file: string) => urlBucket + file;

  async function fetchFiles() {
    const res = await fetch("/api/s3/list");
    const data = await res.json();
    setFiles(data.files || []);
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  function validateFile(file: File): string | null {
    if (!isValidFileType(file.type)) {
      return `Tipo de arquivo não permitido. Tipos permitidos: ${ALLOWED_FILE_TYPES.join(", ")}`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`;
    }

    return null;
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setUploading(true);

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Selecione um arquivo.");
      setUploading(false);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/s3/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao fazer upload.");
      }

      await fetchFiles();
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(fileName: string) {
    try {
      setDeleting(fileName);
      const res = await fetch(
        `/api/s3/delete?fileName=${encodeURIComponent(fileName)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error("Erro ao deletar arquivo");
      }

      await fetchFiles();
    } catch {
      setError("Erro ao deletar arquivo");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="mx-auto max-w-xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Upload para o S3</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Input
                type="file"
                ref={inputRef}
                accept={ALLOWED_FILE_TYPES.join(",")}
              />
              <p className="text-muted-foreground text-sm">
                Tipos permitidos: {ALLOWED_FILE_TYPES.join(", ")}. Tamanho
                máximo: {formatFileSize(MAX_FILE_SIZE)}
              </p>
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Enviando..." : "Enviar"}
            </Button>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </form>
          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Arquivos no bucket:</h3>
            <ul className="list-disc pl-5">
              {files.length === 0 && <li>Nenhum arquivo encontrado.</li>}
              {files.map((file) => (
                <li key={file} className="flex items-center gap-2 break-all">
                  <Avatar>
                    <AvatarImage src={fileUrl(file)} />
                    <AvatarFallback>{fileUrl(file)}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1">{fileUrl(file)}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(file)}
                    disabled={deleting === file}
                  >
                    {deleting === file ? "Deletando..." : "Deletar"}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
