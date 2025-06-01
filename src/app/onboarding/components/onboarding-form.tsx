"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Upload } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createClinicAction } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const onboardingSchema = z.object({
  name: z.string().min(1, "Nome da clínica é obrigatório"),
  logo: z.any().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/s3/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload da imagem");
      }

      const data = await response.json();
      setLogoUrl(data.url);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  const onSubmit = async (data: OnboardingFormData) => {
    try {
      await createClinicAction({
        name: data.name,
        logo: logoUrl || undefined,
      });

      // Redirecionar para o dashboard após criar a clínica
      router.push("/dashboard");
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      console.error("Erro ao criar clínica:", error);
      alert("Erro ao criar clínica. Tente novamente.");
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Criar sua clínica</CardTitle>
        <CardDescription>
          Configure sua clínica em poucos passos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Upload de Logo */}
            <div className="space-y-2">
              <Label htmlFor="logo" className="flex">
                Logo da clínica{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>{" "}
              {logoUrl ? (
                <div className="relative">
                  <Image
                    src={logoUrl}
                    alt="Logo da clínica"
                    className="rounded-lg border border-gray-200 object-contain"
                    width={96}
                    height={96}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setLogoUrl(null);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="flex w-full flex-col">
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-600">
                      Clique para fazer upload do logo
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG ou JPEG até 5MB
                    </p>
                  </div>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="logo"
                    className={`cursor-pointer ${
                      isUploading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      disabled={isUploading}
                      asChild
                    >
                      <span>
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Fazendo upload...
                          </>
                        ) : (
                          "Selecionar arquivo"
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {/* Nome da Clínica */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da clínica *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome da sua clínica"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormDescription>
                    Este será o nome exibido em todo o sistema
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão de Submit */}
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={form.formState.isSubmitting || isUploading}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando clínica...
                </>
              ) : (
                "Criar clínica e continuar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
