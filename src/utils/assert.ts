import { AuthRequest } from '@/types/auth';

export function assertHasUser(
  req: AuthRequest
): asserts req is AuthRequest & { user: NonNullable<AuthRequest['user']> } {
  if (!req.user) {
    throw new Error('Critical: User context missing in protected handler');
  }
}
