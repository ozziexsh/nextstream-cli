import Head from 'next/head';
import { PropsWithChildren } from 'react';
import JetNavigation from './navigation';

interface Props {
  header?: string;
  pageTitle?: string;
}

export default function JetAppLayout({
  children,
  header,
  pageTitle,
}: PropsWithChildren<Props>) {
  return (
    <div className="font-sans antialiased">
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

      <div className="min-h-screen bg-gray-100">
        <JetNavigation />

        {header && (
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h2
                className={'font-semibold text-xl text-gray-800 leading-tight'}
              >
                {header}
              </h2>
            </div>
          </header>
        )}

        <main>{children}</main>
      </div>
    </div>
  );
}
