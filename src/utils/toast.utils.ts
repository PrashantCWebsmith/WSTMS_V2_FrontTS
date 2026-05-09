import React from 'react';
import { toast as hotToast } from 'react-hot-toast';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';

// Specialized utility for low-friction notifications using react-hot-toast.
export const toast = {
  // Displays a success notification.
  success: (message: string) => {
    hotToast.success(message, {
      duration: 3000,
      position: 'top-right',
      icon: React.createElement(CheckCircle2, { size: 20, color: '#fff' }),
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '1rem',
      },
    });
  },

  // Displays an error notification.
  error: (message: string) => {
    hotToast.error(message, {
      duration: 4000,
      position: 'top-right',
      icon: React.createElement(AlertCircle, { size: 20, color: '#fff' }),
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '1rem',
      },
    });
  },

  // Displays an informational notification.
  info: (message: string) => {
    hotToast(message, {
      icon: React.createElement(Info, { size: 20, color: '#fff' }),
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '1rem',
      },
    });
  },

  // Displays a warning notification.
  warning: (message: string) => {
    hotToast(message, {
      icon: React.createElement(AlertTriangle, { size: 20, color: '#fff' }),
      duration: 3500,
      position: 'top-right',
      style: {
        background: '#f59e0b',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '1rem',
      },
    });
  }
};

/**
 * Standardized handler for SQLReturnMessageNValue API responses.
 * Maps outval codes to appropriate UI notifications.
 */
export const handleActionResult = (res: { outval: any, outmsg: string }) => {
  if (!res) return;
  const outval = Number(res.outval);
  const outmsg = res.outmsg || '';

  if (outval === 1) {
    if (outmsg) toast.success(outmsg);
  } else if (outval === 0) {
    if (outmsg) toast.error(outmsg);
  } else if (outval === 99) {
    import('sweetalert2').then((Swal) => {
      Swal.default.fire({
        title: 'Attention',
        text: outmsg,
        icon: 'warning',
        confirmButtonColor: '#4f46e5',
      });
    });
  }
};
