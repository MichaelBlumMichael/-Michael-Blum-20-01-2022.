import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import { BASE_URL } from "../environment";
import { API_KEY } from "../environment";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsFromFavorites,
  setFavoritePassToHome,
} from "../redux/favoritesReducer";
import "./favorites.css";
import { useNavigate } from "react-router";

export default function Favorites() {
  const navigate = useNavigate("/");
  const dispatch = useDispatch();
  const [responses, setResponses] = useState([]);

  const getResData = responses.map((res) => res.data);

  const getFavorites = useSelector((state) => state.favorites);
  const metricOrImperial = useSelector((state) => state.app.temperatureValue);

  const getFavsKeysNames = getFavorites.favoriteLocatins.map((fav) => {
    return { key: fav.key, locationName: fav.locationName };
  });

  const addNameToResponse = getResData.map((res) => {
    for (let keyName of getFavsKeysNames) {
      if (res[0].Link.includes(keyName.key)) {
        return {
          ...res[0],
          key: keyName.key,
          locationName: keyName.locationName,
        };
      }
    }
  });
  console.log({ responses, getResData, getFavorites });

  const getRequests = getFavorites?.favoriteLocatins.map((fav) => {
    return axios.get(
      `${BASE_URL}/currentconditions/v1/${fav.key}/?apikey=${API_KEY}`
    );
  });

  useEffect(() => {
    const getForcasts = () => {
      axios
        .all(getRequests)
        .then(
          axios.spread((...responses) => {
            setResponses(responses);
          })
        )
        .catch((errors) => {
          console.error(errors);
        });
    };
    getForcasts();
  }, []);

  const handleClick = (favToSend) => {
    console.log({ favToSend });
    dispatch(setFavoritePassToHome(favToSend));
    dispatch(setIsFromFavorites(true));
    navigate("/");
  };

  console.log({ addNameToResponse });
  if (!addNameToResponse.length) {
    return (
      <div className="main__Favorites">
        <h1>No Favorite Cities yet...</h1>
      </div>
    );
  }
  return (
    <div className="container__Favorites">
      <main className="main__Favorites">
        <h1>Please choose one of your favorite cities</h1>
        <section className="cards-container">
          {addNameToResponse.map((fav) => (
            <Card classes={"card-width__favorites"} key={fav.key}>
              <div onClick={() => handleClick(fav)} className="card-info">
                <p className="day__Home">{fav.locationName}</p>
                <p className="inner-temp__Home">
                  {fav?.Temperature[metricOrImperial]?.Value}°
                  {metricOrImperial === "Metric" ? "C" : "F"}
                </p>
                <p className="inner-temp__Home">{fav.WeatherText}</p>
              </div>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
