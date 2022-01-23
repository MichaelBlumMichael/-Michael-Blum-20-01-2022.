import { createStore, combineReducers, applyMiddleware } from "redux";
import appReducer from "./appReducer";
import favoritesReducer from "./favoritesReducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  app: appReducer,
  favorites: favoritesReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
store.subscribe(() => console.log(store.getState()));
export default store;
