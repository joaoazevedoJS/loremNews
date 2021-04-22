import { FC } from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';

import '../styles/globals.scss';
import { Header } from '../components/Header';
import { Providers } from '../hooks';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Providers>
      <Header />

      <Component {...pageProps} />
    </Providers>
  );
};

export default MyApp;
