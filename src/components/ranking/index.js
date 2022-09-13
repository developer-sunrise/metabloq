import React, { useEffect, useState } from "react";
import { Col, Form, Image, Row, Stack } from "react-bootstrap";
import './Styles.css';
import Fade from 'react-reveal/Fade';
import { useLocation, useNavigate } from "react-router-dom";
const avatar1 = require('../../assets/nfts/1.png').default
const avatar2 = require('../../assets/nfts/2.png').default
const avatar3 = require('../../assets/nfts/3.png').default
const bloqs = require('../../assets/logo_block.png').default

const days = [
  { id: 1, days: "60 Days" ,value:60},
  { id: 2, days: "30 Days"  ,value:30},
  { id: 3, days: "14 Days"  ,value:14},
  { id: 4, days: "7 Days"  ,value:7},
  { id: 5, days: "Today"  ,value:1}
]

function Ranking() {
  const { state } = useLocation()
  const [topcollection, setTopcollection] = useState([])
  const navigate = useNavigate()
  const clickmore = () => {
    var data = topcollection.length + 10
    var collection = state.slice(0, data)
    setTopcollection(collection)
  }
  const calfloorprice = (data) => {
    var totalamount = 0
    if(!data){
      return 0
    }
    if (data.length!=0) {
      data.map((price) => {
        if (price) {
          totalamount += Number(price)
        }
      })
      return totalamount / data.length
    } else {
      return 0
    }
  }
  var formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 4
	});
  const filter=(e)=>{
    if(state){
      var data =[]
      state.map((event)=>{
        var date = new Date(event.collection_createdat).getTime()
        var days = Math.round((date - Date.now()) / (1000 * 60 * 60 * 24))
        days = Math.abs(days)
        if(days<= e){
          data.push(event)
        }
      })
      if(data.length!=0){
        setTopcollection(data)
      }else{
        setTopcollection([])
      }
    }
  }
  useEffect(() => {
    if(state){
      if (state.length != 0) {
        console.log("state.slice(0,10)", state.slice(0, 10))
        setTopcollection(state.slice(0, 10))
      }
    }
  }, [state])
  return (
    <div className="metabloq_container mt-sm-5">
      <Stack gap={4}>
        <Fade bottom>
          <h1 className="lufga-bold text-center">Top Collections</h1>
          <small className="secondary-text text-center w-100">
            Top NFTs on ARTZ, ranked by volume, Floor prize and others
          </small>
        </Fade>

        <div className="d-flex justify-content-center ranking_select-input">
          <Stack gap={3} direction="horizontal">
            <Form.Select
              aria-label="Default select example"
              className="ranking_input"
              onChange={(e)=>filter(e.target.value)}
            >
              {/* <option>Last 7 Days</option> */}
              {
                days.map((day, i) => (
                  <option value={day.value} key={i}>Last {day.days}</option>
                ))
              }
            </Form.Select>
            {/* <Form.Select
              aria-label="Default select example"
              className="ranking_input"
            >
              <option>All chains</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Form.Select> */}
          </Stack>
        </div>

        <Fade bottom>
          <div className="ranking_table-wrapper">
            <div className="ranking_table">
              <Row className="ranking_table-header lufga-bold d-flex justify-content-between align-items-center">
                <Col className="text-center">Collection</Col>
                <Col className="text-center">Category</Col>
                {/* <Col className="text-center">7 day%</Col> */}
                <Col className="text-center">Floor Price</Col>
                <Col className="text-center">NFTs</Col>
                <Col className="text-center">Owner</Col>
              </Row>
              <br />
              {topcollection.length!= 0 && topcollection.map((data, i) => (
                <>
                  <Row className="ranking_table-body d-flex justify-content-between align-items-center" key={i}>
                    <Col className="text-center">
                      <Stack gap={2} direction="horizontal" style={{ cursor:"pointer" }}
                        onClick={() =>
                          navigate("/collectionhome", {
                            state: {
                              id: data.collection_id,
                              type: data.collection_category,
                              data: data,
                            },
                          })} >
                        <span className="lufga-bold">{data.id}</span>
                        <Image fluid src={data.collection_logo_image} height={35} width={35} className="rounded_img" />
                        <small className="text-left"  >{data.collection_name}</small>
                      </Stack>
                    </Col>
                    <Col className="text-center">
                      <small>{data.collection_category}</small>
                    </Col>
                    {/* <Col className="text-center">
                  <small style={{color:data.color}}>{data.percentage}</small>
                </Col> */}
                    <Col className="d-flex align-items-center justify-content-center">
                      <Image src={bloqs} fluid height={20} width={20} /> &nbsp;<small>
                        {formatter.format(calfloorprice(data.price))}
                      </small>
                    </Col>
                    <Col className="text-center">
                      <small>{data.count}</small>
                    </Col>
                    <Col className="text-center">
                      <small>{data.user_name ? data.user_name : data.collection_wallet ? data.collection_wallet.slice(0, 5) + "..." + data.collection_wallet.slice(-5) : ''}</small>
                    </Col>
                  </Row>
                  <hr style={{ backgroundColor: "gray" }} />
                </>
              ))}
            </div>
          </div>
        </Fade>
        {
          state.length > 10 &&
          <div className="d-flex justify-content-center">
            <button onClick={() => clickmore()} className="metablog_primary-filled-square-button py-1 px-5">
              <span>Show More</span>
            </button>
          </div>
        }
      </Stack>
    </div>
  );
}

export default Ranking;
