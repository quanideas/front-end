"use client"
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import '../../i18n';
import { Inter } from 'next/font/google';
import '../styles/globals.css';


const inter = Inter({ subsets: ['latin'] });

function RootLayout({ children }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/common/logo_main.png" type="image/png" />
        <title>Ideas-Drone</title>
        <meta name="description" content="A webSGIS application for drone management and monitoring" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
      <html >
        <body className={inter.className}>
            {children}
        </body>
      </html>
    </>
  );
}

export default appWithTranslation(RootLayout);
