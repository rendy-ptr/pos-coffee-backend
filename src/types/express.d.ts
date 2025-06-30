// Interface untuk tipe data user dari token
interface JwtPayload {
  id: number;
  email: string;
  role: 'customer' | 'kasir' | 'admin';
}

// Tambahkan properti user ke Request dengan cara yang lebih aman
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export { JwtPayload };
