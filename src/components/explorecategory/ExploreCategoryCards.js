import React, { useState } from "react";
import { ExploreCategoryData } from "./ExploreCategoryData";
import { Row, Col, Stack, Image } from "react-bootstrap";
import Bounce from 'react-reveal/Bounce';
import { useNavigate } from "react-router-dom";
import { artAction, buildingAction, metapetsAction, miscellaneousAction, virtualrealestateAction, wearablesAction } from "../../redux/TabAction";
import { useDispatch } from "react-redux";

function ExploreCategoryCards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clickedId,setClickedId] = useState("");
  

  const categoryClick = (name)=>{
    setClickedId(name);
    if(name == "Art"){
      dispatch(artAction())
    }else if(name == "Land"){
      dispatch(buildingAction())
    }else if(name == "Virtual Real Estate"){
      dispatch(virtualrealestateAction())
    }else if(name == "MetaPets"){
      dispatch(metapetsAction())
    }else if(name == "Wearables"){
      dispatch(wearablesAction())
    }else if(name == "Miscellaneous"){
      dispatch(miscellaneousAction())
    }
    navigate("collections");
  }
  return (
    <Row>
      {ExploreCategoryData.map((data,i) => (
        <Col key={i} xxl={2} xl={2} lg={2} md={2} sm={6} xs={6} className="mb-3 ">
          <Bounce>
          <div onClick={()=>categoryClick(data.name)} className="explorecategory_cards metablog_cards h-100" key={data.id}>
            <Stack gap={2}>
              <div className="text-center">
                <Image
                  fluid
                  src={data.image}
                  alt="category"
                  height={60}
                  width={60}
                
                />
              </div>
              <div className="text-center">
                <span className="secondary-text poppins">{data.name}</span>
              </div>
            </Stack>
          </div>
          </Bounce>
        </Col>
      ))}
    </Row>
  );
}

export default ExploreCategoryCards;
