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
import { useDispatch, useSelector } from "react-redux";
import { Popup } from "decentraland-ui";
import "./Styles.css";
export const COLOR_BY_TYPE = Object.freeze({
  0: "#ff9990", //
  1: "#ff4053", //parcels on sale
  2: "#ff9990", //parcels on auction
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

  // 0: "#ff9990", // my parcels
  // 1: "#ff4053", // my parcels on sale
  // 2: "#ff9990", // my estates
  // 3: "#ff4053", // my estates on sale
  // 4: "#ffbd33", // parcels/estates where I have permissions
  // 5: "#afd6e8", // districts
  // 6: "#563db8", // contributions
  // 7: "#fcfcfc", // roads
  // 8: "#a9d889", // plazas #
  // 9: "#ebebea", // owned parcel/estate
  // 10: "#3D3A46", // parcels on sale (we show them as owned parcels)
  // 11: "#09080A", //avaiable    // unowned pacel/estate
  // 12: "#000000", // background
  // 13: "#000000", // loading odd
  // 14: "#0d0b0e", // loading even
  // 15: "#00eeff",

  //old ones
  // 0: "#ff9990", // my parcels
  // 1: "#ff4053", // my parcels on sale
  // 2: "#ff9990", // my estates
  // 3: "#ff4053", // my estates on sale
  // 4: "#ffbd33", // parcels/estates where I have permissions
  // 5: "#5054D4", // districts
  // 6: "#563db8", // contributions
  // 7: "#716C7A", // roads
  // 8: "#70AC76", // plazas
  // 9: "#3D3A46", // owned parcel/estate
  // 10: "#3D3A46", // parcels on sale (we show them as owned parcels)
  // 11: "#09080A", // unowned pacel/estate
  // 12: "#18141a", // background
  // 13: "#110e13", // loading odd
  // 14: "#0d0b0e", // loading even
});
function Atlas({
  setSelectedAxis,
  parcels,
  filterType,
  onSale,
  selectedParcels,
  onSelectGrid,
  filterTypeValue,
}) {
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { Land, address, adjcent } = reduxItems;
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredTile, setHoveredTile] = useState({
    type: 9,
    x: 16,
    y: -11,
    owner: "0xff6bbfbd72551f02be3109ad6eec9ed469bf7667",
  });
  const [mouseX, setMouseX] = useState(-1);
  const [mouseY, setMouseY] = useState(-1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const getCoords = (x, y) => `${x},${y}`;

  // const [parcels, setParcels] = useState();
  // const getdata = async () => {
  //   const res = await fetch(link);
  //   const json = await res.json();
  //   if (json.ok) {
  //     // const sliced = Object.fromEntries(
  //     //   Object.entries(json.data).slice(0, 5)
  //     // )
  //     // console.log("ZXSDSSAsa",sliced)
  //     setParcels(json.data);
  //   }
  // };

  // useEffect(() => {
  //   getdata();
  // }, []);
  const handleHidePopup = useCallback(() => {
    setShowPopup(false);
    setMouseX(-1);
    setMouseY(-1);
  }, []);
  const handleHover = useCallback(
    (x, y) => {
      setX(x);
      setY(y);
      const id = getCoords(x, y);
      const tile = parcels[id];
      // console.log("sddssdfds", tile, parseInt(filterType));
      if (tile && !showPopup) {
        setShowPopup(true);
        setHoveredTile(tile);
        setMouseX(-1);
        setMouseY(-1);
      } else if (tile && tile !== hoveredTile) {
        setHoveredTile(tile);
        setMouseX(-1);
        setMouseY(-1);
      } else if (!tile && showPopup) {
        setShowPopup(false);
      }
    },
    [hoveredTile, showPopup, parcels]
  );

  // estate
  const getType5 = useCallback((x, y) => {
    const id = getCoords(x, y);
    console.log("id",id)
    const tile = parcels[id];
    console.log("tile",parcels[id])
    if (tile?.type == 3) {
      return tile?.estateId;
    } else {
      return null;
    }
  }, []);
  // owner
  const getType4 = useCallback((x, y) => {
    const id = getCoords(x, y);
    const tile = parcels[id];
    return tile?.owner;
  }, []);
  const getType3 = useCallback((x, y) => {
    const id = getCoords(x, y);
    const tile = parcels[id];
    if (tile?.type == 9) {
      if (tile?.owner == address) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, []);
  const getType2 = useCallback((x, y) => {
    const id = getCoords(x, y);
    const tile = parcels[id]; 
    console.log("tile",tile)
    if(tile?.type==3){
      var values =[]
      // values.push(tile)
      for(var i =0 ;i<10;i++){
        let xvalue = x+i
        for(var p =0 ;p<10;p++){
          let yvalue = y+p
          const id = getCoords(xvalue, yvalue);
          const tile = parcels[id];
          values.push(tile)
        }
      
      }
      for(var i =0 ;i<10;i++){
        let xvalue = x-i
        for(var p =0 ;p<10;p++){
        let yvalue = y+p
        const id = getCoords(xvalue, yvalue);
        const tile = parcels[id];
        values.push(tile)
        }
      }
      for(var i =0 ;i<10;i++){
        let xvalue = x+i
        for(var p =0 ;p<10;p++){
        let yvalue = y-p
        const id = getCoords(xvalue, yvalue);
        const tile = parcels[id];
        values.push(tile)
        }
      }
      for(var i =0 ;i<10;i++){
        let xvalue = x-i
        for(var p =0 ;p<10;p++){
        let yvalue = y-p
        const id = getCoords(xvalue, yvalue);
        const tile = parcels[id];
        values.push(tile)
        }
      }
      var estatedata =values.filter((data)=>{
        return data.estateId==tile.estateId
      })
      // console.log("estatedata",estatedata)
      var datauniq = [...new Set(estatedata)]
      var selectmul=[]
    datauniq.map((data)=>{
      const id ={x:data.x, y:data.y}
        selectmul.push(id)
      })
      // console.log("dataid",dataid)
      console.log("selectmul",selectmul)
      // console.log("new",datauniq)
      // setSelected(selectmul)
      // onSelectGrid(selectmul)
    } 
    // console.log("parcels",parcels)
    if (tile?.type == 9) {
      return true;
    }
    if (tile?.type == 1) {
      return true;
    }
    if (tile?.type == 2) {
      return true;
    } 
    // if (tile?.type == 3) {
    //   return true;
    // } 
    else {
      return false;
    }
  }, []);

  const getType = useCallback((x, y) => {
    const id = getCoords(x, y);
    const tile = parcels[id];
    if (tile?.type == 11) {
      return true;
    } else {
      return false;
    }

    // if (tile?.type == 9) {
    //   return true;
    // }
  }, []);

  const getFilterType = useCallback((x, y) => {
    const id = getCoords(x, y);
    const tile = parcels[id];
    if (tile?.type == parseInt(filterType)) {
      return true;
    } else {
      return false;
    }
  }, []);
  const simpleLayer = (x, y) => {
    return {
      color: "#cccccc",
    };
  };
  const chessboardLayer = (x, y) => {
    return {
      color: (x + y) % 2 === 0 ? "#cccccc" : "#888888",
    };
  };
  const [selected, setSelected] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [alreadyOwnedSelect, setAlreadyOwnedSelect] = useState(false);

  const isSelected = (x, y) => {
    return selected.some((coord) => coord.x === x && coord.y === y);
  };
  const selectedStrokeLayer = (x, y) => {
    return isSelected(x, y) ? { color: "#00ff00", scale: 1.4 } : null;
  };
  const selectedStrokeLayerRed = (x, y) => {
    return isSelected(x, y) ? { color: "red", scale: 1.4 } : null;
  };
  const filteredLayer = (x, y) => {
    const key = getCoords(x, y);
    const tile = parcels[key];
    if (tile?.type == parseInt(filterType)) {
      return {
        color: "red",
        scale: 1.4,
      };
    } else {
      return null;
    }
  };
  const filteredLayervalue = (x, y) => {
    const key = getCoords(x, y);
    const tile = parcels[key];
    if (tile?.bloqs_price == parseInt(filterTypeValue)) {
      return {
        color: "red",
        scale: 1.4,
      };
    } else {
      return null;
    }
  };

  const selectedFillLayer = (x, y) => {
    return isSelected(x, y) ? { color: "#00dd00", scale: 1.2 } : null;
  };
  let hover = { x: 0, y: 0 };

  const isPositive = (x, y) => x > 0 && y > 0;

  const positiveLayer = (x, y) => {
    return {
      color: isPositive(x, y) ? "#cccccc" : "#888888",
    };
  };

  const hoverLayer = (x, y) => {
    return hover.x === x && hover.y === y
      ? { color: isPositive(x, y) ? "#ff0000" : "#00ff00" }
      : null;
  };
  const clickedLayer = (x, y) => {
    return {
      color: isSelected(x, y) ? "#00ff00" : "#888888",
    };
  };

  const connectedLayer = (x, y) => {
    // const top = x % 10 === 0;
    // const left = y % 10 === 0;
    const top = false;
    const left = false;
    return {
      color: top || left ? "transparent" : "transparent",
      top,
      left,
    };
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
      // const top = true;
      // const left = true;
      // const topLeft = true;
      return {
        color,
        top,
        left,
        topLeft,
      };
    } else {
      return {
        color: COLOR_BY_TYPE[13],
        top: true,
        left: true,
        topLeft: true,
      };
    }
  };

  const forSaleLayer = useCallback((x, y) => {
    const key = getCoords(x, y);
    const tile = parcels[key];
    if (getType(x, y)) {
      return {
        color: "#9c26f0",
        left: !!tile.left,
        top: !!tile.top,
        topLeft: !!tile.topLeft,
      };
    }
    return null;
  }, []);
  const onSaleLayer = (x, y) => {
    const id = x + "," + y;
    if (atlas && id in atlas && atlas[id].price) {
      const color = "red";
      // const top = !!atlas[id].top;
      // const left = !!atlas[id].left;
      // const topLeft = !!atlas[id].topLeft;
      const top = true;
      const left = true;
      const topLeft = true;
      return {
        color,
        top,
        left,
        topLeft,
      };
    }
    return null;
  };
  const checkType = (x, y) => {
    // console.log("ASdadasd", x, y);
  };
  const hoverfunction = (x, y) => {
    checkType(x, y);
    setShowPopup(true);
  };
  const longText = `
  Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
  Praesent non nunc mollis, fermentum neque at, semper arcu.
  Nullam eget est sed sem iaculis gravida eget vitae justo.
  `;

  const getPostionOfHover = (x) => {
    if (x >= 100 && x <= 150) {
      return 100;
    } else if (x >= 50 && x <= 100) {
      return 150;
    } else if (x >= 0 && x <= 50) {
      return 200;
    } else if (x >= -50 && x <= 0) {
      return 250;
    } else if (x >= -100 && x <= -50) {
      return 300;
    } else if (x >= -150 && x <= -100) {
      return 350;
    } else {
      return 400;
    }
  };
  useEffect(() => {
    console.log("selectedParcels",selectedParcels)
    if (selectedParcels) {
      setSelected(selectedParcels);
    }
  }, []);
  var layers = [atlasLayer, selectedStrokeLayer, selectedFillLayer];
  if (selectedParcels) {
    layers = [atlasLayer, selectedStrokeLayerRed];
  }
  if (onSale) {
    layers = [atlasLayer, forSaleLayer, selectedStrokeLayer, selectedFillLayer];
  }
  if (filterType != null) {
    layers = [
      atlasLayer,
      filteredLayer,
      selectedStrokeLayer,
      selectedFillLayer,
    ];
  }
  if (filterTypeValue != null) {
    layers = [
      atlasLayer,
      filteredLayervalue,
      selectedStrokeLayer,
      selectedFillLayer,
    ];
  }
  return (
    <div
      style={{ height: 600, backgroundColor: "#000" }}
      onMouseLeave={handleHidePopup}
    >
      <TileMap
        className="map"
        height={600}
        width={(window.innerWidth / 100) * 81}
        //  layers={[simpleLayer]}
        //  layers={[chessboardLayer]}
        //  layers={[chessboardLayer, selectedStrokeLayer, selectedFillLayer]}
        // layers={[positiveLayer, hoverLayer]}
        // onHover={(x, y) => (hover = { x, y })}
        // layers={[clickedLayer]}
        // onClick={(x, y) => selected.push({ x, y })}
        // layers={[connectedLayer]}
        // layers={[atlasLayer]} Math.abs(x)
        layers={layers}
        onClick={(x, y) => {
          console.log("x, y",x, y)
          console.log("selected",selected[0])
          // if (getType5(selected[0]?.x, selected[0]?.y) != null) {
          //   alert("estate")
          //   let data = Object.keys(parcels).filter((item) => {
          //     if(item?.type == 3) {
              
          //       if (item?.estateId == getType5(selected[0]?.x, selected[0]?.y) ) {
          //         return item;
          //       }
          //     }
          //   });
          // }
          if (getType4(selected[0]?.x, selected[0]?.y) == address) {
            if (getType3(x, y)) {
              let removedArr = [];
              let alreadySelected = selected.filter((item) => {
                if (item.x == x && item.y == y) {
                  return item;
                } else {
                  removedArr.push(item);
                }
              });
              let newArr = [...selected];
              if (alreadySelected.length == 0) {
                let adj = adjcent.filter((item) => {
                  if (item.x == x && item.y == y) {
                    return item;
                  }
                });
                if (adj.length > 0) {
                  console.log("adjadj", adj);
                  newArr.push({ x, y });
                  setSelected(newArr);
                  setSelectedAxis(newArr);
                  onSelectGrid(newArr);
                } else {
                  alert("select proper adjcent to create estate");
                }
              } else {
                setSelected(removedArr);
                setSelectedAxis(removedArr);
                onSelectGrid(removedArr);
              }
              // let newArr = [...selected];
              // newArr.push({ x, y });
              // setSelected(newArr);
              // setSelectedAxis(newArr);
              // onSelectGrid(newArr);
              // setAlreadyOwnedSelect(true);
              return;
            }
            return;
          }
          if (alreadyOwnedSelect) {
            setSelected([]);
            setSelectedAxis([]);
            onSelectGrid([]);
            setAlreadyOwnedSelect(false);
            return;
          }
          if (selected.length == 0) {
            if (getType2(x, y)) {
              let newArr = [...selected];
              if(selected.length!=1){
                newArr.push({ x, y });
              // console.log("newArr",newArr)
              // setSelected(newArr);
              // setSelectedAxis(newArr);
              // onSelectGrid(newArr);
              setAlreadyOwnedSelect(true);
              return;
              }else{ 
              newArr.push({ x, y });
              console.log("newArr",newArr)
              setSelected(newArr);
              setSelectedAxis(newArr);
              onSelectGrid(newArr);
              setAlreadyOwnedSelect(true);
              return;
              }
              
            }
          }
          if (!getType(x, y)) {
            return;
          }
          let removedArr = [];
          let alreadySelected = selected.filter((item) => {
            if (item.x == x && item.y == y) {
              return item;
            } else {
              removedArr.push(item);
            }
          });
          let newArr = [...selected];
          if (alreadySelected.length == 0) {
            newArr.push({ x, y });
            setSelected(newArr);
            setSelectedAxis(newArr);
            onSelectGrid(newArr);
          } else {
            setSelected(removedArr);
            setSelectedAxis(removedArr);
            onSelectGrid(removedArr);
          }
        }}
        onHover={handleHover}
        zoom={selectedParcels ? 1 : 0.5}
        x={selectedParcels ? selectedParcels[0].x : 0}
        y={selectedParcels ? selectedParcels[0].y : 0}
      />
      {showPopup ? (
        <div
          className="tip"
          style={{
            top: y > 0 ? y + 100 : y + 200,
            left: x > 0 ? x + 100 : x + 300,
          }}
        >
          {hoveredTile.type == 8
            ? "Place: " +
              "public place" +
              "\n" +
              "x:" +
              hoveredTile.x +
              "\n" +
              "y:" +
              hoveredTile.y
            : hoveredTile.type == 7
            ? "Place: Road" +
              "" +
              "\n" +
              "x:" +
              hoveredTile.x +
              "\n" +
              "y:" +
              hoveredTile.y
            : hoveredTile.type == 5
            ? "Place: Sea" +
              "" +
              "\n" +
              "x:" +
              hoveredTile.x +
              "\n" +
              "y:" +
              hoveredTile.y
            : "Owner:" + hoveredTile.owner &&
              hoveredTile.owner +
                "\n" +
                "x:" +
                hoveredTile.x +
                "\n" +
                "y:" +
                hoveredTile.y}
          {hoveredTile?.name && "\n" + "Name:" + hoveredTile?.name}
          {hoveredTile?.isEstate && "\n" + "Estate"}
          {hoveredTile?.image && (
            <Image
              src={hoveredTile?.image}
              fluid
              height={200}
              width={200}
              style={{ borderRadius: 5 }}
              alt={""}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Atlas;
