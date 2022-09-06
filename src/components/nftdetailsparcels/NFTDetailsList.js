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

const cardsPerPage = 4;
let arrayForHoldingCards = [];
const NFTDetailsList = (props) => {
  let { nftdetailspage, collectionhome, myprofile } = props;
  const [cardsToShow, setCardsToShow] = useState([]);
  const [next, setNext] = useState(4);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const [placeModalOpen, setPlaceModalOpen] = useState(false);

  const placeModalClose = () => {
    setPlaceModalOpen(false);
  };

  const onPlacebidClick = () => {
    playSound()
    setPlaceModalOpen(true);
  };

  const loopWithSlice = (start, end) => {
    const slicedCards = LiveAuctionData.slice(start, end);
    arrayForHoldingCards = [...arrayForHoldingCards, ...slicedCards];
    setCardsToShow(arrayForHoldingCards);
  };
  useEffect(() => {
    loopWithSlice(0, cardsPerPage);
  }, []);

  const handleShowMoreCards = () => {
    loopWithSlice(next, next + cardsPerPage);
    setNext(next + cardsPerPage);
    playSound();
  };
  const [playSound] = useSound(buttonSound);

  //for puton sale modal
  const [show, setShow] = useState(false);
  const [nftsImg, setNftsImg] = useState("");
  return (
    <>
      <Stack gap={3}>
        <Row>
          {cardsToShow.map((data,icon) => (
            <Col xxl={3} xl={3} lg={3} md={4} sm={6} xs={6} className="mb-3" key={i}>
              <Fade bottom>
                <div
                  className="liveauction_cards metablog_cards h-100"
                  key={data.id}
                >
                  <Stack gap={2}>
                    <div className="liveauction_cards-imgwithtime my-2">
                      <Image
                        fluid
                        src={data.avatar}
                        alt="square"
                        className="metabloq_img img-zoom-animation"
                        onClick={() => navigate(`../${data.id}`,{replace:true})}
                      />
                    </div>
                    <div className="">
                      <div className="d-flex">
                        {width < 576 ? (
                          <div>
                            {data.avatar_name.slice(0, 12) +
                              (data.avatar_name.length > 12 ? ".." : "")}
                          </div>
                        ) : (
                          <div>
                            {data.avatar_name.slice(0, 20) +
                              (data.avatar_name.length > 20 ? ".." : "")}
                          </div>
                        )}
                        <span className="ms-auto font-weight-bold">...</span>
                      </div>
                      <div className="d-flex">
                        <div
                          className="font-weight-bold"
                          style={{ color: "#1C83E5" }}
                        >
                          {data.price} {data.chain}
                        </div>
                        <font
                          size="2"
                          className="ms-auto secondary-text poppins"
                        >
                          {data.outoff}
                        </font>
                      </div>
                    </div>
                    {collectionhome ? (
                      <button
                        onClick={onPlacebidClick}
                        className="metablog_primary-filled-square-button"
                      >
                        <small>Place a Bid</small>
                      </button>
                    ) : null}
                    {
                    myprofile && data.profile_button === "Put On Sale" ?
        
                        <MyProfileNfts
                          setNftsImg={setNftsImg}
                          playSound={playSound}
                          data={data}
                          setShow={setShow}
                          putonsale="putonsale"
                        />
                       : null || 
                       myprofile && data.profile_button === "On Sale" ?
                        <MyProfileNfts
                          setNftsImg={setNftsImg}
                          playSound={playSound}
                          data={data}
                          setShow={setShow}
                        /> : null
                     }

                    {nftdetailspage ? (
                      <NftDetailsButtons
                        setNftsImg={setNftsImg}
                        playSound={playSound}
                        data={data}
                        setShow={setShow}
                      />
                    ) : null}
                  </Stack>
                </div>
              </Fade>
            </Col>
          ))}
        </Row>
        <Zoom bottom duration={2000}>
          <div className="d-flex justify-content-center">
            <button
              onClick={handleShowMoreCards}
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
