import React from 'react';
import { Image } from 'react-bootstrap';
const time = require("../../assets/auction/time_icon.png")

const DateTimeDisplay = ({ dayValue,hourValue,minValue,secValue, isDanger }) => {
  return (
    <div className="nftdetail-timebox d-flex justify-content-center align-items-center mr-3">
      <Image
        fluid
        src={time}
        alt="time"
        height={15}
        width={15}
        className="metabloq_img"
      />&nbsp;
      <small>{dayValue}:{hourValue}:{minValue}:{secValue}</small>
    </div>
  );
};

export default DateTimeDisplay;