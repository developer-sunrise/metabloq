import React, { useEffect, useState } from "react";
import { Row, Col, Stack, Image } from "react-bootstrap";
import {
  CollectionsData,
  CollectionsDataDynamic,
} from "../../components/collections/CollectionsData";
import { AiTwotoneHeart } from "react-icons/ai";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const collectionsPerRow = 6;

function CollectorsCollectionCard(props) {
  let { collections, myprofile,pricefilter } = props;
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { allCollection } = reduxItems;
  const [Totalcollections,SetTotalcollections]=useState([])
  const [next, setNext] = useState(collectionsPerRow);
  const handleMoreCollection = () => {
      setNext(next + 3);
    };
  const [playSound] = useSound(buttonSound);
  const navigate = useNavigate();
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
  const sortcollections= ()=>{
    allCollection.map((data,i)=>{
      var totalprice =0
      if(data.price){
        data.price.map((pricedata)=>{
          if(pricedata){
            totalprice += Number(pricedata)
          }else{
            totalprice += 0
          }
        })
      }
      allCollection[i].floorprice=totalprice/Number(data.count)
    })
    var data =allCollection.sort((a,b) => b.collection_id-a.collection_id,0).slice(0, next)
    console.log("allCollection",data)
    SetTotalcollections(data.slice(0, next))
  }

  const floorpricesort =()=>{
    var data =allCollection.sort((a,b) => b.floorprice-a.floorprice,0).slice(0, next)
    SetTotalcollections(data)
  }
  useEffect(()=>{
    if(allCollection.length!=0){
      sortcollections()
    }
  },[allCollection])

  useEffect(()=>{
    console.log("pricefilter",pricefilter)
    if(pricefilter){
      floorpricesort()
    }else{
      sortcollections()
    }
  },[pricefilter])
  return (
    <Stack gap={3}>
      {myprofile ? <h2 className="lufga-bold">My Collections</h2> : null}
      <Row>
        { Totalcollections.map((data,index) => (
          <Col key={index} xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-3">
            <Fade bottom>
              <div
                onClick={() => {
                  if (data.collection_category == "Land") {
                    navigate("citieshome", {
                      state: {
                        id: data.collection_id,
                        type: data.collection_category,
                        data: data,
                      },
                    });
                  } else {
                    navigate("collectionhome", {
                      state: {
                        id: data.collection_id,
                        type: data.collection_category,
                        data: data,
                      },
                    });
                  }
                }}
                className="collections_cards metablog_cards"
              >
                <Stack gap={2}>
                  <Row className="collections_cards-grid">
                        <div style={{ padding: 5,overflow:"hidden" }}>
                          <Image
                            style={{
                              height: "200px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            fluid
                            src={data.collection_banner_image}
                            alt="gridimg1"
                            className="metabloq_img img-zoom-animation"
                          />
                        </div>
                      </Row>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                      <span className="font-weight-bold poppins">
                        {data.collection_name}
                      </span>
                      <small>created by {data.collection_wallet.slice(0,5)+"..."+data.collection_wallet.slice(-5)}</small>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      {/* <AiTwotoneHeart /> */}
                      <div className="d-flex flex-column"> 
                      <span className="font-weight-bold poppins">
                        Floor Price
                      </span>
                      <span className="mx-1 poppins">
                        {formatter.format(calfloorprice(data.price))} BLOQS
                      </span>
                    </div>
                    </div>
                  </div>
                </Stack>
              </div>
            </Fade>
          </Col>
        ))}
      </Row>
      {
        allCollection.length > 0 &&
        <Zoom bottom duration={2000}>
          <div className="d-flex justify-content-center">
            <button
              onClick={handleMoreCollection}
              className="mr-2 nftcollection_mobile-category"
            >
              <font size="2">Load More</font>
            </button>
          </div>
        </Zoom>
      }
    </Stack>
  );
}

export default CollectorsCollectionCard;
