import React, { useEffect } from "react";
import { Row, Col, Stack, Image } from "react-bootstrap";
import { AiTwotoneHeart } from "react-icons/ai";
import { CollectablesData } from "./CollectablesData";
import Fade from 'react-reveal/Fade';
import { useNavigate } from "react-router-dom";
import { getMethod } from "../../helpers/API&Helpers";
import { useDispatch, useSelector } from "react-redux";

function CollectablesCards() {
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { allCollection } = reduxItems;
  const dispatch = useDispatch()

  const getallcollection = async () => {
    let url = "getAllCollection";
    let authtoken = "";
    let response = await getMethod({ url, authtoken });

    if (response.status) {
      dispatch({ type: "GETALLCOLLECTION", payload: response.result });
    }
  };
  useEffect(() => {
    getallcollection();
  }, []);
  return (
    <Row>
    {allCollection.length > 0 && allCollection.filter(data=> data.collection_category == "Land").slice(0, 3).map((data,index) => (
      <Col key={index} xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-3">
        <Fade bottom>
          <div
            onClick={() => {
                navigate("collectionhome", {
                  state: {
                    id: data.collection_id,
                    type: data.collection_category,
                    data: data,
                  },
                });
            }}
            className="collections_cards metablog_cards"
          >
            <Stack gap={2}>
              <Row className="collections_cards-grid">
                    <div style={{ padding: 5,overflow:"hidden" }}>
                      <Image
                        style={{
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                        fluid
                        src={data.collection_banner_image}
                        alt="gridimg1"
                        className="metabloq_img img-zoom-animation"
                      />
                    </div>
                  </Row>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <span className="font-weight-bold poppins">
                    {data.collection_name}
                  </span>
                  <small>created by  {data.collection_wallet.slice(0,5)+"..."+data.collection_wallet.slice(-5)}</small>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  {/* <AiTwotoneHeart />
                  <span className="mx-1 poppins">
                    {data.collection_likes}
                  </span> */}
                </div>
              </div>
            </Stack>
          </div>
        </Fade>
      </Col>
    ))}
  </Row>
  );
}

export default CollectablesCards;
