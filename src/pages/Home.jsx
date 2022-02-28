import React from 'react';
import './home.css';
import Card from '../components/Card';
import Switch from '../components/Switch';
import Autocomplete from '../components/Autocomplete';
import { format } from 'date-fns';
import Loader from '../components/Loader';
import Toaster from '../components/Toaster';
import { useForcast } from '../Hooks/useForcast';
import HomeDetails from './HomeDetails';
import ErrorMsg from '../components/ErrorMsg';

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
  if (errMsg) return <ErrorMsg />;

  return (
    <div className='container__Home'>
      <div className='autocomplete-wrapper__Home'>
        <Autocomplete
          searchHandler={searchHandler}
          setSearchObj={setSearchObj}
        />
      </div>
      <main className='main__Home'>
        <Switch />
        <HomeDetails
          metricOrImperial={metricOrImperial}
          currentTemperatur={currentTemperatur}
          locationName={forcastState.locationName}
          isCurrentFavorite={isCurrentFavorite}
          favoritesHandler={favoritesHandler}
          date={date}
          hourAndDay={hourAndDay}
        />
        <div className='cards-container'>
          <Toaster
            toastSeverity={toasterState.toastSeverity}
            toastMessage={toasterState.toastMessage}
            openToast={toasterState.openToast}
          />
          {forcastState.fiveDayForcast?.DailyForecasts?.map((day, index) => {
            return (
              <Card key={index}>
                <div className='card-info'>
                  <p className='day__Home'>
                    {format(new Date(day.Date), `EE`)}
                  </p>

                  <p className='inner-temp__Home'>
                    Max: {day.Temperature.Maximum.Value}°
                    {metricOrImperial === 'Metric' ? 'C' : 'F'}
                  </p>
                  <p className='inner-temp__Home'>
                    Min: {day.Temperature.Minimum.Value}°
                    {metricOrImperial === 'Metric' ? 'C' : 'F'}
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
