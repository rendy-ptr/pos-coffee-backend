// Interface untuk tipe data user dari token
interface JwtPayload {
  id: number;
}

// Tambahkan properti user ke Request dengan cara yang lebih aman
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export { JwtPayload };
