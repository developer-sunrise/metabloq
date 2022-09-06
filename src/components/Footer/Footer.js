import React from "react";
import { Col, Image, Row, Stack } from "react-bootstrap";
import "./Footer.css";
import { BsLinkedin } from "react-icons/bs";
import { GrFacebook } from "react-icons/gr";
import { ImTwitter } from "react-icons/im";
import { SiDiscord } from "react-icons/si";
import { BsInstagram } from "react-icons/bs";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
const logo = require("../../assets/metablog_logo.png").default

function Footer() {
  const [playSound] = useSound(buttonSound);


  return (
    <>
        <div className="footer_container mt-sm-5">
          <hr />
          <Row>
            <Col xxl={2} xl={2} lg={2} md={2} sm={12} xs={12} className="mb-3">
              <Image fluid src={logo} alt="metablog" />
              <small className="secondary-text poppins">
                Metabloq is the trusted metaverse for people seeking authentic
                connections & experiences
              </small>
            </Col>
            <Col xxl={2} xl={2} lg={2} md={2} sm={12} xs={12} className="mb-3">
              <div className="font-weight-bold poppins mb-3">About Us</div>
              <Stack gap={2}>
                <small className="secondary-text poppins">About</small>
                <small className="secondary-text poppins">Ecosystem</small>
                <small className="secondary-text poppins">Team</small>
                <small className="secondary-text poppins">
                  Apply for Rewards
                </small>
                <small className="secondary-text poppins">
                  Metabloqs White Paper
                </small>
              </Stack>
            </Col>
            <Col xxl={2} xl={2} lg={2} md={2} sm={12} xs={12} className="mb-3 pl-0">
              <div className="font-weight-bold poppins mb-3">Contact</div>
              <Stack gap={2}>
                <small className="secondary-text poppins">
                  info@metabloq.com
                </small>
                <small className="secondary-text poppins">
                  press@metabloq.com
                </small>
                <small className="secondary-text poppins">
                  career@metabloq.com
                </small>
              </Stack>
            </Col>
            <Col xxl={2} xl={2} lg={2} md={2} sm={12} xs={12} className="mb-3">
              <div className="font-weight-bold poppins mb-3">Policies</div>
              <Stack gap={2}>
                <small className="secondary-text poppins">Cookie Policy</small>
                <small className="secondary-text poppins">Privacy Policy</small>
                <small className="secondary-text poppins">
                  Terms & Conditions
                </small>
              </Stack>
            </Col>
            <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-3">
              <div className="font-weight-bold poppins mb-3">
                Signup for our newsletter to get the latest information in your
                inbox
              </div>
              <Stack gap={2}>
                <small className="secondary-text poppins">
                  No spam message, your email is safe with us
                </small>

                <div className="footer_inputbox">
                  <input
                    className="footer_input"
                    type="text"
                    placeholder="Type your email here"
                  />
                  <button
                    onClick={() => playSound()}
                    className="metablog_primary-filled-button"
                  >
                    <span className="poppins">Subscribe</span>
                  </button>
                </div>
              </Stack>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col
              xxl={10}
              xl={10}
              lg={10}
              md={10}
              sm={12}
              xs={12}
              className="footer_mobile-center"
            >
              <small className="secondary-text">
                Copyrights @ 2022 Metabloq
              </small>
            </Col>
            <Col
              xxl={2}
              xl={2}
              lg={2}
              md={2}
              sm={12}
              xs={12}
              className="footer_mobile-center"
            >
              <Stack direction="horizontal" gap={3}>
                <span>
                  <BsLinkedin color="#0295FA" size={20} />
                </span>
                <span>
                  <GrFacebook color="#0295FA" size={20} />
                </span>
                <span>
                  <ImTwitter color="#0295FA" size={20} />
                </span>
                <span>
                  <SiDiscord color="#0295FA" size={20} />
                </span>
                <span>
                  <BsInstagram color="#0295FA" size={20} />
                </span>
              </Stack>
            </Col>
          </Row>
        </div> 
    </>
  );
}

export default Footer;
