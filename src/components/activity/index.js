import React, { useEffect, useState } from "react";
import { Col, Form, Image, Row, Stack } from "react-bootstrap";
import './Styles.css';
import { HiShoppingCart } from 'react-icons/hi';
import { BsTagFill } from 'react-icons/bs';
import { FaHandHolding } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import Fade from 'react-reveal/Fade';
import { Slicer, FormatDate1 } from "../../helpers/API&Helpers";
import { useLocation } from "react-router-dom";

const avatar1 = require('../../assets/nfts/1.png').default
const avatar2 = require('../../assets/nfts/2.png').default
const avatar3 = require('../../assets/nfts/3.png').default
const avatar4 = require('../../assets/nfts/4.png').default
const bloqs = require('../../assets/logo_block.png').default

const urls = process.env.REACT_APP_SCAN_baseuri_HASH

const days = [
  { id: 1, days: "60 Days", value: 60 },
  { id: 2, days: "30 Days", value: 30 },
  { id: 3, days: "14 Days", value: 14 },
  { id: 4, days: "7 Days", value: 7 },
  { id: 5, days: "Today", value: 1 }
]
function Activity({ myprofile, collectionhome, details, activityDatas }) {
  const { state } = useLocation()

  const [Activitys, setActivity] = useState([])
  const [Activitys1, setActivity1] = useState([])
  const filter = (e) => {
        var data = []
        Activitys1.map((event) => {
          var date = new Date(event.activities_createdat).getTime()
          var days = Math.round((date - Date.now()) / (1000 * 60 * 60 * 24))
          days = Math.abs(days)
          if (days <= e) {
            data.push(event)
          }
        })
        if (data.length != 0) {
          setActivity(data)
        } else {
          setActivity([])
        }
  }
  const clickmore = () => {
    var data = Activitys.length + 10
    var collection = state.slice(0, data)
    setActivity(collection)
  }
  useEffect(() => {
    if (!activityDatas) {
      // console.log("Activity",state)
      setActivity(state.slice(0, 10))
      setActivity1(state)
    } else {
      setActivity(activityDatas.slice(0, 10))
      setActivity1(activityDatas)
    }
  }, [activityDatas])
  return (
    <div style={{ overflow: "auto" }}>
      <div style={{ maxHeight: "400px" }} className={collectionhome || details ? "p-0" : "metabloq_container mt-sm-5"}>
        <Stack gap={4}>
          <div className="d-flex justify-content-end ranking_select-input">
            <Stack direction="horizontal" gap={2}>
              <Form.Select
                onChange={(e) => filter(e.target.value)}
                aria-label="Default select example" className="ranking_input">
                {
                  days.map((day) => (
                    <option value={day.value}>Last {day.days}</option>
                  ))
                }
              </Form.Select>
            </Stack>
          </div>

          <Fade bottom>
            {
              myprofile ?
                <h1 className="text-center lufga-bold">My Activity</h1> :
                <h1 className="text-center lufga-bold">Transaction History</h1>
            }
          </Fade>
          <Fade bottom>
            {
              !details &&
              <small className="secondary-text text-center w-100">
                Top NFTs on ARTZ, ranked by volume, Floor prize and others
              </small>
            }

          </Fade>
          <Fade bottom>
            <div className="ranking_table">
              <Row className="ranking_table-header lufga-bold d-flex justify-content-between align-items-center">
                <Col className="text-center">Activity</Col>
                <Col className="text-center">Hash</Col>
                <Col className="text-center">User</Col>
                <Col className="text-center">Price</Col>
                <Col className="text-center">Quantity</Col>
                <Col className="text-center">From </Col>
                <Col className="text-center">To</Col>
                <Col className="text-center">Time</Col>
              </Row>
              <br />
              {Activitys?.length > 0 && Activitys.map((data) => (
                <>
                  <Row className="ranking_table-body d-flex justify-content-between align-items-center">
                    <Col>
                      <div className="d-flex justify-content-start align-items-center ml-4">
                        <small className="lufga-bold mx-1">{data.activities_type}</small>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex justify-content-start align-items-center ml-4">
                        <a style={{ textDecoration: "none" }} href={urls + `${data.activities_hash}`} className="mx-1" target="blank">{data.activities_hash ? data.activities_hash.slice(0, 7) : "-"}</a>
                      </div>
                    </Col>
                    <Col className="text-left d-flex">
                      <Stack gap={2} direction="horizontal">
                        <Image fluid src={data.nftcollections_image} width={15} style={{ borderRadius: "5em" }} />
                        <div className="d-flex flex-column">
                          <small >{Slicer(data.activities_wallet)}</small>
                        </div>
                      </Stack>
                    </Col>
                    <Col className="text-center">
                      <Image src={bloqs} fluid height={20} width={20} />&nbsp;
                      <small className="lufga-bold"> {data.activities_price !== "" ? data.activities_price : "-"}</small>
                    </Col>
                    <Col className="text-center">
                      <small>{data.activities_quantity}</small>
                    </Col>
                    <Col className="text-center">
                      <small>{Slicer(data.activities_from)}</small>
                    </Col>
                    <Col className="text-center">
                      <small>{Slicer(data.activities_to)}</small>
                    </Col>
                    <Col className="text-center">
                      <small>{FormatDate1(data.activities_createdat)}</small>
                    </Col>
                  </Row>
                  <hr style={{ backgroundColor: "gray" }} />
                </>
              ))}
            </div>
          </Fade>
          {
            Activitys1.length > 10 &&
            <div className="d-flex justify-content-center">
              <button onClick={() => clickmore()} className="metablog_primary-filled-square-button py-1 px-5">
                <span>Show More</span>
              </button>
            </div>
          }
        </Stack>
      </div>
    </div>
  );
}

export default Activity;
