import React, { useState } from "react";
import { LiveAuctionData } from "./LiveAuctionData";
import { Image, Row, Stack } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import "swiper/swiper-bundle.min.css";
import "./Styles.css";
import { Pagination } from "swiper";
import useWindowDimensions from '../../helpers/useWindowDimensions';
import Bounce from 'react-reveal/Bounce';
import useSound from 'use-sound';
import buttonSound from '../../assets/audio/button.wav';

import PlacebidModal from "../placebidModal";
import {useNavigate} from 'react-router-dom'
import { useSelector } from "react-redux";
import CountdownTimer from "../timer/CountdownTimer";


function LiveAuctionCards() {
  const {width} = useWindowDimensions();
  const [playSound] = useSound(buttonSound);
  const navigate = useNavigate();

  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { allCollection } = reduxItems;

  const placeModalClose = () =>{
    setPlaceModalOpen(false);
  } 

  const onPlacebidClick = ()=>{
    playSound();
    setPlaceModalOpen(true);
  }
  return (
    <>
      <Row>
        <Swiper
          slidesPerView={width < 768 ? 2 : 4}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]} 
          className="liveauction_myswiper " 
        >
          {allCollection == [] ? 
            allCollection.filter(data => data.nftcollections_status == "auction").map((data,i) => (
            <SwiperSlide>
              <Bounce top>
              <div key={i} className="liveauction_cards metablog_cards img-zoom-animation h-100">
                <Stack gap={2}>
                  <div className="d-flex justify-content-between">
                    <Image
                      src={data.icon}
                      height={20}
                      width={20}
                      alt="circle"
                    />
                    {
                      width < 576 ? 
                      <span className="mx-2">{data.nftcollections_wallet.slice(0, 8) + (data.nftcollections_wallet.length > 8 ? ".." : "")}</span> :
                      <span className="mx-2">{data.nftcollections_wallet.slice(0, 15) + (data.nftcollections_wallet.length > 15 ? ".." : "")}</span>
                    }
                  </div>
                  <div className="liveauction_cards-imgwithtime my-2">
                    <Image fluid src={data.avatar} alt="square" className="metabloq_img img-zoom-animation"
                    onClick={() => navigate(`${data.id}`)}/>
                    {data.nftcollections_auction_time && (
                    <div>
                      <CountdownTimer
                        targetDate={parseInt(data.nftcollections_auction_time)}
                      />
                    </div>
                  )}
                  </div>
                  <div>
                    {
                      width < 576 ? 
                      <div>{data.nftcollections_wallet.slice(0, 12) + (data.nftcollections_wallet > 12 ? ".." : "")}</div> :
                      <div>{data.nftcollections_wallet.slice(0, 20) + (data.nftcollections_wallet > 20 ? ".." : "")}</div>
                    }
                    
                    <div
                      className="font-weight-bold"
                      style={{ color: "#1C83E5" }}
                    >
                       {data.nftcollections_price} BLOQS
                    </div>
                  </div>
                  <button onClick={onPlacebidClick} className="metablog_primary-filled-square-button">
                    <small>Place Bid</small>
                  </button>

                </Stack>
              </div>
              </Bounce>
            </SwiperSlide>
          )) : <p className="text-center">No Auctions NFTs</p>}
        </Swiper>
      </Row>
      <PlacebidModal 
        placeModalOpen={placeModalOpen}
        setPlaceModalOpen={setPlaceModalOpen}
        placeModalClose = {placeModalClose}
        playSound={playSound}
      />
    </>
  );
}

export default LiveAuctionCards;
