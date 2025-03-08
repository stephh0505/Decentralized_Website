import '../styles/globals.css';

/**
 * Custom App Component
 * Wraps all pages with global styles and providers
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp; 