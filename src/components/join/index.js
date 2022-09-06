import React from "react";
import "./Styles.css";
import { Row, Image, Col, Stack } from "react-bootstrap";
import Fade from 'react-reveal/Fade';
import useSound from 'use-sound';
import buttonSound from '../../assets/audio/button.wav';

const img = require("../../assets/join/metablog_circle.svg").default

function Join() {
  const [playSound] = useSound(buttonSound)

  return (
    <Fade right>
    <div className="join_container">
      <Row>
        <Col className="d-flex justify-content-center join_img-box">
            <Image fluid src={img} className="join_img-responsive  img-zoom-animation"/>
        </Col>
        <Col xs={6} className="p-md-5 d-flex align-items-center justify-content-center">
          <div>
            <Stack gap={5}>
            <div className="">
                <h1>Join and <br/> get free <b>NFT</b></h1>
                <small className="secondary-text">Digital Revolution is here, explore, & collect digital art NFT</small>
            </div>
            <div className="">
                <button onClick={() => playSound()} className="metablog_primary-filled-button mx-2"><span>Join Now</span></button>
                <button onClick={() => playSound()} className="metablog_gradient-borderless-button mx-2"><span>Learn More</span></button>
            </div>
            </Stack>
          </div>
        </Col>
      </Row>
    </div>
    </Fade>
  );
}

export default Join;
