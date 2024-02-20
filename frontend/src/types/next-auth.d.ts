
import 'next-auth';



export enum USER_ROLE {
    USER = 'user',
  }
  
  type UserCredentials = {
    authToken: string;
    role: USER_ROLE.USER;
  };
  
  declare module 'next-auth' {
    interface User extends UserCredentials {
      id?: number;
    }
  
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: User;
    }
  }
  
  declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    type JWT = {
      user?: User;
    };
  }