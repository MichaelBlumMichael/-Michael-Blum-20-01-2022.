import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { BASE_URL } from "../environment";
import axios from "axios";
import { API_KEY } from "../environment";
import Stack from "@mui/material/Stack";

export default function FreeSolo({ setSearchObj }) {
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

  return (
    <React.Fragment>
      <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={dataMap}
          renderInput={(params) => {
            return (
              <TextField
                onChange={() => {
                  searchLocation(params?.inputProps.value);
                }}
                onBlur={() => searchLocation(params?.inputProps.value)}
                {...params}
                label="Search location..."
              />
            );
          }}
        />
      </Stack>
    </React.Fragment>
  );
}
