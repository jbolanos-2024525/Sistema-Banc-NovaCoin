import { useState, useEffect } from 'react';
import { verifyEmailRequest } from '../../../shared/apis/authService';
import toast from 'react-hot-toast';

const verifyPromiseByToken = new Map();
const verifyResultByToken = new Map();
const toastShownByToken = new Map();
const finishCalledByToken = new Map();

export const useVerifyEmail = (token, onSuccess) => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token inválido.');
        if (!toastShownByToken.get('invalid-token')) {
          toast.error('Token inválido.');
          toastShownByToken.set('invalid-token', true);
        }
        if (!finishCalledByToken.get('invalid-token')) {
          finishCalledByToken.set('invalid-token', true);
          onSuccess && onSuccess();
        }
        return;
      }

      const cached = verifyResultByToken.get(token);
      if (cached) {
        if (!toastShownByToken.get(token)) {
          toastShownByToken.set(token, true);
          cached.status === 'success'
            ? toast.success('¡Correo verificado correctamente!')
            : toast.error(cached.message);
        }
        if (!finishCalledByToken.get(token)) {
          finishCalledByToken.set(token, true);
          onSuccess && onSuccess();
        }
        if (isMounted) {
          setStatus(cached.status);
          setMessage(cached.message);
        }
        return;
      }

      let promise = verifyPromiseByToken.get(token);
      if (!promise) {
        promise = verifyEmailRequest(token)
          .then((res) => {
            if (res.status === 200) {
              const successMessage =
                'Tu correo ha sido verificado correctamente. Serás redirigido al login...';
              verifyResultByToken.set(token, { status: 'success', message: successMessage });
              return { status: 'success', message: successMessage };
            }
            const errorMessage = 'El enlace ha expirado o no es válido.';
            verifyResultByToken.set(token, { status: 'error', message: errorMessage });
            return { status: 'error', message: errorMessage };
          })
          .catch(() => {
            const errorMessage = 'El enlace ha expirado o no es válido.';
            verifyResultByToken.set(token, { status: 'error', message: errorMessage });
            return { status: 'error', message: errorMessage };
          })
          .finally(() => {
            verifyPromiseByToken.delete(token);
          });

        verifyPromiseByToken.set(token, promise);
      }

      const result = await promise;

      if (isMounted) {
        setStatus(result.status);
        setMessage(result.message);
      }

      if (!toastShownByToken.get(token)) {
        toastShownByToken.set(token, true);
        result.status === 'success'
          ? toast.success('¡Correo verificado correctamente!')
          : toast.error(result.message);
      }

      if (!finishCalledByToken.get(token)) {
        finishCalledByToken.set(token, true);
        onSuccess && onSuccess();
      }
    };

    run();
    return () => { isMounted = false; };
  }, [token, onSuccess]);

  return { status, message };
};