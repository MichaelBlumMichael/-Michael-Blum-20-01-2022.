import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { BASE_URL } from '../environment';
import axios from 'axios';
import { API_KEY } from '../environment';
import Stack from '@mui/material/Stack';

export default function FreeSolo({ searchHandler, setSearchObj }) {
  const [data, setData] = useState([]);

  const searchLocation = async (searchVal) => {
    try {
      const autocompleteResult = await axios.get(
        `${BASE_URL}/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${searchVal}`
      );
      setData(autocompleteResult.data);
      setSearchObj(autocompleteResult.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  let dataMap = [];
  if (data.length > 0) dataMap = data?.map((option) => option.LocalizedName);

  const [inputState, setInputState] = useState('');

  const handleInputChange = (value) => {
    setInputState(() => {
      let onlyEngLetters = /^[a-zA-Z]+$/.test(value);
      if (onlyEngLetters && value !== '') {
        searchLocation(value);
        return value;
      }
      return '';
    });
  };

  return (
    <React.Fragment>
      <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          id='free-solo-demo'
          freeSolo={true}
          blurOnSelect={true}
          options={dataMap}
          autoSelect={true}
          inputValue={inputState}
          onInputChange={(e, value, reason) => handleInputChange(value)}
          renderInput={(params) => {
            return (
              <TextField
                onBlur={() => searchLocation(params?.inputProps.value)}
                {...params}
                label='Search location...'
              />
            );
          }}
        />
      </Stack>
      <button onClick={searchHandler} className='btn__Home search_Home'>
        Search!
      </button>
    </React.Fragment>
  );
}
