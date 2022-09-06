import React,{useState} from "react";
import "./Styles.css";
import { Col, Row, Stack } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import Drawer from "@mui/material/Drawer";
import useSound from 'use-sound';
import buttonSound from '../../assets/audio/button.wav'
import WebFilter from "./WebFilter";

function MobileFilterBtn(props) {
    let {collections} = props;
    const [filterDrawer, setFilterDrawer] = useState(false);
    const [playSound] = useSound(buttonSound);
    const [showFilter, setShowFilter] = useState(false);
    const [rangeSlider,setRangeSlider] = useState(10)

    const rangeSliderChange = (value) => {
        setRangeSlider(value)
    }; 
    const horizontalLabels = {
        0: '0.01BLOQS',
        100: '100BLOQS'
      }
  return (
    <>
      <Row className="mt-1">
        <Col>
        <div className="d-flex justify-content-end align-items-center">
          <div onClick={() => { 
            setFilterDrawer(true)
            playSound()
          }} 
          className="nftcollection_mobile-category d-flex justify-content-center align-items-center">
            <small className='d-flex align-items-center'>Filter & Sort {""}<FiFilter/></small>
          </div>
         </div>
          <Drawer open={filterDrawer} onClose={() => setFilterDrawer(false)} PaperProps={{
                    sx: { width: "70%" },}}> 
                <WebFilter 
                  collections={collections}
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  rangeSlider={rangeSlider}
                  rangeSliderChange={rangeSliderChange}
                  horizontalLabels={horizontalLabels}
                  setFilterDrawer={setFilterDrawer}
                />
         </Drawer>
          
        </Col>
      </Row>
    </>
  );
}

export default MobileFilterBtn;
