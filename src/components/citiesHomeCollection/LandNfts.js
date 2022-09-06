import React, { useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { FiSearch } from "react-icons/fi";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MiniAtlas from "../atlasMini";
import { useDispatch, useSelector } from "react-redux";
const land1 = require("../../assets/cities/land1.png");
const land2 = require("../../assets/cities/land2.png");
const land3 = require("../../assets/cities/land3.png");
const land4 = require("../../assets/cities/land4.png");
const land5 = require("../../assets/cities/land5.png");
const land6 = require("../../assets/cities/land6.png");

function LandNfts({ onSelectGrid, parcels, filterType, filterTypeValue }) {
  const [visible, setVisible] = useState("land");
  const reduxItems = useSelector((state) => state.WalletConnect);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const { address } = reduxItems;
  const navigate = useNavigate();
  console.log("parcels",typeof(parcels));
  return (
    <div>
      <Row>
        <Col xxl={3} xl={3} lg={3} md={6} sm={0} xs={0}>
          <div className="h-100 d-flex flex-column left-filter-column">
            <span className="mb-2">CATEGORIES</span>
            <h5
              onClick={() => setVisible("land")}
              className={
                visible == "land"
                  ? "landnft_menu-active fw-bold"
                  : "landnft_menu fw-bold"
              }
            >
              Land
            </h5>
            <span
              onClick={() => setVisible("parcels")}
              className={
                visible == "parcels"
                  ? "ml-4 landnft_menu-active"
                  : "ml-4 landnft_menu"
              }
            >
              Parcels
            </span>
            <span
              onClick={() => setVisible("estates")}
              className={
                visible == "estates"
                  ? "ml-4 landnft_menu-active"
                  : "ml-4 landnft_menu"
              }
            >
              Estates
            </span>
          </div>
        </Col>
        <Col xxl={9} xl={9} lg={9} md={6}>
          <Row>
            {parcels
              ? Object.keys(parcels)
                  .filter(
                    filterTypeValue != null
                      ? (x) =>
                          parcels[x]?.bloqs_price ==
                          (filterTypeValue == null
                            ? 1
                            : parseInt(filterTypeValue))
                      : (x) =>
                          parcels[x]?.type ==
                          (filterType == null ? 11 : parseInt(filterType))
                  )
                  .slice(0, end)
                  .map((data, index) => {
                    console.log("data",data)
                    return (
                      <Col
                        key={index.toString() + "parcels"}
                        xxl={4}
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={6}
                        className="mb-3"
                      >
                        <div
                          onClick={() => {
                            onSelectGrid([
                              { x: parcels[data].x, y: parcels[data].y },
                            ]);
                          }}
                          className="land_nft-card"
                        >
                          <div className=" h-170 w-100 ">
                            <MiniAtlas
                              parcels={parcels}
                              selectedParcels={[
                                { x: parcels[data].x, y: parcels[data].y },
                              ]}
                            />
                          </div>
                          <div className="p-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="fw-bold">x{parcels[data].x}, y{parcels[data].y}</h5>
                              <span className="fw-bold">
                            {parcels[data].bloqs_price
                              ? parcels[data].bloqs_price + "Bloqs"
                              : "1 Bloqs"}
                          </span>
                            </div>
                            <div>
                          {parcels[data]?.status == "onsale" ? <button className="nftcollection_mobile-category w-100 py-2">On Sale</button>
                            : parcels[data]?.status == "auction" ? <button className="nftcollection_mobile-category w-100 py-2">On Sale</button>
                            : <button className="metablog_primary-filled-square-button w-100 py-2">Put On Sale</button> }
                        </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })
              : null}

            <span
              onClick={() => {
                console.log("tesssss")
                setEnd(end + 100);
              }}
            >
              Add
            </span>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default LandNfts;
