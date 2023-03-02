import React, { useCallback, useEffect, useState, createContext } from 'react';
import styled from 'styled-components';
import { Toast, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { globalHistory } from '@reach/router';

const ToastsWrapper = styled.div`
  position: fixed;
  bottom: 2em;
  left: 2em;
  max-width: 100% !important;
  z-index: 1056;
`;

const CloseButton = styled(Button)`
  color: white !important;
`;

const ToastBodyContent = styled.div`
  svg {
    margin-right: 0.5em;
  }
  a {
    text-decoration: underline !important;
    color: white !important;
  }
`;

const ToastBody = styled(Toast.Body)`
  &&& {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

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
      <ToastsWrapper className="bootstrap">
        {toasts.map(({ message, severity, error, id }, index) => {
          if (error) {
            // eslint-disable-next-line no-undef
            Rollbar.error(error);
          }
          return (
            <Toast
              key={id}
              className={severity.className}
              style={{ maxWidth: '100%' }}
              data-cy="toast"
            >
              <ToastBody style={{ color: 'white' }}>
                <ToastBodyContent>
                  <FontAwesomeIcon icon={severity.icon} className={severity.faClass} />
                  {message}
                </ToastBodyContent>
                <CloseButton onClick={(e) => removeToast(e, index)} variant="link">
                  <FontAwesomeIcon icon={faTimes} className="fas fa-times" />
                </CloseButton>
              </ToastBody>
            </Toast>
          );
        })}
      </ToastsWrapper>
    </ToastContext.Provider>
  );
}
