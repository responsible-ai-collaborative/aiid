import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { signOut, signIn, useSession, getCsrfToken, SignInResponse } from "next-auth/react";
import '../utils/sentry'; // Initialize Sentry
import * as Sentry from '@sentry/react';

interface User {
  roles?: string[];
  id: string;
  first_name: string;
  last_name: string;
}

interface UserContextValue {
  loading: boolean;
  user: User | null;
  isRole: (role: string) => boolean;
  isAdmin: boolean;
  actions: {
    logOut: () => Promise<void>;
    logIn: (email: string, callbackUrl: string) => Promise<SignInResponse | undefined>;
    signUp: (email: string, callbackUrl: string) => Promise<SignInResponse | undefined>;
  };
}

interface CustomDataMock {
  roles: string[];
}

// Create Sentry Apollo Link to propagate traces
const sentryLink = new ApolloLink((operation, forward) => {
  // Add Sentry trace headers to GraphQL requests
  const activeSpan = Sentry.getActiveSpan();
  if (activeSpan) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'sentry-trace': Sentry.spanToTraceHeader(activeSpan),
        'baggage': Sentry.spanToBaggageHeader(activeSpan),
      },
    }));
  }
  
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([
    sentryLink,
    removeTypenameFromVariables(),
    new HttpLink({
      uri: '/api/graphql',
    }),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Incident: {
        keyFields: ['incident_id'],
        fields: {
          reports: {
            merge(existing: any[], incoming: any[] = []) {
              return [...incoming];
            },
          },
        },
      },
      Report: {
        keyFields: ['report_number'],
      },
      User: {
        keyFields: ['userId'],
      },
      Subscription: {
        keyFields: ['_id'],
      },
    },
  }),
});

interface UserContextProviderProps {
  children: React.ReactNode;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export const useUserContext = () => {

  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (session === null) {
      setUser(null);
      setLoading(false);
    }

    if (session?.user) {
      setUser(session.user as User);
      setLoading(false);
    }
  }, [session]);

  const contextValue: UserContextValue = {
    loading,
    user,
    isRole(role: string): boolean {
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes(role));
    },
    isAdmin: Boolean(user?.roles?.includes('admin')),
    actions: {
      logOut: async () => {
        await signOut({ redirect: false });
      },
      logIn: async (email: string, callbackUrl: string) => {

        const result = await signIn('http-email', { email, redirect: false, callbackUrl }, { operation: 'login' });

        return result;
      },
      signUp: async (email: string, callbackUrl: string) => {

        const result = await signIn('http-email', { email, redirect: false, callbackUrl }, { operation: 'signup' });

        return result;
      },
    },
  };

  return (
    <UserContext.Provider value={contextValue}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </UserContext.Provider>
  );
};