import React from "react";
import { Col, Image, Row, Stack } from "react-bootstrap";
import "./Styles.css";
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';

const icon1 = require("../../assets/howitworks/hiw_icon1.png").default
const icon2 = require("../../assets/howitworks/hiw_icon2.png").default
const icon3 = require("../../assets/howitworks/hiw_icon3.png").default

const Datas = [
  {
    id: 1,
    title: "Set your wallet",
    content: "Setup your secure wallet & be a engaging part of booming economy",
    icon: icon1,
    num: "01",
  },
  {
    id: 2,
    title: "Add your NFT's",
    content: "If you are a creator/designer, here is your own market place.",
    icon: icon2,
    num: "02",
  },
  {
    id: 3,
    title: "Buy/Sell your Collection/NFT's",
    content: "If you are a creator/designer, here is your own market place.",
    icon: icon3,
    num: "03",
  },
];

function HowItWorks() {
  return (
    <Fade bottom>
    <div className="metabloq_container">
      <h1 className="text-center font-weight-bold">How It Works</h1>
      <Row>
        {Datas.map((data,i) => (
          <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-3 " key={i}>
            <Bounce>
            <div className="howitworks_cards metablog_cards h-100" key={data.id}>
              <Stack gap={2}>
                <div className="d-flex justify-content-between align-items-center">
                  <Image
                    src={data.icon}
                    alt="howitwork_icons"
                    height={60}
                    width={60}
                   
                  />
                  <span className="howitworks_cards-watermark">{data.num}</span>
                </div>
                <div>
                  <div className="font-weight-bold">{data.title}</div>
                  <p className="secondary-text">{data.content}</p>
                </div>
              </Stack>
            </div>
            </Bounce>
          </Col>
        ))}
      </Row>
    </div>
    </Fade>
  );
}

export default HowItWorks;
