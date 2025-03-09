import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatInterface from '../components/ChatInterface';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <Component {...pageProps} />
      </main>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ChatInterface />
    </>
  );
}

export default MyApp; 