export const toasterReducer = (state, action) => {
  switch (action.type) {
    case "TOASTER_OPEN_WARNING":
      return {
        openToast: action.val,
        toastMessage: "Removed from favorites!",
        toastSeverity: "warning",
      };
    case "TOASTER_OPEN_ADDED":
      return {
        openToast: action.val,
        toastMessage: "Added to favorites!",
        toastSeverity: "success",
      };
    case "CLOSE_TOAST":
      return {
        ...state,
        openToast: action.val,
      };

    default:
      return state;
  }
};
