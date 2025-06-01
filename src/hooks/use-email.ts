import { useState } from "react";
import { toast } from "sonner";

interface EmailData {
  type: string;
  to: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  [key: string]: unknown;
}

interface EmailHookReturn {
  sendEmail: (emailData: EmailData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useEmail(): EmailHookReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (emailData: EmailData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Email enviado com sucesso!");
        return true;
      } else {
        const errorMessage = result.error || "Erro ao enviar email";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    } catch {
      const errorMessage = "Erro de conexão ao enviar email";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    isLoading,
    error,
  };
}

// Hook específico para envio de confirmação de consulta
export function useAppointmentEmail() {
  const { sendEmail, isLoading, error } = useEmail();

  const sendConfirmation = async (appointmentData: {
    to: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    clinicName: string;
    clinicAddress?: string;
  }) => {
    return sendEmail({
      type: "appointment-confirmation",
      ...appointmentData,
    });
  };

  const sendReminder = async (appointmentData: {
    to: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    clinicName: string;
  }) => {
    return sendEmail({
      type: "appointment-reminder",
      ...appointmentData,
    });
  };

  const sendCancellation = async (appointmentData: {
    to: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    clinicName: string;
    reason?: string;
  }) => {
    return sendEmail({
      type: "appointment-cancellation",
      ...appointmentData,
    });
  };

  return {
    sendConfirmation,
    sendReminder,
    sendCancellation,
    isLoading,
    error,
  };
}
