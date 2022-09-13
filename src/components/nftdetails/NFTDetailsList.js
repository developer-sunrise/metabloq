import React, { useEffect, useState } from "react";
import "./Styles.css";
import { Col, Image, Row, Stack } from "react-bootstrap";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import Fade from "react-reveal/Fade";
import Zoom from "react-reveal/Zoom";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { useNavigate } from "react-router-dom";
import { LiveAuctionData } from "../liveauctions/LiveAuctionData";
import Modalbox from "../modalbox/Modalbox";
import PlacebidModal from "../placebidModal";
import MyProfileNfts from "../SmallComponents/MyProfileNfts";
import NftDetailsButtons from "../SmallComponents/NftDetailsButtons";
import { useSelector } from "react-redux";


const NFTDetailsList = (props) => {
  let { collectionNfts,myprofile } = props;
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const {address } = reduxItems;
  const placeModalClose = () => {
    setPlaceModalOpen(false);
  };
  const onPlacebidClick = () => {
    playSound()
    setPlaceModalOpen(true);
  };
  const [playSound] = useSound(buttonSound);
  //for puton sale modal
  const [show, setShow] = useState(false);
  const [nftsImg, setNftsImg] = useState("");

  return (
    <>
      <Stack gap={3}>
      {myprofile ? <h2 className="lufga-bold">My NFTs</h2> : null}
        <Row>
          {collectionNfts?.length > 0 && collectionNfts.map((data,i) => (
            <Col xxl={3} xl={3} lg={3} md={4} sm={6} xs={6} className="mb-3" key={i}>
              <Fade bottom>
                <div
                  className="liveauction_cards metablog_cards h-100"
                  key={i}
                >
                  <Stack gap={2}>
                    <div className="liveauction_cards-imgwithtime my-2">
                      <Image
                        fluid
                        src={data.nftcollections_image}
                        alt="square"
                        style={{height:"200px"}}
                        className="metabloq_img img-zoom-animation"
                        onClick={() => navigate(`/collectionhome/${data.nftcollections_id}`,{state:{data:data}})}
                      />
                    </div>
                    <div className="">
                      <div className="d-flex">
                        {width < 576 ? (
                          <div>
                            {data.nftcollections_name.slice(0, 12) +
                              (data.nftcollections_name.length > 12 ? ".." : "")}
                          </div>
                        ) : (
                          <div>
                            {data.nftcollections_name.slice(0, 20) +
                              (data.nftcollections_name.length > 20 ? ".." : "")}
                          </div>
                        )}
                      </div>
                      <div className="d-flex">
                        { data.nftcollections_price ? 
                        <div
                          className="font-weight-bold"
                          style={{ color: "#1C83E5" }}
                        >
                          {data.nftcollections_price} BLOQS
                        </div> : " "}
                      </div>
                    </div>
                    {
                      data.nftcollections_wallet == address && 
                      <>
                      {
                        data.nftcollections_status == "onsale" ? 
                        <button className="nftcollection_mobile-category">ON SALE</button> 
                        : data.nftcollections_status == "auction" ?
                         <button className="nftcollection_mobile-category">ON SALE</button> : null 
                      }
                      </>
                    }
                  </Stack>
                </div>
              </Fade>
            </Col>
          ))}
        </Row>
        <Zoom bottom duration={2000}>
          <div className="d-flex justify-content-center">
            <button
            
              className="mr-2 nftcollection_mobile-category"
            >
              <font size="2">Load More</font>
            </button>
          </div>
        </Zoom>
      </Stack>
      <Modalbox show={show} setShow={setShow} nftsImg={nftsImg} />
      <PlacebidModal
        placeModalOpen={placeModalOpen}
        setPlaceModalOpen={setPlaceModalOpen}
        placeModalClose={placeModalClose}
        playSound={playSound}
      />
    </>
  );
};
export default NFTDetailsList;
