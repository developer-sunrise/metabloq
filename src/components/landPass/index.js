import React from "react";
import { Row, Col, Stack } from "react-bootstrap";
import "./styles.css";
import { IoIosArrowForward } from "react-icons/io";
import { BsHeart } from "react-icons/bs";

const datas = [
  { id: 1, name: "Premium zones" },
  { id: 2, name: "Bussiness district" },
  { id: 3, name: "other zones" },
];
const cardDatas = [
  { id: 1, name: "Event Space", subname: "Grand Palias Metabloqs" },
  { id: 2, name: "Comparis", subname: "Comparis" },
];
function LandPass() {
  return (
    <div className="landpass_container lufga">
      <Row>
        <Col xxl={4} xl={4} lg={4} md={6} sm={12}>
          <Stack gap={5}>
            <div className="mapareas_box lufga">
              <Stack gap={4}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold m-0 lufga">Map areas</h4>
                  <div className="filter-box">
                    <font size="2" className="fw-bold ">
                      Sort & Filter
                    </font>
                    <IoIosArrowForward size={14} />
                  </div>
                </div>
                {datas.map((data,i) => (
                  <div key={i} className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="circle_avatar mx-2">
                        <div className="small_circle">
                            <font size="2">1</font>
                        </div>
                      </div>
                      <small className="fw-bold mx-2">{data.name}</small>
                    </div>
                    <div className="circle_avatar mr-5">
                      <div className="small_circle">
                      <font size="2">1</font>
                      </div>
                    </div>
                  </div>
                ))}
              </Stack>
            </div>
            <div className="">
              <Stack gap={4}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold m-0 lufga">Area Highlight</h4>
                  <div className="filter-box">
                    <font size="2" className="fw-bold ">
                      View More
                    </font>
                    <IoIosArrowForward size={14} />
                  </div>
                </div>
                <Row>
                  {cardDatas.map((data,i) => (
                    <Col>
                      <div key={i} className="h-100 area-hightlight_card">
                        <div className="area-card_imgholder"></div>
                        <span className="fw-bold lufga m-0">{data.name}</span>
                        <div className="d-flex justify-content-between align-items-center">
                         <div className="d-flex">
                          <div className="medium_circle"></div>
                          <small className="mx-2"> {data.subname.slice(0, 12) +
                            (data.subname.length > 12 ? ".." : "")}</small>
                          </div>
                          <div className="likes-box">
                            <BsHeart size={15} />
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Stack>
            </div>
          </Stack>
        </Col>
        <Col xxl={8} xl={8} lg={8} md={6} sm={12}>
            <div className="map-container h-100">
                <div className="greeting_box">
                    <span className="fw-bold">Welcome to Metabloq’s Virtual Real Estate</span>
                    <br/>
                    <span>Navigate the Meta city Paris map and find your lands <br/>
                    and estates. Setup Your wallet and get yourself started. </span>
                    <br/>
                    <span className="fw-bold">Be a part of the Booming Virtual Real Estate.</span>
                </div>
            </div>
        </Col>
      </Row>
    </div>
  );
}

export default LandPass;
