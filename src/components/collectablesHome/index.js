import React, { useState, useEffect } from "react";
import { Col, Image, Row, Stack, Tab, Tabs } from "react-bootstrap";
import "./Styles.css";
import { FiFilter } from "react-icons/fi";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { RiUploadCloudFill } from "react-icons/ri";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import NFTDetailsList from "../nftdetails/NFTDetailsList";
import Activity from "../activity";
import { Drawer } from "@mui/material";
import WebFilter from "../SmallComponents/WebFilter";
import Fade from "react-reveal/Fade";
import MobileFilterBtn from "../SmallComponents/MobileFilterBtn";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postMethod, ReactS3Client3, ReactS3Client1, FormatDate1 } from "../../helpers/API&Helpers";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import Bounce from "react-reveal/Bounce";
const Loader = require("../../assets/loading.gif").default
const preimg = require("../../assets/nfts/1.png").default

function CollectablesHome() {
  const { state } = useLocation();
  const [playSound] = useSound(buttonSound);
  const reduxItems = useSelector((e) => e.WalletConnect);
  const { allCollection ,address} = reduxItems;
  const [showFilter, setShowFilter] = useState(false);
  const [modalShow, modalClose] = useState(false);
  const [Admin, setAdmin] = useState(true);
  const [rangeSlider, setRangeSlider] = useState(10);
  const [collectionNfts, setcollectionNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState([]);
  const [confirmmodal, setConfirmmodal] = React.useState(false);
  const [Loading, setloading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [NFT, setNft] = useState({
    NFT_Name: "",
    NFT_Description: "",
    NFT_Price: '',
    NFT_image: '',
    NFT_animation_url:""
  })
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClick = (type, message) => {
    setType(type);
    setMessage(message);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const { width } = useWindowDimensions();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "none !important",
    boxShadow: 2,
    p: 0,
    borderRadius: "1em",
  };
  const rangeSliderChange = (value) => {
    setRangeSlider(value);
  };
  const horizontalLabels = {
    0: "0.01BLOQS",
    100: "100BLOQS",
  };
  const getCollectionNfts = async () => {
    let url = "getCollectionNfts"
    let params = {
      collection_id: state.id
    }
    let authtoken = "";
    let response = await postMethod({ url, params, authtoken });
    if (response.status) {
      // console.log("NFt", response.result)
      setcollectionNfts(response.result)
    }
  }
  const ImageintoS3 = async (e) => {
    console.log("NFT",NFT)
    setloading(true)
    e.preventDefault();
    var file = e.target.files[0];
    var date = new Date();
    var timeStamp = Date.now();
    let name = file.name;
    let extension = "." + name.split(".").pop();
    try {
      var data;
      console.log("timeStamp", timeStamp)
      let filename = timeStamp + "_nft" + extension;
      console.log("filename", filename)
      // if (extension == "glb") {
      //   setNft({ ...NFT, NFT_animation_url: 'https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/NaN.jpeg' })
      // }
      data = await ReactS3Client3.uploadFile(file, filename);
      if (data?.status === 204) {
        
        if(extension == ".glb"){
          console.log("image", data.location)
          console.log("extension",extension)
          setNft({ ...NFT, NFT_image: 'https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/NaN.jpeg', NFT_animation_url: data.location })
        }else{
          setNft({ ...NFT, NFT_image: data.location })
        }
        // setNft({ ...NFT, NFT_image: data.location })
        setloading(false)
      }
      setloading(false)
    } catch (err) {
      setloading(false)
      console.log("error image uploading", err);
    }
  };
  const createNFT = async () => {
    console.log("NFT_image", NFT.NFT_image)
    if(!Admin){
      handleClick("warning", "Admin Only");
      return;
    }
    if (address == "") {
      handleClick("warning", "Connect your wallet");
      return;
    }
    if (NFT.NFT_image == '') {
      handleClick("warning", "Upload Image")
      return
    }
    if (NFT.NFT_Name == '') {
      handleClick("warning", "Enter NFT Name")
      return
    }
    if (NFT.NFT_Description == '') {
      handleClick("warning", "Enter NFT Description")
      return
    }
    let jsonData = JSON.stringify({
      name: NFT.NFT_Name,
      description: NFT.NFT_Description,
      image: NFT.NFT_image,
    });
    let filename2 = Math.floor(1000 + Math.random() * 9000) + ".json";
    console.log("filename", filename2);
    const data2 = await ReactS3Client1.uploadFile(
      jsonData,
      filename2
    );
    try {
      let url = "createpremintedNft";
      let params = {
        name: NFT.NFT_Name,
        description: NFT.NFT_Description,
        image: NFT.NFT_image,
        animation_url: NFT.NFT_animation_url,
        price: NFT.NFT_Price,
        // background_color: nftDetails.background_color,
        // attributes: JSON.stringify(nftDetails.attributes),
        // token_id: mintid,
        // wallet: address,
        collection_id: state?.data?.collection_id,
        metadata_url: data2.location,
      };
      console.log("params", params)
      let authtoken = "";
      try {
        let response = await postMethod({
          url,
          params,
          authtoken,
        });
        setNft({...NFT,NFT_Name:"",NFT_image:"",NFT_Price:"",NFT_Description:"",NFT_animation_url:""})
        getCollectionNfts()
        modalClose(false)
        console.log("response", response)
      } catch (e) {
        console.log("Error", e)
      }

    } catch (e) {
      console.log("ERROR", e)
    }
  }
  const RemoveNFT = async () => {
    console.log("data", selectedNFT)
    if(!Admin){
      handleClick("warning", "Admin Only");
      return;
    }
    if (address == "") {
      handleClick("warning", "Connect your wallet");
      return;
    }
    if (selectedNFT.nftcollections_status == "premint") {
      let url = "deletepremintedntf";
      let params = {
        id: selectedNFT.nftcollections_id
      }
      let authtoken = ''
      try {
        let response = await postMethod({ url, params, authtoken });
        getCollectionNfts()
        setConfirmmodal(false)
        console.log("response", response)
      } catch (e) {
        console.log("Error", e)
      }
    }
  }
  useEffect(() => {
    console.log("state", state)
    getCollectionNfts()
  }, [])
  return (
    <div className="metabloq_container">
      <Fade bottom>
        <div className="collections_home-wrapper">
          <div className="collections_home-banner">
            <Image fluid src={state?.data?.collection_banner_image} style={{ height: "150px", borderRadius: "1em 1em 0 0" }} className="responsive-img" />
          </div>
          <div className="px-sm-3 h-100 collection_logo-preview d-flex align-items-end">
            <Image
              fluid
              src={state?.data?.collection_logo_image}
              alt="profile"
              height={width > 600 ? "200" : "150"}
              width={width > 600 ? "200" : "150"}
              style={{
                borderRadius: "1em",
                border: "5px solid white",
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              }}
            />
            <div className="mx-3">
              <h2>{state?.data?.collection_name}</h2>
              <span>created by {state?.data?.user_name? state?.data?.user_name : state?.data?.collection_wallet.slice(0,5)+"..."+state?.data?.collection_wallet.slice(-5) } {state?.data?.collection_id}</span>
            </div>
          </div>
          <div className="d-flex justify-content-start align-items-center h-100 mb-sm-3">
            {/* <Stack gap={width > 600 ? "5" : "2"} direction="horizontal">
              <div className="d-flex flex-column ">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">9.4k</span>
                    <small>Items</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">9.4k</h3>
                    <span>Items</span>
                  </>
                )}
              </div>
              <div className="d-flex flex-column ">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">5.7k</span>
                    <small>Owners</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">5.7k</h3>
                    <span>Owners</span>
                  </>
                )}
              </div>

              <div className="d-flex flex-column ">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">8.9k</span>
                    <small>Total volume</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">8.9k</h3>
                    <span>Total volume</span>
                  </>
                )}
              </div>
              <div className="d-flex flex-column">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">1.85</span>
                    <small>Floor price</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">1.85</h3>
                    <span>Floor price</span>
                  </>
                )}
              </div>
            </Stack> */}
          </div>
          {state?.data?.collection_ispreminted &&
            <>
                <div className="ranking_table">
                  <Row className="ranking_table-header lufga-bold d-flex justify-content-between align-items-center">
                    <Col className="text-center">NFT Name</Col>
                    <Col className="text-center">Description</Col>
                    <Col className="text-center">Price</Col>
                    <Col className="text-center">Status</Col>
                    <Col className="text-center">Date </Col>
                    <Col className="text-center">Action </Col>
                  </Row>
                  <br />
                  {collectionNfts?.length > 0 && collectionNfts.map((data) => (
                    <>
                      <Row className="ranking_table-body d-flex justify-content-between align-items-center">
                        <Col className="text-center">
                            <small>{data.nftcollections_name}</small>
                        </Col>
                        <Col className="text-center">
                            <small>{data.nftcollections_description}</small>
                        </Col>
                        <Col className="text-center">
                            <small>{data.nftcollections_price}</small>
                        </Col>
                        <Col className="text-center">
                          <small>{data.nftcollections_status}</small>
                        </Col>
                        <Col className="text-center">
                          <small>{FormatDate1(data.nftcollections_createdat)}</small>
                        </Col>
                        <Col className="d-flex justify-content-center">
                          {
                            data.nftcollections_status == "premint" &&
                            <button className="metablog_primary-filled-square-button py-1 px-4" onClick={()=> {playSound();setSelectedNFT(data) ;setConfirmmodal(true)}} >
                              <span>Remove</span>
                            </button>
                          }
                        </Col>

                      </Row>
                      <hr style={{ backgroundColor: "lightgray" }} />
                    </>
                  ))}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                   onClick={() => { playSound();modalClose(true) }}
                    className="metablog_primary-filled-button">
                    <span>Add NFT</span>
                  </button>
                </div>
            </>
          }
        </div>
      </Fade>
      <br />
      <h2>{state?.data?.collection_category}</h2>
      {width < 600 ? (
        <>
          <MobileFilterBtn />
          <div className="nftdetails_cards-tabs">
            {/* <Tabs
              defaultActiveKey="default"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="default" title="Items">
                <NFTDetailsList collectionhome="collectionhome" collectionNfts={collectionNfts} />
              </Tab>
              <Tab eventKey="Activity" title="Activity">
                <Activity />
              </Tab>
              {width > 600 ? (
                <Tab
                  className="ms-auto"
                  title={
                    <div
                      onClick={() => {
                        setShowFilter(true);
                        playSound();
                      }}
                      className="nftcollection_filter-div-gradient"
                    >
                      <small className="d-flex align-items-center">
                        Filter & Sort <FiFilter />
                      </small>
                    </div>
                  }
                ></Tab>
              ) : null}
            </Tabs> */}
            <NFTDetailsList collectionhome="collectionhome" collectionNfts={collectionNfts} />
            <Drawer
              anchor="right"
              open={showFilter}
              onClose={() => setShowFilter(false)}
              style={{ width: "30% !important" }}
              PaperProps={{
                sx: { width: "60%" },
                style: { width: "25%" },
              }}
            >
              <WebFilter
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                rangeSlider={rangeSlider}
                rangeSliderChange={rangeSliderChange}
                horizontalLabels={horizontalLabels}
                collectionhome="collectionhome"
              />
            </Drawer>
          </div>
        </>
      ) : (
        <div className="ms-auto nftdetails_cards-tabs">
          {/* <Tabs
            defaultActiveKey="default"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="default" title="Items">
              <NFTDetailsList collectionhome="collectionhome" collectionNfts={collectionNfts} data={state?.data} type={state?.type} />
            </Tab>
            <Tab eventKey="Activity" title="Activity">
              <Activity collectionhome="collectionhome" />
            </Tab>
            <Tab
              className="ms-auto"
              title={
                <div
                  onClick={() => {
                    setShowFilter(true);
                    playSound();
                  }}
                  className="nftcollection_filter-div-gradient"
                >
                  <small className="d-flex align-items-center">
                    Filter & Sort <FiFilter />
                  </small>
                </div>
              }
            ></Tab>
          </Tabs> */}
           <NFTDetailsList collectionhome="collectionhome" collectionNfts={collectionNfts} data={state?.data} type={state?.type} />
          <Drawer
            anchor="right"
            open={showFilter}
            onClose={() => setShowFilter(false)}
            style={{ width: "30% !important" }}
            PaperProps={{
              sx: { width: "60%" },
              style: { width: "25%" },
            }}
          >
            <WebFilter
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              rangeSlider={rangeSlider}
              rangeSliderChange={rangeSliderChange}
              horizontalLabels={horizontalLabels}
              collectionhome="collectionhome"
            />
          </Drawer>
        </div>
      )}
      <Modal
        open={modalShow}
        onClose={modalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ borderRadius: "1em" }}>
            <Stack gap={3}>
              <div
                style={{
                  background:
                    "linear-gradient(90deg, #6DC6FE 0%, #0295FA 100%)",
                  borderRadius: "1em 1em 0 0 ",
                }}
                className="d-flex justify-content-between align-items-center py-4 px-3"
              >
                <h3 className="font-weight-bold m-0 text-light">Add NFT</h3>
               
                <small
                  onClick={modalClose}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  X
                </small>
              </div>
              <div className="px-5">
                <Row>
                  <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                      <Stack gap={4}>
                        <div>
                          <div className="bold">NFT Name</div>
                          <input
                            type="text"
                            placeholder="Enter campaing name"
                            className="createitem_input"
                            // value={title}
                            onChange={(e) => {
                              setNft({...NFT,NFT_Name:e.target.value})
                            }}
                          />
                        </div>
                       
                      </Stack>
                  </Col>
                  <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                      <Stack gap={4}>
                      <div>
                          <div className="bold">XDC Price</div>
                          <input
                            type="number"
                            placeholder="0"
                            className="createitem_input"
                            onChange={(e) => {
                              setNft({...NFT,NFT_Price:e.target.value})
                            }}
                          />
                        </div>
                      </Stack>
                  </Col>

                  <Col xxl={12} xl={12} lg={12} sm={12} xs={12} className="mb-6">
                      <Stack gap={3}>
                        <div>
                          <div className="bold">Description</div>
                          <input
                            type="text"
                            placeholder="e.g"
                            className="createitem_input"
                            onChange={(e) => {
                              setNft({...NFT,NFT_Description:e.target.value})
                            }}
                          />
                        </div>
                      </Stack>
                  </Col>
                </Row>
              </div>
              <div className="py-2 createitem_uploadbox text-center h-100 mx-5">
                <small className="bold">Upload Files</small>

                <br />
                <small>JPG, PNG, GIF, WEBP,GLB, or MP4. MAX 200mb</small>
                <br />
                <label class="createitem_upload-button">
                  <RiUploadCloudFill color="white" /> <small>Upload</small>
                  {/* {otherFormats == null ? "Upload" : "Upload Thumpnail"} */}
                  <input
                    type="file"
                    // accept={
                    //   otherFormats == null
                    //     ? ""
                    //     : "image/png, image/gif, image/jpeg"
                    // }
                    style={{ display: "none" }}
                    onChange={(e)=>ImageintoS3(e)}
                  />
                  {
                    Loading?
                    <img src={Loader} style={{width:"25px",height:"25px"}} />
                    :
                    null
                  }
                 
                </label>
                {
                    NFT.NFT_image?
                    <img src={NFT.NFT_image} style={{width:"25px",height:"25px"}} />
                    :
                    null
                  }
                <br />
                {/* <small className="bold">{filename}</small> */}
              </div>
              {/* <div className="py-2 text-center h-100 mx-5">
                <br />
                <small>Add XDC</small>
                <br />
                <br />
               
              </div> */}
              <Bounce>
                <div className="d-flex justify-content-center px-5 py-3">
                  <button
                    onClick={() => {
                      playSound();
                      createNFT()
                      // pressingSubmit();
                    }}
                    className="metablog_primary-filled-button"
                  >
                    <span>Submit</span>
                  </button>
                </div>
              </Bounce>
            </Stack>
          </div>
        </Box>
      </Modal>

      <Modal
        open={confirmmodal}
        // onClose={setConfirmmodal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >
        <Box sx={style}>
          <div style={{ borderRadius: "1em" }}>
            <div
              style={{
                background:
                  "linear-gradient(90deg, #6DC6FE 0%, #0295FA 100%)",
                borderRadius: "1em 1em 0 0 ",
              }}
              className="d-flex justify-content-between align-items-center py-4 px-3"
            >
              <h3 className="font-weight-bold m-0 text-light">Confirmation</h3>
              <small
                onClick={() => setConfirmmodal(false)}
                style={{ cursor: "pointer", color: "white" }}
              >
                X
              </small>
            </div>
            <div className="py-2 text-center h-100 mx-5">
              <h4>Are you sure you want to Remove NFT ?</h4><br />
            </div>

            <div className="d-flex justify-content-center px-5 py-3">
              <button
                onClick={() => { playSound(); RemoveNFT(); }}
                className="metablog_primary-filled-button" >
                <span>Confirm </span>
              </button>
              <button
                onClick={() => setConfirmmodal(false)}
                className="metablog_primary-filled-button"
              >
                <span>Cancel </span>
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CollectablesHome;
