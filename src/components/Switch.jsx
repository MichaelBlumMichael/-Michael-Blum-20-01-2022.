import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTempTypeValue } from "../redux/appReducer";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

export default function ColorSwitches({ forcastFunction }) {
  const value = useSelector((state) => state.app.temperatureValue);
  const dispatch = useDispatch();
  const handleChange = () => {
    if (value === "Metric") dispatch(changeTempTypeValue("Imperial"));
    if (value === "Imperial") dispatch(changeTempTypeValue("Metric"));
  };
  return (
    <div className="switch__Home">
      <span>Switch to Fahrenheit</span>
      <Switch
        onChange={handleChange}
        checked={value === "Metric" ? false : true}
        {...label}
        color="secondary"
      />
    </div>
  );
}
