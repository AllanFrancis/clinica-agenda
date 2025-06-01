import { Resend } from "resend";

const apiKey =
  process.env.RESEND_API_KEY || "re_123456789_fake_key_for_development";
const resend = new Resend(apiKey);

// Check if Resend is properly configured
const isResendConfigured = () => {
  return (
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== "your_resend_api_key_here"
  );
};

// Email configuration
const EMAIL_CONFIG = {
  from: "Clínica Agenda <noreply@tatamepro.com.br>", // Replace with your verified domain
  replyTo: "onboarding@resend.dev", // Replace with your support email
};

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export class EmailService {
  /**
   * Send a generic email
   */
  static async sendEmail(options: EmailOptions) {
    try {
      // Check if Resend is properly configured
      if (!isResendConfigured()) {
        console.warn("Resend is not properly configured. Email not sent.");
        return {
          success: false,
          error:
            "Resend API key is not configured. Please set RESEND_API_KEY in your environment variables.",
        };
      }

      // Simple email structure that works with Resend
      const emailPayload = {
        from: EMAIL_CONFIG.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        replyTo: EMAIL_CONFIG.replyTo,
        text: options.text || "Email enviado pelo sistema de clínica.",
        ...(options.html && { html: options.html }),
      };

      const response = await resend.emails.send(emailPayload);

      console.log("Email sent successfully:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }
  }

  /**
   * Send appointment confirmation email
   */
  static async sendAppointmentConfirmation({
    to,
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    clinicName,
    clinicAddress,
  }: {
    to: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    clinicName: string;
    clinicAddress?: string;
  }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Confirmação de Consulta</h2>
        <p>Olá <strong>${patientName}</strong>,</p>
        
        <p>Sua consulta foi confirmada com sucesso!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalhes da Consulta:</h3>
          <p><strong>Médico:</strong> ${doctorName}</p>
          <p><strong>Data:</strong> ${appointmentDate}</p>
          <p><strong>Horário:</strong> ${appointmentTime}</p>
          <p><strong>Clínica:</strong> ${clinicName}</p>
          ${clinicAddress ? `<p><strong>Endereço:</strong> ${clinicAddress}</p>` : ""}
        </div>
        
        <p>Por favor, chegue com 15 minutos de antecedência.</p>
        
        <p>Se precisar reagendar ou cancelar, entre em contato conosco.</p>
        
        <p>Atenciosamente,<br>Equipe ${clinicName}</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: `Confirmação de Consulta - ${clinicName}`,
      html,
    });
  }

  /**
   * Send appointment reminder email
   */
  static async sendAppointmentReminder({
    to,
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    clinicName,
  }: {
    to: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    clinicName: string;
  }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Lembrete de Consulta</h2>
        <p>Olá <strong>${patientName}</strong>,</p>
        
        <p>Este é um lembrete da sua consulta marcada para amanhã:</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalhes da Consulta:</h3>
          <p><strong>Médico:</strong> ${doctorName}</p>
          <p><strong>Data:</strong> ${appointmentDate}</p>
          <p><strong>Horário:</strong> ${appointmentTime}</p>
          <p><strong>Clínica:</strong> ${clinicName}</p>
        </div>
        
        <p>Lembre-se de chegar com 15 minutos de antecedência.</p>
        
        <p>Até amanhã!</p>
        
        <p>Atenciosamente,<br>Equipe ${clinicName}</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: `Lembrete: Consulta amanhã - ${clinicName}`,
      html,
    });
  }

  /**
   * Send appointment cancellation email
   */
  static async sendAppointmentCancellation({
    to,
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    clinicName,
    reason,
  }: {
    to: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    clinicName: string;
    reason?: string;
  }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Cancelamento de Consulta</h2>
        <p>Olá <strong>${patientName}</strong>,</p>
        
        <p>Informamos que sua consulta foi cancelada:</p>
        
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Consulta Cancelada:</h3>
          <p><strong>Médico:</strong> ${doctorName}</p>
          <p><strong>Data:</strong> ${appointmentDate}</p>
          <p><strong>Horário:</strong> ${appointmentTime}</p>
          <p><strong>Clínica:</strong> ${clinicName}</p>
          ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ""}
        </div>
        
        <p>Por favor, entre em contato conosco para reagendar sua consulta.</p>
        
        <p>Atenciosamente,<br>Equipe ${clinicName}</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: `Consulta Cancelada - ${clinicName}`,
      html,
    });
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail({
    to,
    userName,
    clinicName,
  }: {
    to: string;
    userName: string;
    clinicName?: string;
  }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Bem-vindo ao Sistema de Agenda!</h2>
        <p>Olá <strong>${userName}</strong>,</p>
        
        <p>Seja bem-vindo ao nosso sistema de agendamento de consultas!</p>
        
        ${clinicName ? `<p>Você foi cadastrado na clínica <strong>${clinicName}</strong>.</p>` : ""}
        
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">O que você pode fazer:</h3>
          <ul>
            <li>Agendar consultas online</li>
            <li>Visualizar seus agendamentos</li>
            <li>Receber lembretes por email</li>
            <li>Gerenciar seu perfil</li>
          </ul>
        </div>
        
        <p>Se você tiver alguma dúvida, não hesite em entrar em contato conosco.</p>
        
        <p>Atenciosamente,<br>Equipe do Sistema de Agenda</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: "Bem-vindo ao Sistema de Agenda!",
      html,
    });
  }
}

// Export both named and default for flexibility
export default EmailService;
