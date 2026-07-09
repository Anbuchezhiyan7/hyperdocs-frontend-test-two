import React from "react";
import { toast } from "sonner";

export const showToast = (
    message = "Done",
    type = "success"
) => {
    toast.dismiss();

    switch (type) {
        case "success":
            toast.success(message);
            break;

        case "error":
            toast.error(message);
            break;

        case "warning":
            toast.warning(message);
            break;

        case "info":
            toast.info(message);
            break;

        default:
            toast(message);
            break;
    }
};

export const callbackToast = (
    { apiCall, loadingMsg = "Processing...", successMsg = "Success!", errorMsg = "Something went wrong!" }:
        { apiCall: Promise<any>, loadingMsg?: string, successMsg?: string, errorMsg?: string }
) => {
    toast.dismiss();

    return toast.promise(apiCall, {
        loading: loadingMsg,
        success: () => successMsg,
        error: errorMsg,
    });
};

const HotToaster: React.FC = () => null;

export default HotToaster;
