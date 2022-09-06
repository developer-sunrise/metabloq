import React, { useState, useEffect } from "react";
import { Row, Col, Stack, Image } from "react-bootstrap";
import {
  CollectionsData,
  CollectionsDataDynamic,
} from "../collections/CollectionsData";
import { AiTwotoneHeart } from "react-icons/ai";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import { useSelector } from "react-redux";

const collectionsPerRow = 6;

function BuildingCollection(props) {
  const [next, setNext] = useState(collectionsPerRow);
  const handleMoreCollection = () => {
      setNext(next + collectionsPerRow);
    };
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { allCollection } = reduxItems;

  return (
    <Stack gap={3}>
      <Row>
        {allCollection.filter(item=> item.collection_category == "Land").slice(0, next)?.map((item,i) => {
            return (
              <Col
                xxl={4}
                xl={4}
                lg={4}
                md={4}
                sm={12}
                xs={12}
                className="mb-3"
                key={i}
              >
                <Fade bottom>
                  <div
                    className="collections_cards metablog_cards"
                  
                     onClick={() => {
                      navigate("citieshome",{
                      state: {id: item.collection_id, type:item.category, data: item},
                    })
                  }}
                    
                  >
                    <Stack gap={2}>
                    <Row className="collections_cards-grid">
                    <div style={{ padding: 5,borderRadius:".5em",overflow:"hidden"}}>
                            <Image
                              style={{
                                height: "200px",
                                width: "100%",
                                objectFit: "cover",
                              }}
                              fluid
                              src={item.collection_banner_image}
                              alt="gridimg1"
                              className="metabloq_img img-zoom-animation"
                            />
                          </div>
                    </Row>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                          <span className="font-weight-bold poppins">
                          {item.collection_name}
                          </span>
                          <small className="secondary-text poppins">
                            created by {item.collection_wallet.slice(0,5)+"..."+item.collection_wallet.slice(-5)}
                          </small>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                          <AiTwotoneHeart />
                          <span className="mx-1 poppins">{item.collection_likes}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between poppins">
                        <small>Floor price</small>
                        <small className="fw-bold">1.90</small>
                      </div>
                    </Stack>
                  </div>
                </Fade>
              </Col>
            );
          })}
      </Row>
      {
        allCollection.length > 0 &&
      <Zoom bottom duration={2000}>
        <div className="d-flex justify-content-center">
          <button onClick={handleMoreCollection} className="mr-2 nftcollection_mobile-category">
            <font size="2">Load More</font>
          </button>
        </div>
      </Zoom>
      }
    </Stack>
  );
}

export default BuildingCollection;
