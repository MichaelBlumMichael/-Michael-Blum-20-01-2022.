import { produce } from "immer";

export function setfavoriteLocationsKeys(obj) {
  return {
    type: "SET_FAVORITE_LOCATIONS",
    payload: obj,
  };
}

export function setIsFromFavorites(bool) {
  return {
    type: "FROM_FAVORITES",
    payload: bool,
  };
}

export function removeFromFavorites(name) {
  return {
    type: "REMOVE_FAVORITE_LOCATIONS",
    payload: name,
  };
}

export function setFavoritePassToHome(currentWhether) {
  return {
    type: "FAVORITE_PASS_HOME",
    payload: currentWhether,
  };
}

const initialState = {
  favoriteLocatins: [],
  favoriteToHome: null,
  fromFavorites: false,
};

export default function favoritesReducer(favorites = initialState, action) {
  switch (action.type) {
    case "SET_FAVORITE_LOCATIONS":
      return produce(favorites, (draftState) => {
        draftState.favoriteLocatins.push(action.payload);
      });
    case "REMOVE_FAVORITE_LOCATIONS":
      return produce(favorites, (draftState) => {
        draftState.favoriteLocatins = draftState.favoriteLocatins.filter(
          (fav) => fav.locationName !== action.payload
        );
      });
    case "FAVORITE_PASS_HOME":
      return produce(favorites, (draftState) => {
        draftState.favoriteToHome = action.payload;
      });
    case "FROM_FAVORITES":
      return produce(favorites, (draftState) => {
        draftState.fromFavorites = action.payload;
      });
    default:
      return favorites;
  }
}
