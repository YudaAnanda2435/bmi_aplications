import { toast } from "react-toastify";

const toastOptions = {
  position: "top-right",
  autoClose: 2800,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export function showSuccess(message) {
  toast.success(message, toastOptions);
}

export function showError(message) {
  toast.error(message, toastOptions);
}

export function showInfo(message) {
  toast.info(message, toastOptions);
}
