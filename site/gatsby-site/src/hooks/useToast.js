import { useContext } from 'react';
import ToastContext from '../contexts/ToastContext';

import {
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

export const SEVERITY = {
  success: {
    key: 'success',
    icon: faCheckCircle,
    faClass: 'far fa-check-circle fa-lg',
    color: '#43a047',
  },
  danger: {
    key: 'danger',
    icon: faTimesCircle,
    faClass: 'far fa-times-circle fa-lg',
    color: '#d32f2f',
  },
  warning: {
    key: 'warning',
    icon: faExclamationTriangle,
    faClass: 'far fa-exclamation-triangle fa-lg',
    color: '#ffa000',
  },
  info: {
    key: 'info',
    icon: faInfoCircle,
    faClass: 'far fa-info-circle fa-lg',
    color: '#2979ff',
  },
};

export default function useToastContext() {
  return useContext(ToastContext);
}
