# Configuração do Resend

Este documento explica como configurar e usar o Resend para envio de emails no sistema de clínica.

## 1. Configuração Inicial

### 1.1 Obter API Key do Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta ou faça login
3. Vá para o painel de controle
4. Clique em "API Keys"
5. Crie uma nova API key
6. Copie a chave gerada

### 1.2 Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` e adicione sua chave da API:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

### 1.3 Configurar Domínio (Opcional mas Recomendado)

Para usar um domínio personalizado:

1. No painel do Resend, vá para "Domains"
2. Adicione seu domínio
3. Configure os registros DNS conforme instruído
4. Aguarde a verificação
5. Atualize o arquivo `src/lib/resend.ts` com seu domínio

## 2. Estrutura dos Arquivos

```
src/
├── lib/
│   ├── resend.ts           # Configuração do Resend
│   └── email-service.ts    # Serviços de email
├── hooks/
│   └── use-email.ts        # Hook para usar nos componentes
└── app/api/
    └── email/
        └── route.ts        # API route para emails
```

## 3. Uso nos Componentes

### 3.1 Hook Básico

```tsx
import { useEmail } from "@/hooks/use-email";

export function MyComponent() {
  const { sendEmail, isLoading, error } = useEmail();

  const handleSendEmail = async () => {
    await sendEmail({
      type: "generic",
      to: "user@example.com",
      subject: "Teste",
      html: "<p>Olá!</p>",
    });
  };

  return (
    <button onClick={handleSendEmail} disabled={isLoading}>
      {isLoading ? "Enviando..." : "Enviar Email"}
    </button>
  );
}
```

### 3.2 Hook para Consultas

```tsx
import { useAppointmentEmail } from "@/hooks/use-email";

export function AppointmentComponent() {
  const { sendConfirmation, isLoading } = useAppointmentEmail();

  const handleConfirmAppointment = async () => {
    await sendConfirmation({
      to: "paciente@email.com",
      patientName: "João Silva",
      doctorName: "Dr. Maria Santos",
      appointmentDate: "15/06/2025",
      appointmentTime: "14:30",
      clinicName: "Clínica São José",
      clinicAddress: "Rua das Flores, 123",
    });
  };

  return (
    <button onClick={handleConfirmAppointment} disabled={isLoading}>
      Confirmar Consulta
    </button>
  );
}
```

## 4. Tipos de Email Disponíveis

### 4.1 Confirmação de Consulta

- **Tipo**: `appointment-confirmation`
- **Quando usar**: Após agendar uma consulta
- **Dados necessários**: patientName, doctorName, appointmentDate, appointmentTime, clinicName

### 4.2 Lembrete de Consulta

- **Tipo**: `appointment-reminder`
- **Quando usar**: 1 dia antes da consulta
- **Dados necessários**: patientName, doctorName, appointmentDate, appointmentTime, clinicName

### 4.3 Cancelamento de Consulta

- **Tipo**: `appointment-cancellation`
- **Quando usar**: Quando uma consulta é cancelada
- **Dados necessários**: patientName, doctorName, appointmentDate, appointmentTime, clinicName, reason (opcional)

### 4.4 Boas-vindas

- **Tipo**: `welcome`
- **Quando usar**: Quando um novo usuário se cadastra
- **Dados necessários**: userName, clinicName (opcional)

## 5. API Endpoints

### 5.1 Enviar Email

- **Endpoint**: `POST /api/email`
- **Body**: `{ type: string, ...emailData }`

### 5.2 Verificar Configuração

- **Endpoint**: `GET /api/email`
- **Retorna**: Status da configuração

## 6. Testando a Configuração

Para testar se o Resend está configurado corretamente:

```bash
curl http://localhost:3000/api/email
```

Ou acesse diretamente no navegador: `http://localhost:3000/api/email`

## 7. Personalização

### 7.1 Templates de Email

Os templates estão definidos em `src/lib/email-service.ts`. Você pode:

- Modificar o HTML dos emails
- Adicionar novos tipos de email
- Personalizar estilos CSS inline

### 7.2 Configurações

Edite `src/lib/resend.ts` para:

- Alterar o email de origem
- Modificar o email de resposta
- Adicionar novos templates

## 8. Monitoramento

Para monitorar os emails enviados:

1. Acesse o painel do Resend
2. Vá para "Logs"
3. Visualize status de entrega, aberturas, etc.

## 9. Limites e Pricing

- **Plano gratuito**: 100 emails/dia, 3.000 emails/mês
- **Planos pagos**: Disponíveis para volumes maiores
- Verifique os limites atuais em [resend.com/pricing](https://resend.com/pricing)

## 10. Automação de Lembretes

### 10.1 API de Lembretes

O sistema inclui uma API para envio automático de lembretes:

- **Endpoint**: `POST /api/reminders`
- **Parâmetros**:
  - `type`: "tomorrow" ou "same-day"
  - `hoursAhead`: número de horas antecipadas (para same-day)

### 10.2 Exemplos de Uso

```bash
# Enviar lembretes para consultas de amanhã
curl -X POST http://localhost:3000/api/reminders \
  -H "Content-Type: application/json" \
  -d '{"type": "tomorrow"}'

# Enviar lembretes para consultas nas próximas 2 horas
curl -X POST http://localhost:3000/api/reminders \
  -H "Content-Type: application/json" \
  -d '{"type": "same-day", "hoursAhead": 2}'
```

### 10.3 Configuração de Cron Job

Para automatizar completamente, configure um cron job:

```bash
# Lembretes diários às 18h para consultas do dia seguinte
0 18 * * * curl -X POST http://seu-dominio.com/api/reminders -H "Content-Type: application/json" -d '{"type": "tomorrow"}'

# Lembretes a cada 2 horas durante horário comercial
0 8,10,12,14,16 * * * curl -X POST http://seu-dominio.com/api/reminders -H "Content-Type: application/json" -d '{"type": "same-day", "hoursAhead": 2}'
```

## 11. Página de Teste

Acesse `/email-test` para usar a interface de teste do sistema de emails.

## 12. Troubleshooting

### Erro: "API key not found"

- Verifique se a `RESEND_API_KEY` está definida no `.env.local`
- Reinicie o servidor de desenvolvimento

### Erro: "Domain not verified"

- Use o domínio padrão do Resend ou configure seu próprio domínio
- Aguarde a verificação DNS completar

### Emails não chegam

- Verifique spam/lixo eletrônico
- Confirme se o email de destino está correto
- Verifique os logs no painel do Resend

### Erro: "Rate limit exceeded"

- Verifique se não está excedendo o limite do plano
- Implemente delay entre envios se necessário
