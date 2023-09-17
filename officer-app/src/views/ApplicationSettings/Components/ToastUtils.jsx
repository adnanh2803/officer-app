import { toast } from 'react-toastify';

export const showToast = (message, options = {}) => {
  toast(message, {
    position: options.position || toast.POSITION.TOP_RIGHT,
    hideProgressBar: options.hideProgressBar || true,
    type: options.type || toast.TYPE.DEFAULT,
    autoClose: options.autoClose || 3000
    // Other options you want to pass
  });
};