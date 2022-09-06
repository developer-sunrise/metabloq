import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Col,
  Form,
  Image,
  Row,
  Stack,
  Overlay,
  Popover,
  Button,
} from "react-bootstrap";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { TileMap, TileMapProps, renderMap } from "react-tile-map";
import { Popup } from "decentraland-ui";
import "./Styles.css";
export const COLOR_BY_TYPE = Object.freeze({
  0: "#ff9990", //
  1: "#ff4053", //parcels on sale
  2: "#ff9990", //parcels on aution
  3: "#fcba03", //estates
  4: "#ffbd33", //
  5: "#afd6e8", //
  6: "#563db8", //
  7: "#fcfcfc", // road
  8: "#a9d889", // public
  9: "#bd3ce8", // already owned parcels
  10: "#3D3A46", //
  11: "#0d6efd", //available   ready to buy --->(buy only type 11)
  12: "#4a4949", // not available  under process
  13: "#cccccc", //
  14: "#0d0b0e", //
  15: "#00eeff",
});
function Atlas({  parcels, selectedParcels }) {
  const [selected, setSelected] = useState([...selectedParcels]);
  const isSelected = (x, y) => {
    return selected.some((coord) => coord.x === x && coord.y === y);
  };
  const selectedStrokeLayerRed = (x, y) => {
    return isSelected(x, y) ? { color: "red", scale: 1.4 } : null;
  };
  let atlas = parcels;
  const atlasLayer = (x, y) => {
      const id = x + "," + y;
      if (atlas !== null && id in atlas) {
        const tile = atlas[id];
        const color = COLOR_BY_TYPE[tile.type];
        const top = !!tile.top;
        const left = !!tile.left;
        const topLeft = !!tile.topLeft;
        return {
          color,
          top,
          left,
          topLeft,
        };
      } else {
        return {
          color:COLOR_BY_TYPE[13],
          top:true,
          left:true,
          topLeft:true,
        };
      }
  };
  var layers = [atlasLayer];
  if (selectedParcels) {
    layers = [atlasLayer, selectedStrokeLayerRed];
  }
  return (
    <div
      style={{
        height: "200px",
        width: "100%",
        borderTopRightRadius: "10px",
        borderTopLeftRadius: "10px",
        overflow: "hidden",
      }}
    >
      <TileMap
        className="minimap"
        layers={layers}
        isDraggable={false}
        zoom={0.5}
        x={selectedParcels ? selectedParcels[0].x : 0}
        y={selectedParcels ? selectedParcels[0].y : 0}
      />
    </div>
  );
}

export default Atlas;
