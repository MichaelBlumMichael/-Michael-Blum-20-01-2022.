import React from 'react';
import './home.css';

function HomeDetails({
  metricOrImperial,
  currentTemperatur,
  locationName,
  isCurrentFavorite,
  favoritesHandler,
  date,
  hourAndDay,
}) {
  return (
    <>
      <section className='big-temperature__Home'>
        <div className='temprature__Home'>
          <h1>{currentTemperatur}</h1>
          <span className='temperatur-simbol__Home'>
            °{metricOrImperial === 'Metric' ? 'C' : 'F'}
          </span>
        </div>
        <div className='city-btn-container__Home'>
          <h2 className='city__Home'>{locationName}</h2>
          <button onClick={favoritesHandler} className='btn__Home'>
            {isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </button>
        </div>
      </section>
      <section className='time__Home'>
        <div className='date__Home'>
          <p>{date}</p>
        </div>
        <div className='day-hour__Home'>
          <p>{hourAndDay}</p>
        </div>
      </section>
    </>
  );
}

export default HomeDetails;
