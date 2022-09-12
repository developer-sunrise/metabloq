import React, { useState, useEffect } from "react";
import { Row, Col, Stack } from "react-bootstrap";
import Modal from "@mui/material/Modal";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { RiUploadCloudFill } from "react-icons/ri";
import Bounce from "react-reveal/Bounce";
import { AiTwotoneHeart } from "react-icons/ai";
import { Box } from "@mui/system";
import * as XLSX from "xlsx/xlsx.mjs";
import { Snackbar } from "@mui/material";
import {BsDownload} from "react-icons/bs";
import {
  ReactS3Client4,
  ReactS3Client2,
  postMethod,
  ImageLoad,
  FormatDate1,
  Slicer,
} from "../../helpers/API&Helpers/index";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const empty = require("../../assets/empty.png");

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

function XdcAirdrop() {
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address ,XDC_AirDrop,web3,xdcToken } = reduxItems;
  const [modalShow, setModalShow] = useState(false);
  const [confirmmodal, setConfirmmodal] = useState(false);
  const [playSound] = useSound(buttonSound);
  const [title, setTitle] = useState("");
  const [bannerImg, setBannerImg] = useState(empty);
  const [featuredImg, setFeaturedImg] = useState(empty);
  const [campaignname, setCampaignname] = useState(false);
  const [filename,setFilename]=useState('')
  const [airdropDetails, setAirdropDetails] = useState({
    campaign_name: "",
    xdc_wallet: "",
    no_of_wallet: "",
    total_xdc: "",
    xdcairdrop_json: [],
  });
  const [total_xdc, settotal_xdc] = useState(0)
  const [no_of_wallet, setno_of_wallet] = useState(0)
  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
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
  const bannerImageChange = (e) => {
    var file = e.target.files[0];
    const reader = new FileReader();
    reader.fileName = file.name // file came from a input file element. file = el.files[0];
    let newData;
    reader.onload = async (e) => {
      console.log("file",e.target.fileName);
      setFilename(e.target.fileName)
      // console.log("reader",e)
      const data1 = e.target.result;
      const workbook = XLSX.read(data1, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log("json", json)
      if (json) {
        var amt = 0
        json.map((data) => {
          amt += data.xdc
        })
        console.log("amt", amt)
        settotal_xdc(amt); setno_of_wallet(json.length)
        setAirdropDetails({ ...airdropDetails, total_xdc: amt });
        setAirdropDetails({ ...airdropDetails, no_of_wallet: json.length });
      }
      console.log("fgdnewDatahsk", json.length);
      setAirdropDetails({ ...airdropDetails, xdcairdrop_json: json });

    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };

  const modalClose = () => {
    setModalShow(false);
  };
  const handlecampaignname = (e) => {
    if (campaigns.length != 0) {
      var data = campaigns.filter(data => {
        return ((data.xdcairdrop_campaign_name).toLowerCase()).match((e.target.value).toLowerCase())
      });
      if (data.length != 0) {
        console.log("data", data)
        setCampaignname(true)
        handleClick("warning", "campaign name");
      } else {
        setCampaignname(false)
      }
    }
    setAirdropDetails({
      ...airdropDetails,
      campaign_name: e.target.value,
    });
  }
  const pressingSubmit = async () => {
    setConfirmmodal(false)
    // let address = "0xb8947443e494Ee062b6772C53a7734188c699Be9";
    if (campaignname) {
      handleClick("warning", "try otherCampaign name");
      return;
    }
    if (!address) {
      handleClick("warning", "Connect your wallet");
      return;
    } else if (airdropDetails.campaign_name == "") {
      handleClick("warning", "Enter campaign name");
      return;
    } else if (airdropDetails.xdcairdrop_json == []) {
      handleClick("warning", "Upload xdcairdrop excel file");
      return;
    } else {

      let url = "createXdcAirdrop";
      let params = {
        campaign_name: airdropDetails.campaign_name,
        wallet: address,
        xdc_per_wallet: total_xdc,
        xdcairdrop_json: airdropDetails.xdcairdrop_json,
      };
      console.log("params",params)
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("fghjk", response);
      if (response.status) {
        handleClick("success", "AirdropDetails created successfully");
        modalClose();
      } else {
        handleClick("error", "Something went wrong");
      }
    }
  };
  const getXdcAirdrops = async () => {
    if (address != "") {
      let url = "getXdcAirdrops";
      let params = {
        wallet: address,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("fghjk", response);
      if (response.status) {
        setCampaigns(response.result);
      }
    }
  };
  const statusChange = async (item,status) => {
    let url = "xdcAirdropStatus";
    let params = {
      xdcairdrop_id: item,
      status:status
    };
    let authtoken = "";
    let response = await postMethod({ url, params, authtoken });
    if (response.status) {
      getXdcAirdrops();
    }
  };
  useEffect(() => {
    getXdcAirdrops();
  }, [address]);

  const depositXDC= async ()=>{
    if(total_xdc){
      const Amount=  web3.utils.toWei(String(total_xdc),"ether");
      try{
        var depositXDC = await XDC_AirDrop.methods.deposit().send({from:address, value:Amount});
        console.log("desposit",depositXDC)
      }catch(err){
        console.log("ERROR",err)
      }
    }else{
      handleClick("warning", "invalid amount");
    }
};
  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Stack gap={5}>
        <div className="createitempage_createitem">
          <h2 className="bold poppins">XDC AirDrop</h2>
        </div>
        <div className="metabloq_container">
          <Row>
            <Col  className="light-text text-center">
              Campaign name
            </Col>
            {/* <Col xxl={2} xl={2} lg={2} md={2} className="light-text">
              XDC per wallet
            </Col> */}
            <Col  className="light-text text-center">
              No of wallet
            </Col>
            <Col  className="light-text text-center">
              Total XDC
            </Col>
            <Col  className="light-text text-center">
              Date
            </Col>
            <Col className="d-flex justify-content-center">
              <button
                onClick={() => setModalShow(true)}
                className="metablog_primary-filled-button"
              >
                + Add
              </button>
            </Col>
          </Row>
          <br/>
          <Row>
            {campaigns.length > 0 &&
              campaigns.map((data) => (
                <>
                  <Col  className="fw-bold text-center">
                    {data.xdcairdrop_campaign_name}
                  </Col>
                  {/* <Col xxl={2} xl={2} lg={2} md={2} className="fw-bold">
                    {Slicer(data.xdcairdrop_wallet)}
                  </Col> */}
                  <Col  className="fw-bold text-center">
                    {data.xdcairdrop_no_of_wallet}
                  </Col>
                  <Col  className="fw-bold text-center">
                    {data.xdcairdrop_total_xdc}
                  </Col>
                  <Col  className="fw-bold text-center">
                    {FormatDate1(data.xdcairdrop_createdat)}
                  </Col>
                  <Col className="d-flex justify-content-center">
                    {data.xdcairdrop_status ? (
                      <button
                        onClick={() => {
                          statusChange(data.xdcairdrop_id,false);
                        }}
                        className="metablog_primary-filled-button-red"
                      >
                        PAUSE
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          statusChange(data.xdcairdrop_id,true);
                        }}
                        className="metablog_primary-filled-button-green"
                      >
                        UNPAUSE 
                      </button>
                    )}
                  </Col>
                  <hr
                    style={{
                      borderBottom: ".5px solid lightgray",
                      margin: "1em 0",
                    }}
                  />
                </>
              ))}
          </Row>
        </div>
      </Stack>
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
                <h3 className="font-weight-bold m-0 text-light">Add new</h3>
                <button
                  style={{"background":"linear-gradient(102.66deg, #e3e8eb -17.72%, #e8ecf0 80.89%)",color:"#000"}}
                    onClick={() => {
                      playSound();
                      depositXDC()
                    }}
                    className="metablog_primary-filled-button"
                  >
                    <span>Deposit BLOQS</span>
                  </button>
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
                    <Bounce>
                      <Stack gap={4}>
                        <div>
                          <div className="bold">Campaign Name</div>
                          <input
                            type="text"
                            placeholder="Enter campaing name"
                            className="createitem_input"
                            // value={title}
                            onChange={(e) => {
                              handlecampaignname(e)
                            }}
                          />
                        </div>
                        <div>
                          <div className="bold">No of Wallets</div>
                          <input
                            type="number"
                            placeholder="0 Wallet"
                            className="createitem_input"
                            value={no_of_wallet}
                            onChange={(e) => {
                              setAirdropDetails({
                                ...airdropDetails,
                                no_of_wallet: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </Stack>
                    </Bounce>
                  </Col>

                  <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                    <Bounce>
                      <Stack gap={4}>
                        {/* <div>
                          <div className="bold">XDC per wallet</div>
                          <input
                            type="number"
                            placeholder="0 XDC"
                            className="createitem_input"
                            value={airdropDetails.xdc_wallet}
                            onChange={(e) => {
                              setAirdropDetails({
                                ...airdropDetails,
                                xdc_wallet: e.target.value,
                              });
                            }}
                          />
                        </div> */}
                        <div>
                          <div className="bold">Total BLOQS</div>
                          <input
                            type="number"
                            placeholder="0 BLOQS"
                            className="createitem_input"
                            disabled
                            value={
                              total_xdc
                            }
                          // onChange={(e) => {
                          //   setAirdropDetails({
                          //     ...airdropDetails,
                          //     total_xdc: e.target.value,
                          //   });
                          // }}
                          />
                        </div>
                      </Stack>
                    </Bounce>
                  </Col>
                </Row>
              </div>
              <div className="py-2 createitem_uploadbox text-center h-100 mx-5">
                <small className="bold">Upload Files</small>
                
                <br />
                <small>Upload to XSL format only</small>
                <br />
                <label class="createitem_upload-button">
                  <RiUploadCloudFill color="white" /> <small>Upload</small>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    style={{ display: "none" }}
                    onChange={bannerImageChange}
                  />
                </label>
                <br />
                <small className="bold">{filename}</small>
                <br />
                <div className="d-flex align-items-center justify-content-center">
                <a href="https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/1662385993107Logo.xlsx" download>Template</a>&nbsp;
                <BsDownload color="#0d6efd"/>
                </div>
                
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
                      setConfirmmodal(true)
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
                  onClick={()=>setConfirmmodal(false)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  X
                </small>
              </div>
              <div className="py-2 text-center h-100 mx-5">
              <h4>Are you sure you want to create new campaign?</h4><br/>
              </div>
           
          <div className="d-flex justify-content-center px-5 py-3">
                  <button
                  onClick={() => { playSound();   pressingSubmit();  }}
                    className="metablog_primary-filled-button" >
                    <span>Confirm </span>
                  </button>
                  <button
                    onClick={()=>setConfirmmodal(false)}
                    className="metablog_primary-filled-button"
                  >
                    <span>Cancel </span>
                  </button>
                </div>
          </div>
          </Box>
        </Modal>
    </>
  );
}

export default XdcAirdrop;