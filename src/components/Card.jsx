import React from "react";

export default function Card({ children, classes }) {
  return <div className={"card " + classes}>{children}</div>;
}
