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
    color: '#17813e', // Tailwind green-700
  },
  danger: {
    key: 'danger',
    icon: faTimesCircle,
    faClass: 'far fa-times-circle fa-lg',
    color: '#ba1e1e', // Tailwind red-700
  },
  warning: {
    key: 'warning',
    icon: faExclamationTriangle,
    faClass: 'far fa-exclamation-triangle fa-lg',
    color: '#fbbf26', // Tailwind amber-400
  },
  info: {
    key: 'info',
    icon: faInfoCircle,
    faClass: 'far fa-info-circle fa-lg',
    color: '#2764eb', //Tailwind blue-600
  },
};

export default function useToastContext() {
  return useContext(ToastContext);
}
