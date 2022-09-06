import React, { useState } from "react";
import { Row, Stack, Col } from "react-bootstrap";
import { BiMicrophone } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import Form from "react-bootstrap/Form";
import buttonSound from "../../assets/audio/button.wav";
import useSound from "use-sound";

function WebFilter(props) {
  let {
    horizontalLabels,
    setShowFilter,
    rangeSliderChange,
    rangeSlider,
    setFilterDrawer,
    collections,
    collectionhome,
  } = props;
  const [playSound] = useSound(buttonSound);

  const handleApplyClick = () => {
    if (setFilterDrawer) {
      setFilterDrawer(false);
    } else if (setShowFilter) {
      setShowFilter(false);
    }
    playSound();
  };
  const [active, setActive] = useState("");

  const handleClick = (event) => {
    setActive(event.target.id);
  };
  return (
    <>
      {!collections ? (
        <div className="h-100 metabloq_webfilter-section">
          <Stack gap={3}>
            <div className="metabloq_webfilter-searchbox">
              <FiSearch />
              <input
                type="text"
                placeholder="Search item"
                className="webfilter_search-input"
              />
              <BiMicrophone />
            </div>
            <div className="">
              <div>Type</div>
              <Row className="nftcollection_filter-menu">
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"1"}
                    className={
                      active === "1"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Allitems</small>{" "}
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"2"}
                    className={
                      active === "2"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">3-d</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"3"}
                    className={
                      active === "3"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Video</small>{" "}
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"4"}
                    className={
                      active === "4"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Animation</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"5"}
                    className={
                      active === "5"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Photography</small>{" "}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="webfilter_range">
              <div>Price Range</div>
              <div className="slider custom-labels">
                <Slider
                  min={0}
                  max={100}
                  value={rangeSlider}
                  labels={horizontalLabels}
                  onChange={rangeSliderChange}
                />
              </div>
            </div>
            {collectionhome && (
              <div className="">
                <div>Status</div>
                <Row>
                  <Col
                    xxl={6}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className="px-0"
                  >
                    <div
                      onClick={handleClick}
                      id={"6"}
                      className={
                        active === "6"
                          ? "nftcollection_filter-active-div m-2"
                          : "nftcollection_filter-div m-2"
                      }
                    >
                      <small size="2">Allitems</small>
                    </div>
                  </Col>
                  <Col
                    xxl={6}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className="px-0"
                  >
                    <div
                      onClick={handleClick}
                      id={"7"}
                      className={
                        active === "7"
                          ? "nftcollection_filter-active-div m-2"
                          : "nftcollection_filter-div m-2"
                      }
                    >
                      <small size="2">BuyNow</small>
                    </div>
                  </Col>
                  <Col
                    xxl={6}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className="px-0"
                  >
                    <div
                      onClick={handleClick}
                      id={"8"}
                      className={
                        active === "8"
                          ? "nftcollection_filter-active-div m-2"
                          : "nftcollection_filter-div m-2"
                      }
                    >
                      <small size="2">OnAuction</small>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            {collectionhome && (
              <div className="">
                <div>Sort By</div>
                <Row>
                  <Col
                    xxl={6}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className="px-0"
                  >
                    <div
                      onClick={handleClick}
                      id={"9"}
                      className={
                        active === "9"
                          ? "nftcollection_filter-active-div m-2"
                          : "nftcollection_filter-div m-2"
                      }
                    >
                      <small size="2">HighestFirst</small>
                    </div>
                  </Col>
                  <Col
                    xxl={6}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={6}
                    className="px-0"
                  >
                    <div
                      onClick={handleClick}
                      id={"10"}
                      className={
                        active === "10"
                          ? "nftcollection_filter-active-div m-2"
                          : "nftcollection_filter-div m-2"
                      }
                    >
                      <small size="2">LowestFirst</small>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            {!collectionhome && (
              <div className="">
                <div>Creator</div>
                <div className="">
                  <Form.Select aria-label="Default select example">
                    <option>Verified only</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </div>
              </div>
            )}

            <Row xxl={10} xl={10} lg={10} md={10}>
              <Col>
                <button className="nftcollection_mobile-category">
                  <small size="1">Reset All filter</small>
                </button>
              </Col>
            </Row>
            <button
              onClick={handleApplyClick}
              className="metablog_primary-filled-square-button"
            >
              <small>Apply</small>
            </button>
          </Stack>
        </div>
      ) : (
        <div className="h-100 metabloq_webfilter-section">
          <Stack gap={3}>
            <div className="metabloq_webfilter-searchbox">
              <FiSearch />
              <input
                type="text"
                placeholder="Search item"
                className="webfilter_search-input"
              />
              <BiMicrophone />
            </div>
            <div className="">
              <div>Type</div>
              <Row className="nftcollection_filter-menu">
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"11"}
                    className={
                      active === "11"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Allitems</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"12"}
                    className={
                      active === "12"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Arts</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"13"}
                    className={
                      active === "13"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Buildings</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"14"}
                    className={
                      active === "14"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Wearables</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"15"}
                    className={
                      active === "15"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">VirtualRealEstate</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"16"}
                    className={
                      active === "16"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">MetaPets</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"17"}
                    className={
                      active === "17"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">Miscellaneous</small>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="webfilter_range">
              <div>Floor price</div>
              <div className="slider custom-labels">
                <Slider
                  min={0}
                  max={100}
                  value={rangeSlider}
                  labels={horizontalLabels}
                  onChange={rangeSliderChange}
                />
              </div>
            </div>
            <div className="">
              <div>Sort By</div>
              <Row>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"18"}
                    className={
                      active === "18"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">HighestFirst</small>
                  </div>
                </Col>
                <Col
                  xxl={6}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className="px-0"
                >
                  <div
                    onClick={handleClick}
                    id={"19"}
                    className={
                      active === "19"
                        ? "nftcollection_filter-active-div m-2"
                        : "nftcollection_filter-div m-2"
                    }
                  >
                    <small size="2">LowestFirst</small>
                  </div>
                </Col>
              </Row>
            </div>
            <Row xxl={10} xl={10} lg={10} md={10}>
              <Col>
                <button className="nftcollection_mobile-category">
                  <small size="1">Reset All filter</small>
                </button>
              </Col>
            </Row>
            <button
              onClick={handleApplyClick}
              className="metablog_primary-filled-square-button"
            >
              <small>Apply</small>
            </button>
          </Stack>
        </div>
      )}
    </>
  );
}

export default WebFilter;
