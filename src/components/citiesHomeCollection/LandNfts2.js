import React, { useState } from "react";
import { Col, Image, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import {FiSearch} from "react-icons/fi";
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MiniAtlas from "../atlasMini";
import { useSelector } from "react-redux";


function LandNfts2({onSelectGrid,parcels,filterType,address,result}) {
    const [visible,setVisible] = useState("land");
    const navigate = useNavigate();
 
  return (
    <div>
      parcels
      <Row>
        <Col xxl={12} xl={12} lg={12} md={6}>
          <Row>
            {parcels?
           Object.keys(parcels).filter(x=>parcels[x]?.owner==address).filter(x=>parcels[x]?.type!=3).slice(0,100).map((data,index) => {
            return(
              <Col key={index.toString()+"parcels"} xxl={3} xl={3} lg={3} md={6} sm={6} xs={6} className="mb-3">
                <div
                // onClick={()=> {onSelectGrid([{x:parcels[data].x,y:parcels[data].y} ])}}
                // onClick={()=> navigate("citieshome",{
                //   state: {data:result},
                // })}
                    className="land_nft-card">
                  <div className=" h-170 w-100 ">
                    <MiniAtlas parcels={parcels} selectedParcels={[ {x:parcels[data].x,y:parcels[data].y} ]}/>
                  </div>
                  <div className="p-3">
                    <Stack gap={3}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="fw-bold">{data}</h5>&nbsp;
                          <span className="fw-bold">
                            {parcels[data]?.bloqs_price
                              ? parcels[data]?.bloqs_price + "Bloqs"
                              : ""}
                          </span>
                        </div>
                        <div>
                          {parcels[data]?.owner == address
                            ? <button className="metablog_primary-filled-square-button w-100 py-2">Put On Sale</button>
                            : <button className="nftcollection_mobile-category w-100 py-2">View</button> }
                        </div>
                        </Stack>
                    </div>
                </div>
              </Col>
            )})
          :null
          }
          </Row>
        </Col>
      </Row>
      Estate
      <Row>
        <Col xxl={12} xl={12} lg={12} md={6}>
          <Row>
          {/*  */}
            {parcels?
           Object.keys(parcels).filter(x=>parcels[x]?.owner==address).filter(x=>parcels[x]?.type==3).slice(0,100).map((data,index) => {
            return(
              <Col key={index.toString()+"parcels"} xxl={3} xl={3} lg={3} md={6} sm={6} xs={6} className="mb-3">
                <div
                  // onClick={()=> navigate("citieshome",{
                  //   state: {data:result},
                  // })}
                    className="land_nft-card">
                  <div className=" h-170 w-100 ">
                    <MiniAtlas parcels={parcels} selectedParcels={[ {x:parcels[data].x,y:parcels[data].y} ]}/>
                  </div>
                  <div className="p-3">
                    <Stack gap={3}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="fw-bold">{data}</h5>
                          <span className="fw-bold">
                            {parcels[data]?.bloqs_price
                              ? parcels[data]?.bloqs_price + "Bloqs"
                              : ""}
                          </span>
                        </div>
                        <div>
                          {parcels[data]?.status == "onsale" ? <button className="nftcollection_mobile-category w-100 py-2">On Sale</button>
                            : parcels[data]?.status == "auction" ? <button className="nftcollection_mobile-category w-100 py-2">On Sale</button>
                            : <button className="metablog_primary-filled-square-button w-100 py-2">Put On Sale</button> }
                        </div>
                        </Stack>
                    </div>
                </div>
              </Col>
            )})
          :null
          }
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default LandNfts2;
