import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#2f3136',
          color: '#ffffff',
          border: '1px solid #202225',
        },
        success: {
          iconTheme: {
            primary: '#43b581',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#f04747',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}



