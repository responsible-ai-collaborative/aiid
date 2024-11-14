import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { signOut, useSession } from "next-auth/react";

interface User {
  roles?: string[];
  [key: string]: any;
}

interface UserContextValue {
  loading: boolean;
  user: User | null;
  isRole: (role: string) => boolean;
  isAdmin: boolean;
  actions: {
    logout: () => Promise<void>;
  };
}

interface CustomDataMock {
  roles: string[];
}

const client = new ApolloClient({
  link: ApolloLink.from([
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
    },
  }),
});

interface UserContextProviderProps {
  children: React.ReactNode;
}

export const UserContext = React.createContext<UserContextValue>({
  loading: true,
  user: null,
  isRole: () => false,
  isAdmin: false,
  actions: {
    logout: async () => { },
  },
});

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>({});
  const { t } = useTranslation();

  const logout = async (): Promise<void> => {
    await signOut();
  };

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
      if (typeof window !== 'undefined' && window.localStorage.getItem('__CUSTOM_DATA_MOCK')) {
        const customData: CustomDataMock = JSON.parse(window.localStorage.getItem('__CUSTOM_DATA_MOCK') || '{}');
        return customData.roles.includes('admin') || customData.roles.includes(role);
      }
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes(role));
    },
    isAdmin: Boolean(user?.roles?.includes('admin')),
    actions: {
      logout,
    },
  };

  return (
    <UserContext.Provider value={contextValue}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </UserContext.Provider>
  );
};