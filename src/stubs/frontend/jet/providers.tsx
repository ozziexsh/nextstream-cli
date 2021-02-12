import React, { createContext, useContext, useRef, useState } from 'react';
import Cookie from 'cookie';
import Cookies from 'js-cookie';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
} from 'next';
import useSwr from 'swr';
import http from '../http';
import JetConfirmPasswordModal from './confirm-password-modal';
import { IncomingMessage } from 'http';
import { Features, Nullable, Token, User } from '../types';
import { ErrorOption } from 'react-hook-form';

const FAILED_AUTH_CHECK = {
  authenticated: false,
  user: null,
  redirect: {
    destination: '/login',
    permanent: false,
  },
};

export const UserContext = createContext<
  Nullable<{ user: User; setUser: (user: User) => void }>
>(null);

export function useUser() {
  const ctx = useContext(UserContext);
  return ctx?.user ?? null;
}

export function useRefreshUser() {
  const ctx = useContext(UserContext);

  if (!ctx) {
    return null;
  }

  return async function refreshUser() {
    const { data } = await http('api/user');
    if (!data) {
      return; // todo
    }
    Cookies.set('user', encodeURIComponent(JSON.stringify(data.user)), {
      path: '/',
      expires: 7,
    });
    ctx.setUser(data);
  };
}

export const FeatureContext = createContext<Nullable<Features>>(null);

export function useFeatures(): Features {
  return (
    useContext(FeatureContext) ?? {
      hasProfilePhotoFeatures: false,
      hasApiFeatures: false,
      hasAccountDeletionFeatures: false,
      canUpdateProfileInformation: false,
      updatePasswords: false,
      canManageTwoFactorAuthentication: false,
    }
  );
}

export function parseUserCookie(req?: NextApiRequest | IncomingMessage) {
  const cookie = req ? req.headers.cookie : document.cookie;
  const { user } = Cookie.parse(cookie || '');
  try {
    return JSON.parse(decodeURIComponent(user));
  } catch {
    return null;
  }
}

export function authStatus(req?: NextApiRequest | IncomingMessage) {
  if (req && !(req as NextApiRequest).userPresent) {
    return FAILED_AUTH_CHECK;
  }
  const user = parseUserCookie(req);
  if (!user) {
    return FAILED_AUTH_CHECK;
  }
  return {
    authenticated: true,
    user,
    redirect: { destination: '/', permanent: false },
  };
}

export async function swrHttpFetcher(url: string) {
  const { ok, data, errors } = await http(url);
  if (!ok) {
    throw new Error(errors);
  }
  return data;
}

export function useTwoFactorRecoveryCodes() {
  return useSwr<string[]>(
    'user/two-factor-recovery-codes',
    async url => swrHttpFetcher(url),
    { shouldRetryOnError: false },
  );
}

export function useApiTokens() {
  return useSwr<{
    tokens: Token[];
    availablePermissions: string[];
    defaultPermissions: string[];
  }>('user/api-tokens', swrHttpFetcher);
}

export function useConfirmPassword() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const userCallback = useRef<() => any>(() => void 0);

  function onSuccess() {
    setVisible(false);
    userCallback.current?.();
  }

  return {
    withPasswordConfirmation(cb: () => void) {
      return async function () {
        setLoading(true);
        const { response } = await http('user/password-confirmation-status');
        setLoading(false);
        if (response.status === 423) {
          userCallback.current = cb;
          setVisible(true);
        } else {
          cb();
        }
      };
    },
    ConfirmPasswordModal: () => (
      <JetConfirmPasswordModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={onSuccess}
      />
    ),
    loading,
  };
}

export function redirectIfAuthenticated(
  getServerSideProps?: GetServerSideProps,
) {
  return function (ctx: GetServerSidePropsContext) {
    const { authenticated, redirect } = authStatus(ctx.req);
    if (authenticated) {
      return { redirect };
    }
    return getServerSideProps ? getServerSideProps(ctx) : { props: {} };
  };
}

export function redirectIfGuest(getServerSideProps?: GetServerSideProps) {
  return function (ctx: GetServerSidePropsContext) {
    const { authenticated, redirect } = authStatus(ctx.req);
    if (!authenticated) {
      return { redirect };
    }
    return getServerSideProps ? getServerSideProps(ctx) : { props: {} };
  };
}

interface HandleFormErrors {
  setError(key: string, error: ErrorOption): void;
  errors:
    | {
        errors: {
          [fieldName: string]: string[];
        };
      }
    | { [fieldName: string]: string[]; errors: never };
}

export function handleFormErrors({ setError, errors }: HandleFormErrors) {
  const errorObj = 'errors' in errors ? errors.errors : errors;
  for (const fieldName in errorObj) {
    setError(fieldName, { message: errorObj[fieldName] as any });
  }
}

export function useModal() {
  const [visible, setVisible] = useState(false);

  function open() {
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }

  return {
    open,
    close,
    props: {
      visible,
      onClose: close,
    },
  };
}
