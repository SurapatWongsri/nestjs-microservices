import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { UserContext } from './auth.types';

@Injectable()
export class AuthService {
  private readonly clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });

  private jwtVerifyOptions(): Record<string, any> {
    return {
      secretKey: process.env.CLERK_SECRET_KEY,
    };
  }

  async verifyAndBuildContext(token: string): Promise<UserContext> {
    try {
      const verified = await verifyToken(token, this.jwtVerifyOptions());
      const payload = verified as Record<string, unknown>;

      const clerkUserId = (payload.sub as string) || (payload.userId as string);

      if (!clerkUserId) {
        throw new UnauthorizedException('Token is missing user id');
      }

      const role: 'user' | 'admin' = 'user';
      const isAdmin = false;

      const emailFromToken =
        (payload.email as string) || (payload.email_address as string) || '';

      const nameFromToken =
        (payload.name as string) ||
        (payload.fullName as string) ||
        (payload.username as string) ||
        '';

      if (emailFromToken && nameFromToken) {
        return {
          clerkUserId,
          email: emailFromToken,
          name: nameFromToken,
          role,
          isAdmin,
        };
      }

      const user = await this.clerk.users.getUser(clerkUserId);

      const primaryEmailObj =
        user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId) ||
        user.emailAddresses[0];
      const primaryEmail = primaryEmailObj?.emailAddress || '';

      const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        user.username ||
        primaryEmail ||
        clerkUserId;

      return {
        clerkUserId,
        email: emailFromToken || primaryEmail,
        name: nameFromToken || fullName,
        role,
        isAdmin,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
