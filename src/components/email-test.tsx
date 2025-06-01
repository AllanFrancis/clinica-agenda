"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppointmentEmail, useEmail } from "@/hooks/use-email";

export function EmailTestComponent() {
  const { sendEmail, isLoading: genericLoading } = useEmail();
  const {
    sendConfirmation,
    sendReminder,
    sendCancellation,
    isLoading: appointmentLoading,
  } = useAppointmentEmail();

  const [emailType, setEmailType] = useState("generic");
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    patientName: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",
    clinicName: "",
    clinicAddress: "",
    userName: "",
    reason: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendGenericEmail = async () => {
    await sendEmail({
      type: "generic",
      to: formData.to,
      subject: formData.subject,
      html: `<p>Este é um email de teste enviado em ${new Date().toLocaleString()}.</p>`,
    });
  };

  const handleSendAppointmentConfirmation = async () => {
    await sendConfirmation({
      to: formData.to,
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      clinicName: formData.clinicName,
      clinicAddress: formData.clinicAddress,
    });
  };

  const handleSendReminder = async () => {
    await sendReminder({
      to: formData.to,
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      clinicName: formData.clinicName,
    });
  };

  const handleSendCancellation = async () => {
    await sendCancellation({
      to: formData.to,
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      clinicName: formData.clinicName,
      reason: formData.reason,
    });
  };

  const handleSendWelcome = async () => {
    await sendEmail({
      type: "welcome",
      to: formData.to,
      userName: formData.userName,
      clinicName: formData.clinicName,
    });
  };

  const isLoading = genericLoading || appointmentLoading;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste do Sistema de Emails - Resend</CardTitle>
          <CardDescription>
            Use este formulário para testar o envio de emails através do Resend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emailType">Tipo de Email</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generic">Email Genérico</SelectItem>
                  <SelectItem value="appointment-confirmation">
                    Confirmação de Consulta
                  </SelectItem>
                  <SelectItem value="appointment-reminder">
                    Lembrete de Consulta
                  </SelectItem>
                  <SelectItem value="appointment-cancellation">
                    Cancelamento de Consulta
                  </SelectItem>
                  <SelectItem value="welcome">Boas-vindas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="to">Email de Destino</Label>
              <Input
                id="to"
                type="email"
                value={formData.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                placeholder="destinatario@email.com"
              />
            </div>
          </div>

          {emailType === "generic" && (
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Assunto do email"
              />
            </div>
          )}

          {emailType === "welcome" && (
            <div>
              <Label htmlFor="userName">Nome do Usuário</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                placeholder="João Silva"
              />
            </div>
          )}

          {emailType.startsWith("appointment") && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Nome do Paciente</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) =>
                      handleInputChange("patientName", e.target.value)
                    }
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <Label htmlFor="doctorName">Nome do Médico</Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) =>
                      handleInputChange("doctorName", e.target.value)
                    }
                    placeholder="Dr. Maria Santos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointmentDate">Data da Consulta</Label>
                  <Input
                    id="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                      handleInputChange("appointmentDate", e.target.value)
                    }
                    placeholder="15/06/2025"
                  />
                </div>

                <div>
                  <Label htmlFor="appointmentTime">Horário da Consulta</Label>
                  <Input
                    id="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={(e) =>
                      handleInputChange("appointmentTime", e.target.value)
                    }
                    placeholder="14:30"
                  />
                </div>
              </div>
            </>
          )}

          {(emailType.startsWith("appointment") || emailType === "welcome") && (
            <div>
              <Label htmlFor="clinicName">Nome da Clínica</Label>
              <Input
                id="clinicName"
                value={formData.clinicName}
                onChange={(e) =>
                  handleInputChange("clinicName", e.target.value)
                }
                placeholder="Clínica São José"
              />
            </div>
          )}

          {emailType.startsWith("appointment") && (
            <div>
              <Label htmlFor="clinicAddress">
                Endereço da Clínica (opcional)
              </Label>
              <Input
                id="clinicAddress"
                value={formData.clinicAddress}
                onChange={(e) =>
                  handleInputChange("clinicAddress", e.target.value)
                }
                placeholder="Rua das Flores, 123"
              />
            </div>
          )}

          {emailType === "appointment-cancellation" && (
            <div>
              <Label htmlFor="reason">Motivo do Cancelamento (opcional)</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="Reagendamento solicitado pelo paciente"
              />
            </div>
          )}

          <div className="flex gap-2">
            {emailType === "generic" && (
              <Button
                onClick={handleSendGenericEmail}
                disabled={isLoading || !formData.to || !formData.subject}
              >
                {isLoading ? "Enviando..." : "Enviar Email Genérico"}
              </Button>
            )}

            {emailType === "appointment-confirmation" && (
              <Button
                onClick={handleSendAppointmentConfirmation}
                disabled={
                  isLoading ||
                  !formData.to ||
                  !formData.patientName ||
                  !formData.doctorName
                }
              >
                {isLoading ? "Enviando..." : "Enviar Confirmação"}
              </Button>
            )}

            {emailType === "appointment-reminder" && (
              <Button
                onClick={handleSendReminder}
                disabled={
                  isLoading ||
                  !formData.to ||
                  !formData.patientName ||
                  !formData.doctorName
                }
              >
                {isLoading ? "Enviando..." : "Enviar Lembrete"}
              </Button>
            )}

            {emailType === "appointment-cancellation" && (
              <Button
                onClick={handleSendCancellation}
                disabled={
                  isLoading ||
                  !formData.to ||
                  !formData.patientName ||
                  !formData.doctorName
                }
              >
                {isLoading ? "Enviando..." : "Enviar Cancelamento"}
              </Button>
            )}

            {emailType === "welcome" && (
              <Button
                onClick={handleSendWelcome}
                disabled={isLoading || !formData.to || !formData.userName}
              >
                {isLoading ? "Enviando..." : "Enviar Boas-vindas"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções de Configuração</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              Acesse{" "}
              <a
                href="https://resend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                resend.com
              </a>{" "}
              e crie uma conta
            </li>
            <li>Obtenha sua API key no painel de controle</li>
            <li>
              Adicione{" "}
              <code className="rounded bg-gray-100 px-2 py-1">
                RESEND_API_KEY=sua_chave_aqui
              </code>{" "}
              no arquivo <code>.env.local</code>
            </li>
            <li>Reinicie o servidor de desenvolvimento</li>
            <li>Use este formulário para testar o envio de emails</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
