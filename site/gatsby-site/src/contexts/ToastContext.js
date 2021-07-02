import React, { useCallback, useEffect, useState, createContext } from 'react';
import styled from 'styled-components';
import { Toast, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import uuid from 'react-uuid';

const ToastsWrapper = styled.div`
  position: fixed;
  bottom: 2em;
  left: 2em;
  max-width: 100% !important;
`;

const CloseButton = styled(Button)`
  &&& {
    background: ${({ bg }) => (bg ? bg : `white`)};
    color: white;
    border-color: ${({ bg }) => (bg ? bg : `white`)};

    :active {
      background: ${({ bg }) => (bg ? bg : `white`)} !important;
      border-color: ${({ bg }) => (bg ? bg : `white`)} !important;
      box-shadow: 0 0 0 0 !important;
    }

    :focus {
      border-color: ${({ bg }) => (bg ? bg : `white`)} !important;
      box-shadow: 0 0 0 0 !important;
    }
  }
`;

const ToastBodyContent = styled.div`
  overflow: hidden;
  white-space: nowrap;

  svg {
    margin-right: 0.5em;
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

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => setToasts((toasts) => toasts.slice(1)), 4000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const addToast = useCallback(
    function (toast) {
      setToasts((toasts) => [...toasts, { ...toast, id: uuid() }]);
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
      <ToastsWrapper>
        {toasts.map(({ message, severity, id }, index) => (
          <Toast key={id} style={{ background: severity.color, maxWidth: '100%' }}>
            <ToastBody style={{ color: 'white' }}>
              <ToastBodyContent>
                <FontAwesomeIcon icon={severity.icon} className={severity.faClass} />
                {message}
              </ToastBodyContent>
              <CloseButton bg={severity.color} onClick={(e) => removeToast(e, index)}>
                <FontAwesomeIcon icon={faTimes} className="fas fa-times" />
              </CloseButton>
            </ToastBody>
          </Toast>
        ))}
      </ToastsWrapper>
    </ToastContext.Provider>
  );
}
