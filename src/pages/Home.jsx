import React, { useEffect, useState } from "react";
import "./home.css";
import Card from "../components/Card";
import Autocomplete from "../components/Autocomplete";
import axios from "axios";
import { BASE_URL } from "../environment";
import { API_KEY } from "../environment";
import { DEFAULT_CITY_KEY } from "../environment";
import { DEFAULT_CITY_NAME } from "../environment";
import { format } from "date-fns";
import Loader from "../components/Loader";
// import Button from "../components/Button";
import Toaster from "../components/Toaster";
import { useDispatch, useSelector } from "react-redux";
import {
  setfavoriteLocationsKeys,
  removeFromFavorites,
  setIsFromFavorites,
} from "../redux/favoritesReducer";
import { useAxios } from "../hooks/UseAxios";

let getLocation = () => {
  const promise = new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (success) => {
        resolve(success.coords);
      },
      (error) => {
        reject(error);
      }
    )
  );
  return promise;
};

export default function Home() {
  const [fiveDayForcast, setFiveDayForcast] = useState([]);
  const [key, setKey] = useState(null);
  const [currentWhether, setCurrentWhether] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [searchObj, setSearchObj] = useState(null);

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("");

  const getFavorites = useSelector((state) => state.favorites);
  const isFromFavorites = useSelector((state) => state.favorites.fromFavorites);
  const favoriteToHome = getFavorites?.favoriteToHome;

  const isCurrentFavorite = getFavorites?.favoriteLocatins?.find(
    (fav) => fav.locationName === locationName
  );

  // console.log({ fiveDayForcast, currentWhether, locationName, getFavorites });
  const currentTemperatur = currentWhether[0]?.Temperature.Metric.Value;

  const currentTime = currentWhether?.find(
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
          getGeo = await getLocation();
          if (getGeo) {
            currentLocationResponse = await axios.get(
              `${BASE_URL}/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${getGeo.latitude}%2C${getGeo.longitude}`
            );
            locationKey = currentLocationResponse.data.Key;
            setKey(currentLocationResponse.data.Key);
          }
          setLocationName(currentLocationResponse.data.LocalizedName);
        } catch (err) {
          console.log(err);
          locationKey = DEFAULT_CITY_KEY;
          setKey(locationKey);
          setLocationName(DEFAULT_CITY_NAME);
        }
      }
      if (searchObj) {
        locationKey = searchObj.Key;
        setKey(searchObj.Key);
        setLocationName(searchObj.LocalizedName);
      }
      if (isFromFavorites) {
        locationKey = favoriteToHome.key;
        setKey(favoriteToHome.key);
        setLocationName(favoriteToHome.locationName);
      }

      const currentTimeWhetherResponse = await axios.get(
        `${BASE_URL}/currentconditions/v1/${locationKey}/?apikey=${API_KEY}`
      );

      const fiveDayForcastResponse = await axios.get(
        `${BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&metric=true`
      );
      setFiveDayForcast(fiveDayForcastResponse.data);
      setCurrentWhether(currentTimeWhetherResponse.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrMsg(true);
    }
    console.log({ locationKey });
  };

  useEffect(() => {
    setLoading(true);
    getCurrentLocationForcast();
  }, []);

  const dispatch = useDispatch();

  const favoritesHandler = () => {
    if (isCurrentFavorite) {
      dispatch(removeFromFavorites(isCurrentFavorite.locationName));
      setOpenToast(true);
      setToastMessage("Removed from favorites!");
      setToastSeverity("warning");
      setTimeout(() => {
        setOpenToast(false);
      }, 3000);
      clearTimeout();
      return;
    }

    dispatch(
      setfavoriteLocationsKeys({
        key,
        currentWhether,
        locationName,
      })
    );
    setOpenToast(true);
    setToastMessage("Added to favorites!");
    setToastSeverity("success");
    setTimeout(() => {
      setOpenToast(false);
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
        <section className="big-temperature__Home">
          <div className="temprature__Home">
            <h1>{currentTemperatur}</h1>
            <span className="temperatur-simbol__Home">°C</span>
          </div>
          <div className="city-btn-container__Home">
            <h2 className="city__Home">{locationName}</h2>
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
            toastSeverity={toastSeverity}
            toastMessage={toastMessage}
            openToast={openToast}
          />
          {fiveDayForcast?.DailyForecasts?.map((day, index) => {
            return (
              <Card key={index}>
                <div className="card-info">
                  <p className="day__Home">
                    {format(new Date(day.Date), `EE`)}
                  </p>

                  <p className="inner-temp__Home">
                    Max: {day.Temperature.Maximum.Value}°c
                  </p>
                  <p className="inner-temp__Home">
                    Min: {day.Temperature.Minimum.Value}°c
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
