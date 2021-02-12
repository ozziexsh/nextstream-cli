import 'tailwindcss/tailwind.css';
import cookie from 'cookie';
import { FeatureContext, parseUserCookie, UserContext } from '../jet/providers';
import http from '../http';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { useState } from 'react';
import { ToastProvider } from 'react-toast-notifications';
import JetToast from '../jet/toast';

async function getToken(req: NextApiRequest) {
  const { 'XSRF-TOKEN': token } = cookie.parse(req.headers.cookie || '');
  if (token) {
    return { cookies: [] };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`,
    {
      credentials: 'include',
    },
  );
  // @ts-ignore - .raw seems to work but no type for it?
  return { cookies: response.headers.raw()['set-cookie'] };
}

async function getUser(req: NextApiRequest) {
  const { ok, data } = await http('user', { req });
  return {
    cookies: [
      cookie.serialize('user', JSON.stringify(ok ? data.user : null), {
        expires: moment().add(1, 'day').toDate(),
        path: '/',
      }),
    ],
    user: ok ? data : null,
  };
}

async function getFeatures(req: NextApiRequest) {
  const { ok, data } = await http('features', { req });
  return {
    cookies: [
      cookie.serialize('features', JSON.stringify(ok ? data : null), {
        expires: moment().add(1, 'day').toDate(),
        path: '/',
      }),
    ],
    features: ok ? data : null,
  };
}

async function handleServer(req: NextApiRequest, res: NextApiResponse) {
  const { cookies: tokenCookies } = await getToken(req);
  const { cookies: userCookies, user } = await getUser(req);
  const { cookies: featureCookies, features } = await getFeatures(req);
  res.setHeader('set-cookie', [
    ...tokenCookies,
    ...userCookies,
    ...featureCookies,
  ]);
  req.userPresent = !!user;
  return { props: { user, features } };
}

function handleClient() {
  return { props: { user: parseUserCookie() } };
}

// TODO: get right type?
MyApp.getInitialProps = function ({ ctx: { req, res } }: any) {
  if (typeof document !== 'undefined') {
    return handleClient();
  }
  return handleServer(req, res);
};

function MyApp({
  Component,
  pageProps,
  props: { user: userProp, features },
}: AppProps) {
  const [user, setUser] = useState(userProp);

  return (
    <ToastProvider
      components={{ Toast: JetToast }}
      autoDismiss={true}
      autoDismissTimeout={5000}
    >
      <UserContext.Provider value={{ user, setUser }}>
        <FeatureContext.Provider value={features}>
          <Component {...pageProps} />
        </FeatureContext.Provider>
      </UserContext.Provider>
    </ToastProvider>
  );
}

export default MyApp;
