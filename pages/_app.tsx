import React from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';

import theme from '@/theme/themeConfig';
import { SecretsProvider } from '@/contexts/SecretsContext';

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <SecretsProvider>
      <Component {...pageProps} />
    </SecretsProvider>
  </ConfigProvider>
);

export default App;