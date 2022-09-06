import React from "react";
import "./Styles.css";
import { Col, Row } from "react-bootstrap";
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';


const Datas = [
  {
    id: 1,
    title: "High-Quality Artworks",
    content:
      "Art work that insprires you. Feed your soul with curated art collcetions",
  },
  {
    id: 2,
    title: "NFT Market Daily Reports",
    content:
      "Stay updates with trend of the Market. Reports that are effective will be in your inbox ",
  },
  {
    id: 3,
    title: "Exhibitions at Meta Museums",
    content:
      "Showcase your talent at the Louvre Meta Museum & reach out a global network of Mets-Citizens.",
  },
];

function ChooseUs() {
  return (
    <Fade bottom>
    <div className="chooseus_container">
      <div className="chooseus_wrapper">
      <div className="mb-2">
        <h2 className="font-weight-bold">Why You Have to Choose Us?</h2>
        <small className="secondary-text">
          Reasonable reson to pick us, Here what we offer for you
        </small>
      </div>
      <Row >
        {Datas.map((data) => (
          <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="d-flex align-items-stretch">
            <Bounce>
            <div className="chooseus_cards metablog_cards img-zoom-animation" key={data.id}>
              <div className="font-weight-bold">
                {data.id}. {data.title}
              </div>
              <small className="secondary-text">{data.content}</small>
            </div>
            </Bounce>
          </Col>
        ))}
      </Row>
      </div>
    </div>
    </Fade>
  );
}

export default ChooseUs;
