import React from "react";
import "./home.css";
import Card from "../components/Card";
import Switch from "../components/Switch";
import Autocomplete from "../components/Autocomplete";

import { format } from "date-fns";
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";

import { useForcast } from "../Hooks/useForcast";

export default function Home() {
  const {
    searchHandler,
    favoritesHandler,
    loading,
    errMsg,
    setSearchObj,
    toasterState,
    currentTemperatur,
    hourAndDay,
    date,
    metricOrImperial,
    forcastState,
    isCurrentFavorite,
  } = useForcast();

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
