interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export const emailTemplates = {
  newKasirAccount: (
    name: string,
    email: string,
    password: string
  ): EmailTemplate => {
    return {
      subject: 'Akun Kasir Anda Telah Dibuat - Aroma Kopi',

      text: `Halo ${name},

Selamat! Akun kasir Anda telah berhasil dibuat oleh Admin Aroma Kopi.

=== KREDENSIAL LOGIN ===
Email: ${email}
Password: ${password}

⚠️ PENTING: Segera ganti password Anda setelah login pertama untuk keamanan akun.

Terima kasih,
Tim Aroma Kopi`,

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; color: #333;">
  <div style="max-width: 480px; margin: 0 auto;">
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
      Halo <strong>${name}</strong>,
    </p>
    
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
      Akun kasir Anda telah dibuat. Berikut kredensial login Anda:
    </p>
    
    <div style="background-color: #f9f9f9; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px;">
        <span style="color: #666;">Email:</span> <strong>${email}</strong>
      </p>
      <p style="margin: 0; font-size: 14px;">
        <span style="color: #666;">Password:</span> <strong style="font-family: monospace;">${password}</strong>
      </p>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; color: #666;">
      Segera ganti password Anda setelah login pertama.
    </p>
    
    <p style="font-size: 14px; margin: 0; color: #999;">
      — Tim Aroma Kopi
    </p>
  </div>
</body>
</html>`,
    };
  },
};
