import Script from 'next/script';
import '$styles/globals.css';
import '$styles/bootstrap.min.css';
import { AuthProvider } from '$context/AuthContext';
import { LoadingProvider } from '$context/LoadingContext';
import { ModelsProvider } from '$context/ModelsContext';
import Layout from '$components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Layout>
          <Script
            src="https://3d-api.si.edu/resources/js/voyager-explorer.min.js"
            strategy="afterInteractive"
          />
          <ModelsProvider>
            <Component {...pageProps} />
          </ModelsProvider>
        </Layout>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default MyApp;
