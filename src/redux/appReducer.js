export function changePage(page) {
  return {
    type: "CHANGE_PAGE",
    payload: page,
  };
}

export function changeTempTypeValue(val) {
  return {
    type: "CHANGE_TEMP_TYPE_VALUE",
    payload: val,
  };
}

const initialState = {
  page: "",
  temperatureValue: "Metric",
};

export default function appReducer(app = initialState, action) {
  switch (action.type) {
    case "CHANGE_PAGE":
      return { ...app, page: action.payload };
    case "CHANGE_TEMP_TYPE_VALUE":
      return { ...app, temperatureValue: action.payload };
    default:
      return app;
  }
}
