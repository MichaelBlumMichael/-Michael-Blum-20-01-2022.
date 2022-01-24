import React, { useEffect, useState, useReducer } from "react";
import "./home.css";
import Card from "../components/Card";
import Switch from "../components/Switch";
import Autocomplete from "../components/Autocomplete";
import { API_KEY } from "../environment";
import { DEFAULT_CITY_KEY } from "../environment";
import { DEFAULT_CITY_NAME } from "../environment";
import { format } from "date-fns";
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";
import { useDispatch, useSelector } from "react-redux";
import {
  setfavoriteLocationsKeys,
  removeFromFavorites,
  setIsFromFavorites,
} from "../redux/favoritesReducer";
import { getLocationPromisified } from "../utilities/location";
import { ApiRequest } from "../providers/accuWeather";
import { toasterReducer, initialToasterState } from "../utilities/toastReducer";
import {
  forcastReducer,
  initialForcastState,
} from "../utilities/forcastReducer";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [searchObj, setSearchObj] = useState(null);

  const getFavorites = useSelector((state) => state.favorites);
  const isFromFavorites = useSelector((state) => state.favorites.fromFavorites);
  const metricOrImperial = useSelector((state) => state.app.temperatureValue);
  const favoriteToHome = getFavorites?.favoriteToHome;

  const [toasterState, dispatchToaster] = useReducer(
    toasterReducer,
    initialToasterState
  );

  const [forcastState, dispatchForcast] = useReducer(
    forcastReducer,
    initialForcastState
  );

  const isCurrentFavorite = getFavorites?.favoriteLocatins?.find(
    (fav) => fav.locationName === forcastState.locationName
  );

  const currentTemperatur =
    forcastState.currentWeather[0]?.Temperature[metricOrImperial].Value;

  const currentTime = forcastState.currentWeather?.find(
    (item) => item?.LocalObservationDateTime !== null
  )?.LocalObservationDateTime;

  let hourAndDay;
  let date;
  if (currentTime) {
    const formatDate = new Date(currentTime);
    hourAndDay = format(formatDate, `kk:mm EEEE`);
    date = format(formatDate, `do MMM yyyy`);
  }

  const getCurrentLocationForcast = async () => {
    let locationKey;

    try {
      let getGeo,
        currentLocationResponse = null;
      if (!searchObj && !isFromFavorites) {
        try {
          getGeo = await getLocationPromisified();
          if (getGeo) {
            currentLocationResponse = await ApiRequest(
              "get",
              `/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${getGeo.latitude}%2C${getGeo.longitude}`
            );
            locationKey = currentLocationResponse.Key;

            dispatchForcast({ type: "KEY", val: locationKey });
          }
          dispatchForcast({
            type: "LOCATION_NAME",
            val: currentLocationResponse.data.LocalizedName,
          });
        } catch (err) {
          console.log(err);
          locationKey = DEFAULT_CITY_KEY;

          dispatchForcast({ type: "KEY", val: locationKey });
          dispatchForcast({ type: "LOCATION_NAME", val: DEFAULT_CITY_NAME });
        }
      }
      if (searchObj) {
        locationKey = searchObj.Key;
        dispatchForcast({ type: "KEY", val: searchObj.Key });

        dispatchForcast({
          type: "LOCATION_NAME",
          val: searchObj.LocalizedName,
        });
      }
      if (isFromFavorites) {
        locationKey = favoriteToHome.key;
        dispatchForcast({ type: "KEY", val: locationKey });

        dispatchForcast({
          type: "LOCATION_NAME",
          val: favoriteToHome.locationName,
        });
      }

      const currentTimeWeatherResponse = await ApiRequest(
        "get",
        `/currentconditions/v1/${locationKey}/?apikey=${API_KEY}`
      );

      const fiveDayForcastResponse = await ApiRequest(
        "get",
        `/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&metric=${
          metricOrImperial === "Metric" ? "true" : "false"
        }`
      );

      dispatchForcast({ type: "FIVE_DAY", val: fiveDayForcastResponse });
      dispatchForcast({
        type: "CURRENT_WEATHER",
        val: currentTimeWeatherResponse,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrMsg(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    getCurrentLocationForcast();
  }, [metricOrImperial]);

  const dispatch = useDispatch();

  const favoritesHandler = () => {
    if (isCurrentFavorite) {
      dispatch(removeFromFavorites(isCurrentFavorite.locationName));
      dispatchToaster({ type: "TOASTER_OPEN_WARNING", val: true });
      setTimeout(() => {
        dispatchToaster({ type: "CLOSE_TOAST", val: false });
      }, 3000);
      clearTimeout();
      return;
    }

    const { currentWeather } = forcastState;
    const { locationName } = forcastState;
    const { key } = forcastState;

    dispatch(
      setfavoriteLocationsKeys({
        key,
        currentWeather,
        locationName,
      })
    );
    dispatchToaster({ type: "TOASTER_OPEN_ADDED", val: true });
    setTimeout(() => {
      dispatchToaster({ type: "CLOSE_TOAST", val: false });
    }, 3000);
    clearTimeout();
  };

  const searchHandler = () => {
    dispatch(setIsFromFavorites(false));
    getCurrentLocationForcast();
  };

  if (loading) return <Loader />;
  if (errMsg)
    return (
      <div style={{ justifyContent: "center", alignItems: "center" }}>
        <p>Oops... Something went wrong...</p>
        <p>Try again later</p>
      </div>
    );

  return (
    <div className="container__Home">
      <div className="autocomplete-wrapper__Home">
        <Autocomplete setSearchObj={setSearchObj} />
        <button onClick={searchHandler} className="btn__Home search_Home">
          Search!
        </button>
      </div>
      <main className="main__Home">
        <Switch />
        <section className="big-temperature__Home">
          <div className="temprature__Home">
            <h1>{currentTemperatur}</h1>
            <span className="temperatur-simbol__Home">
              °{metricOrImperial === "Metric" ? "C" : "F"}
            </span>
          </div>
          <div className="city-btn-container__Home">
            <h2 className="city__Home">{forcastState.locationName}</h2>
            <button onClick={favoritesHandler} className="btn__Home">
              {isCurrentFavorite ? "Remove from favorites" : "Add to favorites"}
            </button>
          </div>
        </section>
        <section className="time__Home">
          <div className="date__Home">
            <p>{date}</p>
          </div>
          <div className="day-hour__Home">
            <p>{hourAndDay}</p>
          </div>
        </section>
        <div className="cards-container">
          <Toaster
            toastSeverity={toasterState.toastSeverity}
            toastMessage={toasterState.toastMessage}
            openToast={toasterState.openToast}
          />
          {forcastState.fiveDayForcast?.DailyForecasts?.map((day, index) => {
            return (
              <Card key={index}>
                <div className="card-info">
                  <p className="day__Home">
                    {format(new Date(day.Date), `EE`)}
                  </p>

                  <p className="inner-temp__Home">
                    Max: {day.Temperature.Maximum.Value}°
                    {metricOrImperial === "Metric" ? "C" : "F"}
                  </p>
                  <p className="inner-temp__Home">
                    Min: {day.Temperature.Minimum.Value}°
                    {metricOrImperial === "Metric" ? "C" : "F"}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
