export const forcastReducer = (state, action) => {
  switch (action.type) {
    case "FIVE_DAY":
      return {
        ...state,
        fiveDayForcast: action.val,
      };
    case "CURRENT_WEATHER":
      return {
        ...state,
        currentWeather: action.val,
      };
    case "LOCATION_NAME":
      return {
        ...state,
        locationName: action.val,
      };
    case "KEY":
      return {
        ...state,
        key: action.val,
      };

    default:
      return state;
  }
};

export const initialForcastState = {
  fiveDayForcast: [],
  currentWeather: [],
  locationName: "",
  key: null,
};
