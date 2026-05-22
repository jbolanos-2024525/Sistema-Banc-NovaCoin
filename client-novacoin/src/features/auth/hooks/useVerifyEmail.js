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

      // TOKEN INVÁLIDO
      if (!token) {

        const errorMessage = 'Token inválido.';

        if (isMounted) {
          setStatus('error');
          setMessage(errorMessage);
        }

        if (!toastShownByToken.get('invalid-token')) {
          toast.error(errorMessage);
          toastShownByToken.set('invalid-token', true);
        }

        return;
      }

      // CACHE
      const cached = verifyResultByToken.get(token);

      if (cached) {

        if (isMounted) {
          setStatus(cached.status);
          setMessage(cached.message);
        }

        if (!toastShownByToken.get(token)) {

          toastShownByToken.set(token, true);

          cached.status === 'success'
            ? toast.success('¡Correo verificado correctamente!')
            : toast.error(cached.message);
        }

        // SOLO REDIRIGIR SI FUE EXITOSO
        if (
          cached.status === 'success' &&
          !finishCalledByToken.get(token)
        ) {

          finishCalledByToken.set(token, true);

          onSuccess && onSuccess();
        }

        return;
      }

      let promise = verifyPromiseByToken.get(token);

      if (!promise) {

        promise = verifyEmailRequest(token)

          .then((res) => {

            // ÉXITO
            if (res.status === 200) {

              const successMessage =
                'Tu correo ha sido verificado correctamente. Serás redirigido al login...';

              const result = {
                status: 'success',
                message: successMessage
              };

              verifyResultByToken.set(token, result);

              return result;
            }

            // ERROR
            const errorResult = {
              status: 'error',
              message: 'El enlace ha expirado o no es válido.'
            };

            verifyResultByToken.set(token, errorResult);

            return errorResult;
          })

          .catch((error) => {

            console.error('VERIFY EMAIL ERROR:', error);

            const errorResult = {
              status: 'error',
              message: 'El enlace ha expirado o no es válido.'
            };

            verifyResultByToken.set(token, errorResult);

            return errorResult;
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

      // TOAST
      if (!toastShownByToken.get(token)) {

        toastShownByToken.set(token, true);

        result.status === 'success'
          ? toast.success('¡Correo verificado correctamente!')
          : toast.error(result.message);
      }

      // SOLO REDIRIGIR SI FUE EXITOSO
      if (
        result.status === 'success' &&
        !finishCalledByToken.get(token)
      ) {

        finishCalledByToken.set(token, true);

        onSuccess && onSuccess();
      }
    };

    run();

    return () => {

      isMounted = false;

    };

  }, [token, onSuccess]);

  return {
    status,
    message
  };
};