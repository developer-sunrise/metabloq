import React from "react";
import { Stack } from "react-bootstrap";
import ExploreCategoryCards from "./ExploreCategoryCards";
import "./Styles.css";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import Fade from 'react-reveal/Fade';
import { useNavigate } from "react-router-dom";

const data = {
  name:"Explore by Category",
  sub:"Find your favorite category here"
}

function ExploreCategory() { 
  const {width} = useWindowDimensions();
  const navigate = useNavigate()
  return (
    <Fade bottom>
    <div className="metabloq_container">
    <Stack gap={2}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          {
              width < 576 ? 
              <h2 className="font-weight-bold poppins">{data.name.slice(0, 15) + (data.name.length > 15 ? ".." : "")}</h2> :
              <h2 className="font-weight-bold poppins">{data.name}</h2>
          }
          {
            width < 576 ? 
            <span className="secondary-text poppins">{data.sub.slice(0, 30) + (data.sub.length > 30 ? ".." : "")}</span> : 
            <span className="secondary-text poppins">{data.sub}</span>
          }
          
        </div>
        <div onClick={()=> navigate("collections")} style={{cursor:'pointer'}}>
        <div className="font-weight-bold">Explore More</div>
        <div className="primary_coloredunderline ms-auto"></div>
        </div>
      </div>
      <ExploreCategoryCards />
    </Stack>
    </div>
    </Fade>
  );
}

export default ExploreCategory;
