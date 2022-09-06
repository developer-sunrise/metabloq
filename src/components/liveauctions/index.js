import React from "react";
import LiveAuctionCards from "./LiveAuctionCards";
import "./Styles.css";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import Fade from 'react-reveal/Fade';
import { useNavigate } from "react-router-dom";

const data = {
  name:"Live Auctions",
  sub:"Look out for those Distruptors"
}
function LiveAuctions() {
  const navigate = useNavigate();
  const {width} = useWindowDimensions();
  return (
    <Fade bottom>
    <div className="metabloq_container">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          {
              width < 576 ? 
              <h2 className="font-weight-bold">{data.name.slice(0, 15) + (data.name.length > 15 ? ".." : "")}</h2> :
              <h2 className="font-weight-bold">{data.name}</h2>
          }
         {
            width < 576 ? 
            <span className="secondary-text poppins">{data.sub.slice(0, 30) + (data.sub.length > 30 ? ".." : "")}</span> : 
            <span className="secondary-text poppins">{data.sub}</span>
          }
        </div>
        <div onClick={()=> navigate("/liveauction")} style={{cursor:'pointer'}}>
        <div className="font-weight-bold">Explore More</div>
        <div className="primary_coloredunderline ms-auto"></div>
        </div>
      </div>
      <LiveAuctionCards/>
    </div>
    </Fade>
  );
}

export default LiveAuctions;
