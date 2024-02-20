import axios from 'axios';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from './api';
import { USER_ROLE } from './constants';

export interface AuthHandlerValues {
  username: string;
  password: string;
  role: keyof typeof USER_ROLE;
}

export interface Data {
  authToken: string;
  role: keyof typeof USER_ROLE;
}

export type AuthHandlerResponse = [Data | null, string | null] | undefined;

async function authHandler({
  role,
  ...creds
}: AuthHandlerValues): Promise<AuthHandlerResponse> {
  try {
    if (role === USER_ROLE.USER) {
      // prettier-ignore
      const response = await api.post<LoginResponse>('/auth/login/user', creds)

      const data = {
        authToken: response.data.result.access_token,
        role,
      };

      return [data, null];
    }


    if (role === USER_ROLE.ADMIN) {
      // prettier-ignore
      const response = await api.post<LoginResponse>('/auth/login/admin', creds)

      const data = {
        authToken: response.data.result.access_token,
        role,
      };

      return [data, null];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return [null, error.response?.data?.detail];
    }
  }
}

// prettier-ignore
async function userProfileHandler(authToken: string): Promise<UserProfile | undefined> {
  try {
    // prettier-ignore
    const response = await api.get<DefaultApiResponse<UserProfile>>(
      '/users/profile/user',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data.result
  } catch (error) {
    return undefined
  }
}

// prettier-ignore
async function adminProfileHandler(authToken: string): Promise<AdminProfile | undefined> {
  try {
    // prettier-ignore
    const response = await api.get<DefaultApiResponse<AdminProfile>>(
      '/users/profile/admin',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data.result
  } catch (error) {
    return undefined
  }
}

export const SESSION_MAX_AGE = 600;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },

      async authorize(credentials):Promise<any> {
        try {
        } catch (error) {}
        const payload: AuthHandlerValues = {
          username: credentials?.username ?? '',
          password: credentials?.password ?? '',
          role: (credentials?.role ?? 'USER') as keyof typeof USER_ROLE,
        };

        const response = await authHandler(payload);

        const [data, error] = response ?? [];

        if (data && !error) {
          // prettier-ignore
          const userProfileResponse = await userProfileHandler(data.authToken)

          // prettier-ignore
          const adminProfileResponse = await adminProfileHandler(data.authToken)

          return {
            authToken: data.authToken,
            role: data.role,
            userProfile: userProfileResponse,
            adminProfile: adminProfileResponse,
          };
        }

        throw Error(error as string);
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: { maxAge: SESSION_MAX_AGE },

  jwt: { maxAge: SESSION_MAX_AGE },

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { user };
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};
