export function changePage(page) {
  return {
    type: "CHANGE_PAGE",
    payload: page,
  };
}

const initialState = {
  page: "",
};

export default function appReducer(app = initialState, action) {
  switch (action.type) {
    case "CHANGE_PAGE":
      return { ...app, page: action.payload };

    default:
      return app;
  }
}
