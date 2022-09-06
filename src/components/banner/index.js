import React from "react";
import "./Styles.css";
import { Row, Col, Image, Stack } from "react-bootstrap";
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import useSound from 'use-sound';
import buttonSound from '../../assets/audio/button.wav';
import {useNavigate} from 'react-router-dom';

const img1 = require("../../assets/banner/banner_pic2.png");
const img2 = require("../../assets/banner/banner_pic3.png");
const img3 = require("../../assets/banner/banner_pic4.png");
const img4 = require("../../assets/banner/banner_pic5.png");
const img5 = require("../../assets/banner/banner_pic1.png");
const img6 = require("../../assets/banner/banner_pic6.png");

function Banner() {
  const [playSound] = useSound(buttonSound)
  const navigate = useNavigate();
  return (
    <Fade bottom>
    <div className="metabloq_container banner_container">
      <Row>
        <Col
          xxl={5}
          xl={5}
          lg={5}
          md={5}
          sm={12}
          xs={12}
          className="banner_left-side-content d-flex justify-content-center align-items-center mb-3"
        >
          <div>
          <Stack gap={5}>
            <div className="">
              <h1 className="font-weight-bold">
                Create , Sell & Collect <br /> your own NFT
              </h1>
              <small className="secondary-text">
                Discover and Trade NFTs of the worlds top Artists
              </small>
            </div>
            <div className="">
              <button onClick={() =>{
                playSound();
                navigate("assets");
              }} className="metablog_primary-filled-button mx-2">
                <span>Explore Now</span>
              </button>
              <button onClick={() => playSound()} className="metablog_gradient-button mx-2">
                <span>metabloq</span>
              </button>
            </div>
            <div className="d-flex justify-content-evenly">
              <div>
                <h3>37k+</h3>
                <small className="secondary-text">Artwork</small>
              </div>
              <div className="vertical-divider"></div>
              <div>
                <h3>20k+</h3>
                <small className="secondary-text">Artist</small>
              </div>
              <div className="vertical-divider"></div>
              <div>
                <h3>99k+</h3>
                <small className="secondary-text">Auctions</small>
              </div>
            </div>
          </Stack>
          </div>
        </Col>
        <Col xxl={7} xl={7} lg={7} md={7} sm={12} xs={12}>
          <div className="banner_image_bg">
            <Row>
              <Col
                className="banner_img-grid-one"
                style={{ paddingLeft: 0, paddingRight: 0 }}
              >
                <Bounce>
                <div className="m-2">
                  <Image fluid src={img1} alt="img1" className="img-zoom-animation metabloq_img" />
                </div>
                </Bounce>
                <Bounce>
                <div className="m-2">
                  <Image fluid src={img2} alt="img1" className="img-zoom-animation metabloq_img" />
                </div>
                </Bounce>
              </Col>
              <Col
                className="banner_img-grid-two"
                style={{ paddingLeft: 0, paddingRight: 0,}}
              >
                <Bounce>
                <div className="m-2">
                  <Image fluid src={img3} alt="img1" className="img-zoom-animation metabloq_img"/>
                </div>
                </Bounce>
                <Bounce>
                <div className="m-2">
                  <Image fluid src={img4} alt="img1" className="img-zoom-animation metabloq_img"/>
                </div>
                </Bounce>
                <Bounce>
                <div className="m-2">
                  <Image fluid src={img5} alt="img1" className="img-zoom-animation metabloq_img"/>
                </div>
                </Bounce>
              </Col>
              <Col
                className="banner_img-grid-three"
                style={{ paddingLeft: 0, paddingRight: 0 }}
              >
                <Bounce>
                <div className="m-2">
                  <Image fluid src={img6} alt="img1" className="img-zoom-animation metabloq_img"/>
                </div>
                </Bounce>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
    </Fade>
  );
}

export default Banner;
