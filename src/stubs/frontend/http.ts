import { NextApiRequest } from 'next';
import cookie from 'cookie';
import { IncomingMessage } from 'http';

function isJson(response: Response) {
  return response.headers.get('content-type') === 'application/json';
}

function getDataProperty(response: Response) {
  if (!response.ok || !isJson(response)) {
    return null;
  }
  return response.json();
}

function getErrorProperty(response: Response) {
  if (response.ok || !isJson(response)) {
    return null;
  }
  return response.json();
}

interface Init extends RequestInit {
  req?: NextApiRequest | IncomingMessage;
}

async function http(input: RequestInfo, init?: Init) {
  const token = (() => {
    if (init?.req) {
      const { 'XSRF-TOKEN': token } = cookie.parse(
        init.req.headers.cookie || '',
      );
      return token;
    }
    if (typeof document !== 'undefined') {
      return cookie.parse(document.cookie)['XSRF-TOKEN'] || '';
    }
    return '';
  })();

  // if passed relative url, ensure it is formatted correctly
  if (typeof input === 'string' && !input.startsWith('http')) {
    input = `${process.env.NEXT_PUBLIC_API_URL}/${input.replace(/^(\/)/, '')}`;
  }

  const response = await fetch(input, {
    redirect: 'manual',
    credentials: 'include',
    ...init,
    headers: {
      ...(init?.req ? { Cookie: init.req.headers.cookie || '' } : {}),
      ...(typeof window !== 'undefined' && init?.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      Accept: 'application/json',
      'X-XSRF-TOKEN': token,
      Referer: process.env.NEXT_PUBLIC_APP_URL as string,
      ...init?.headers,
    },
  });

  return {
    response,
    ok: response.ok,
    data: await getDataProperty(response),
    errors: await getErrorProperty(response),
  };
}

export default http;
