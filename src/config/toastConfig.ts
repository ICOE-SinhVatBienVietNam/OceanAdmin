import { toast, Bounce, ToastPosition } from "react-toastify";
import { ToastType } from "../ui/layout/MainLayout";

export const toastConfig = (toastData: ToastType) => {
  const { toastMessage, toastType, pending, autoclose } = toastData;

  const options = {
    position: "top-right" as ToastPosition,
    autoClose: autoclose ? autoclose : 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };

  if (pending) {
    return toast.loading(toastMessage, options)
  }

  switch (toastType) {
    case "success":
      return toast.success(toastMessage, options);
    case "error":
      return toast.error(toastMessage, options);
    case "warn":
      return toast.warn(toastMessage, options);
    default:
      return toast.info(toastMessage, options);
  }
};