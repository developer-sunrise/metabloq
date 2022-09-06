import React, { useEffect, useState } from 'react'
import { LiveAuctionData } from '../../components/liveauctions/LiveAuctionData';
import useSound from 'use-sound';
import buttonSound from '../../assets/audio/button.wav';
import useWindowDimensions from '../../helpers/useWindowDimensions';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import { Col, Image, Row, Stack } from 'react-bootstrap'
import PlacebidModal from '../placebidModal';
import { useNavigate } from 'react-router-dom';


const cardsPerPage = 4;
let arrayForHoldingCards = [];

function AllLiveAuction(props) {
    let {setPlaceModalOpen} = props;
    const navigate = useNavigate()
    const [cardsToShow, setCardsToShow] = useState([]);
    const [next, setNext] = useState(4);
    const {width} = useWindowDimensions();

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
        playSound()
      };
      const [playSound] = useSound(buttonSound)

      const placebidBtnClick =()=>{
        playSound()
          setPlaceModalOpen(true);
      }
  return (
      <>
      <div>
    <Stack gap={3}>
        <Row>
            {
                cardsToShow.map((data,i)=>(
                    <Col xxl={3} xl={3} lg={3} md={4} sm={6} xs={6} className='mb-3' key={i}>
                        <Fade bottom>
                         <div className="liveauction_cards metablog_cards h-100" key={data.id}>
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
                                <span className="mx-2">{data.avatar_name.slice(0, 8) + (data.avatar_name.length > 8 ? ".." : "")}</span> :
                                <span className="mx-2">{data.avatar_name.slice(0, 15) + (data.avatar_name.length > 15 ? ".." : "")}</span>
                                }
                                
                                <div className="ms-auto">
                                <span className="font-weight-bold">...</span>
                                </div>
                            </div>
                            <div className="liveauction_cards-imgwithtime my-2">
                                <Image fluid src={data.avatar} alt="square" className="metabloq_img img-zoom-animation"
                                onClick={() => navigate(`${data.id}`)}/>
                                <div className="liveauction_cards-timebox d-flex justify-content-center align-items-center">
                                <Image
                                    fluid
                                    src={data.time_icon}
                                    alt="time"
                                    height={15}
                                    width={15}
                                />
                                <small className="mx-2">{data.time}</small>
                                </div>
                            </div>
                            <div>
                                {
                                width < 576 ? 
                                <div>{data.name.slice(0, 12) + (data.name.length > 12 ? ".." : "")}</div> :
                                <div>{data.name.slice(0, 20) + (data.name.length > 20 ? ".." : "")}</div>
                                }
                            </div>
                            <Row className='d-flex justify-content-center align-items-center'>
                                <Col>  
                                    <font size="1">Current Bid</font>                               
                                    <div
                                    className="font-weight-bold"
                                    style={{ color: "#1C83E5" }}>
                                    {data.price} {data.chain}
                                    </div>
                                </Col>
                                <Col md="auto" lg="auto" xxl="auto" xl="auto">
                                <button onClick={placebidBtnClick} className="metablog_primary-filled-square-button">
                                    <small>{data.button_name}</small>
                                </button>
                                </Col>
                            </Row>
                            </Stack>
                        </div>
                        </Fade>
                    </Col>
                ))
            }
        </Row>
            <Zoom bottom duration={2000}>
            <div className='d-flex justify-content-center'>
                <button onClick={handleShowMoreCards} className='mr-2 nftcollection_mobile-category'>
                        <font size="2">Load More</font>
                </button>
            </div>
            </Zoom>
        </Stack>
        
        </div>
        <PlacebidModal {...props} playSound={playSound}/>
        </>
  )
}

export default AllLiveAuction