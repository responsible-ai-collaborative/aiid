import React, { useCallback, useEffect, useState, createContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { globalHistory } from '@reach/router';
import { Toast } from 'flowbite-react';

const ToastContext = createContext();

export default ToastContext;

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  globalHistory.listen(() => {
    if (toasts.length > 0) {
      setToasts([]);
    }
  });

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => setToasts((toasts) => toasts.slice(1)), 10 * 1000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const addToast = useCallback(
    function (toast) {
      setToasts((toasts) => [...toasts, { ...toast, id: Date.now() }]);
    },
    [setToasts]
  );

  const removeToast = (e, index) => {
    e.preventDefault();
    if (toasts.length > 0) {
      setToasts(toasts.filter((t, i) => i !== index));
    }
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-0 left-0 max-w-full z-50 box-conten mb-4 ml-4">
        {toasts.map(({ message, severity, id }, index) => {
          return (
            <Toast className="tw-toast" data-cy="toast" key={id}>
              <div
                className={`w-full h-full flex ${severity.className} items-center p-4 rounded gap-3 text-white max-w-full`}
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white">
                  <FontAwesomeIcon icon={severity.icon} className={severity.faClass} />
                </div>
                <div className="text-sm font-normal max-w-full break-words overflow-auto">
                  {message}
                </div>
                <Toast.Toggle className="mx-0" onClick={(e) => removeToast(e, index)} />
              </div>
            </Toast>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
