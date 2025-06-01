// Test Email Service to debug import issues
export class TestEmailService {
  static async sendTestEmail() {
    return {
      success: true,
      message: "Test email service is working",
    };
  }
}

export default TestEmailService;
