import React, { useEffect, useState } from "react";
import { Row, Col, Stack, Image } from "react-bootstrap";
import { CollectionsData } from "../../components/collections/CollectionsData";
import { AiTwotoneHeart } from "react-icons/ai";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import "./Styles.css";
import { useNavigate } from "react-router-dom";

function CollectionsListing() {
  const navigate = useNavigate()
  return (
    <div className="metabloq_container">
      <Stack gap={3}>
        <Row>
          {CollectionsData.slice(
            0,
            !collections ? 3 : CollectionsData.length
          ).map((data) => (
            <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-3">
              <Fade bottom>
                <div  className="collections_cards metablog_cards" key={data.id}>
                  <Stack gap={2}>
                    <Row className="collections_cards-grid">
                      <Col>
                        <Row>
                          <Col style={{ padding: 5 }}>
                            <Image
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                              }}
                              fluid
                              src={data.grid_img1}
                              alt="gridimg1"
                              className="metabloq_img img-zoom-animation"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col style={{ padding: 5 }}>
                            <Image
                              fluid
                              src={data.grid_img2}
                              alt="gridimg1"
                              className="metabloq_img img-zoom-animation"
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Col style={{ padding: 5 }}>
                            <Image
                              fluid
                              src={data.grid_img3}
                              alt="gridimg1"
                              className="metabloq_img img-zoom-animation"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col style={{ padding: 5 }}>
                            <Image
                              fluid
                              src={data.grid_img4}
                              alt="gridimg1"
                              className="metabloq_img img-zoom-animation"
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-column">
                        <span className="font-weight-bold poppins">
                          {data.c_name}
                        </span>
                        <small className="secondary-text poppins">
                          created by{" "}
                          <small className="font-weight-bold text-dark">
                            {data.c_sub_name}
                          </small>
                        </small>
                      </div>
                      <div className="d-flex justify-content-center align-items-center">
                        <AiTwotoneHeart />
                        <span className="mx-1 poppins">{data.c_likes}</span>
                      </div>
                    </div>
                  </Stack>
                </div>
              </Fade>
            </Col>
          ))}
        </Row>
        <Zoom bottom duration={2000}>
          <div className="d-flex justify-content-center">
            <button
              onClick={handleShowMoreCards}
              className="mr-2 nftcollection_mobile-category"
            >
              <font size="2">Load More</font>
            </button>
          </div>
        </Zoom>
      </Stack>
    </div>
  );
}

export default CollectionsListing;
