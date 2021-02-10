import Head from 'next/head';
import { PropsWithChildren } from 'react';

interface Props {
  pageTitle?: string;
}

export default function JetGuestLayout({
  children,
  pageTitle,
}: PropsWithChildren<Props>) {
  return (
    <div className="font-sans text-gray-900 antialiased">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          {pageTitle ? `${pageTitle} | ` : ''}
          {process.env.NEXT_PUBLIC_APP_NAME}
        </title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
        />
      </Head>
      {children}
    </div>
  );
}
