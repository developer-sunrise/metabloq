import React from "react";
import { Row, Col, Stack, Image } from "react-bootstrap";
import { AiTwotoneHeart } from "react-icons/ai";
import { CollectablesData } from "./CollectablesData";
import Fade from 'react-reveal/Fade';
import { useNavigate } from "react-router-dom";

function CollectablesCards() {
  const navigate = useNavigate()
  return (
    <Row>
      {CollectablesData.map((data) => (
        <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-3">
          <Fade bottom>
          <div onClick={()=> navigate("collectionhome")} className="collectables_cards metablog_cards" key={data.id}>
            <Stack gap={2}>
              <div className="collectables_cards-imgsection">
                <Image fluid src={data.image} alt="collectables" className="metabloq_img img-zoom-animation"/>
                <div className="collectables_cards-likesbox d-flex justify-content-center align-items-center">
                  <span>
                    <AiTwotoneHeart color="white" size={18}/>
                  </span>
                  <span className="mx-1">{data.likes}</span>
                </div>
                <div className="collectables_cards-avatarbox">
                  <Image fluid src={data.avatar} height={45}  className="metabloq_img" />
                </div>
              </div>
              <br/>
              <div className="text-center">
                <div className="font-weight-bold">{data.name}</div>
                <small className="secondary-text">
                  owned by <small className="font-weight-bold text-dark">{data.sub_title}</small>
                </small>
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
