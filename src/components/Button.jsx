import React from "react";

export default function Button({ children, className }) {
  const classes = "btn__Home " + className;
  return <div className={classes}>{children}</div>;
}
