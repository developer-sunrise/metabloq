import React, { useEffect, useState } from "react";
import { Col, Image, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { FiSearch } from "react-icons/fi";
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MiniAtlas from "../atlasMini";
import { useDispatch, useSelector } from "react-redux";

function LandNfts2({ onSelectGrid, parcels, filterType, result }) {
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address, USD } = reduxItems;
  const [visible, setVisible] = useState("land");
  const navigate = useNavigate();
  useEffect(() => {
    console.log("selected collection", parcels)
  }, [parcels])
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  });
  return (
    <div>
      parcels
      <Row>
        <Col xxl={12} xl={12} lg={12} md={6}>
          <Row>
            {parcels ?
              parcels.map((data1, i) => {
           return (
            data1.parcels && 
                  Object.keys(data1.parcels).filter(x => parcels[i].parcels[x]?.owner == address).filter(x => parcels[i].parcels[x]?.type != 3).slice(1, 100).map((data, index) => {
                    {console.log("parcelsdata", parcels[i].parcels[data])}
                    return (
                      <Col key={index.toString() + "parcels"} xxl={3} xl={3} lg={3} md={6} sm={6} xs={6} className="mb-3">
                        {console.log("parcelsdata", parcels[i].parcels[data])}
                        <div
                          onClick={() => {
                            navigate("/collections/citieshome", { state: { id: data1.collection_id, data: data1, item: [{ x: data1.parcels[data].x, y: data1.parcels[data].y }] } })
                          }}
                          className="land_nft-card">
                          <div className=" h-170 w-100 ">
                            <MiniAtlas parcels={parcels[i].parcels[data]} selectedParcels={[{ x: data1.parcels[data].x, y: data1.parcels[data].y }]} />
                          </div>
                          <div className="p-3">
                            <Stack gap={3}>
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold">{data}</h5>&nbsp;
                                <span className="fw-bold">
                                  {data1.parcels[data]?.bloqs_price
                                    ? data1.parcels[data]?.bloqs_price + "BLOQS"
                                    : ""}
                                </span>

                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold"> </span>
                                <span className="fw-bold">
                                  {data1.parcels[data].bloqs_price
                                    ? formatter.format(data1.parcels[data].bloqs_price * USD) + "$"
                                    : ""}
                                </span>
                              </div>
                              <div>
                                {data1.parcels[data]?.owner == address
                                  ? <button className="metablog_primary-filled-square-button w-100 py-2">Put On Sale</button>
                                  : <button className="nftcollection_mobile-category w-100 py-2">View</button>}
                              </div>
                            </Stack>
                          </div>
                        </div>
                      </Col>
                    )
                  })
                )
              })
              : null
            }
          </Row>
        </Col>
      </Row>
      Estate
      <Row>
        <Col xxl={12} xl={12} lg={12} md={6}>
          <Row>
            {/*  */}
            {parcels ?
              Object.keys(parcels).filter(x => parcels[x]?.owner == address).filter(x => parcels[x]?.type == 3).slice(0, 100).map((data, index) => {
                return (
                  <Col key={index.toString() + "parcels"} xxl={3} xl={3} lg={3} md={6} sm={6} xs={6} className="mb-3">
                    <div
                      onClick={() => {
                        navigate("/collections/citieshome", { state: { id: '49', data: result, item: [{ x: parcels[data].x, y: parcels[data].y }] } })
                        // onSelectGrid([
                        //   { x: parcels[data].x, y: parcels[data].y },
                        // ]);
                      }}
                      className="land_nft-card">
                      <div className=" h-170 w-100 ">
                        <MiniAtlas parcels={parcels} selectedParcels={[{ x: parcels[data].x, y: parcels[data].y }]} />
                      </div>
                      <div className="p-3">
                        <Stack gap={3}>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold">{data}</h5>
                            <span className="fw-bold">
                              {parcels[data]?.bloqs_price
                                ? parcels[data]?.bloqs_price + "BLOQS"
                                : ""}
                            </span>

                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold"> </span>
                            <span className="fw-bold">
                              {parcels[data].bloqs_price
                                ? formatter.format(parcels[data].bloqs_price * USD) + "$"
                                : ""}
                            </span>
                          </div>
                          <div>
                            {parcels[data]?.status == "onsale" ? <button className="nftcollection_mobile-category w-100 py-2">On Sale</button>
                              : parcels[data]?.status == "auction" ? <button className="nftcollection_mobile-category w-100 py-2">On Sale</button>
                                : <button className="metablog_primary-filled-square-button w-100 py-2">Put On Sale</button>}
                          </div>
                        </Stack>
                      </div>
                    </div>
                  </Col>
                )
              })
              : null
            }
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default LandNfts2;
