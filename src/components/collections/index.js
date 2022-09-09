import React from "react";
import { Stack } from "react-bootstrap";
import CollectionsCards from "./CollectionsCards";
import "./Styles.css";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import Fade from 'react-reveal/Fade';
import { useNavigate } from "react-router-dom";

const data = {
  name: "Avatar Collections",
};

function Collections() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
 
  return (
    <Fade bottom>
    <div className="metabloq_container">
      <Stack gap={2}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {width < 576 ? (
              <h2 className="font-weight-bold poppins">
                {data.name.slice(0, 18) + (data.name.length > 18 ? ".." : "")}
              </h2>
            ) : (
              <h2 className="font-weight-bold poppins">{data.name}</h2>
            )}
          </div>
          <div onClick={()=> navigate("collections")} style={{cursor:'pointer'}}>
          <div className="font-weight-bold">Explore More</div>
          <div className="primary_coloredunderline ms-auto"></div>
          </div>
        </div>
        <CollectionsCards />
      </Stack>
    </div>
    </Fade>
  );
}

export default Collections;
