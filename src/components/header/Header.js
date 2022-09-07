import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectFailed, connectWallet } from "../../redux/WalletAction";
import "./Header.css";
import useWindowDimensions from "../../helpers/useWindowDimensions";
//other files
import {
  Container,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  Stack,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RiArrowDownSLine } from "react-icons/ri";

import ConenctWallet from "../connectwallet/index.js";
import useSound from "use-sound";
import { Box, Modal } from "@mui/material";
import buttonSound from "../../assets/audio/button.wav";

import {
  artAction,
  buildingAction,
  metapetsAction,
  miscellaneousAction,
  virtualrealestateAction,
  wearablesAction,
} from "../../redux/TabAction";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLogout, AiOutlinePlus } from "react-icons/ai";
import { postMethod } from "../../helpers/API&Helpers";
import ClaimxdcModal from "../claimxdcModal";
const metablog_logo = require("../../assets/metablog_logo.png").default;
const userlogo = require("../../assets/profile/profilepic.png").default;

const Header = () => {
  const [openWallet, setOpenWallet] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [amount1,setamount]=useState(0);
  const [xdcToken,setXdcToken]=useState(0);
  const [claimmodal,setclaimmodal] = useState(false);



  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wallet = useSelector((state) => state.WalletConnect);
  const { XDC_AirDrop,address,web3 } = wallet;
  const { width } = useWindowDimensions();
  const connect = () => {
    setExpanded(false);
    setOpenWallet(true);
    playSound();
    dispatch(connectWallet());
  };

  const errorDiv = () => {
    return <p>Wallet Disconnected!</p>;
  };
  const disconnect = () => {
    const { web3Modal } = wallet;
    web3Modal.clearCachedProvider();
    dispatch(connectFailed(errorDiv()));
    setExpanded(false);
    playSound();
  };
  const [playSound] = useSound(buttonSound);

  
  const adminDropClick = () => {
    if (adminDropdown == false) {
      setAdminDropdown(true);
    } else {
      setAdminDropdown(false);
    }
  };

  const depositXDC= async ()=>{
          const Amount=  web3.utils.toWei(xdcToken,"ether");   
          console.log("Amount",Amount)
        var depositXDC = await XDC_AirDrop.methods.deposit().send({from:address, value:Amount});
        console.log("desposit",depositXDC)

  };

  const AvailableBalance= async ()=>{
    console.log("XDC_",XDC_AirDrop)
    try{
      var  AvailableAmount= await XDC_AirDrop.methods.AvailableXDC().call();
      AvailableAmount= web3.utils.fromWei(AvailableAmount, "ether");
      setamount(AvailableAmount)
      console.log("available",AvailableAmount);}
      catch(error){
        console.log("error",error);
      }
  };

  useEffect(()=>{
    if(wallet.connected){
      AvailableBalance()
    }
  },[wallet.connected])

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    border: "none !important",
    boxShadow: 2,
    p: 2,
    borderRadius: "1em",
  };
  const[open,setOpen]=useState(false)
  const handleOpen=()=>{
setOpen(true)
  }
  const handleClose=()=>{
    setOpen(false)
  }
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="header_container"
        expanded={expanded}
      >
        <Container fluid>
          <Link className="nav-link" to={"/"}>
            <img height={50} src={metablog_logo} alt="metablog" />
          </Link>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="header_collapse_navbar"
          >
            {width > 576 && (
              <Nav className="">
                <div className="header_search">
                  <FiSearch />{" "}
                  <input
                    className="header_search-input"
                    type="text"
                    placeholder="Search"
                  />
                </div>
              </Nav>
            )}

            <Nav className="ms-auto metabloq_header-menu">
              <Link
                className="nav-link"
                to={"/"}
                onClick={() => setExpanded(false)}
              >
                Home
              </Link>
              <NavDropdown
                title={
                  <span>
                    New Items <RiArrowDownSLine color="#007bff" />{" "}
                  </span>
                }
                disabled={!wallet.connected ? true : false}
                id="basic-nav-dropdown"
                className="nav-link"
              >
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("createcollection");
                  }}
                >
                  Collection
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    navigate("createnft");
                    setExpanded(false);
                  }}
                >
                  NFT
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title={
                  <span>
                    Collections <RiArrowDownSLine color="#007bff" />{" "}
                  </span>
                }
                id="basic-nav-dropdown"
                className="nav-link"
              >
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("collections");
                    dispatch(artAction());
                  }}
                >
                  Art
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("collections");
                    dispatch(buildingAction());
                  }}
                >
                  Land
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("collections");
                    dispatch(virtualrealestateAction());
                  }}
                >
                  Virtual Real Estate
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("collections");
                    dispatch(metapetsAction());
                  }}
                >
                  Meta Pets
                </NavDropdown.Item>
               
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("collections");
                    dispatch(wearablesAction());
                  }}
                >
                  Wearables
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("collections");
                    dispatch(miscellaneousAction());
                  }}
                >
                  Miscellaneous
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title={
                  <span>
                    Stats <RiArrowDownSLine color="#007bff" />{" "}
                  </span>
                }
                id="basic-nav-dropdown"
                className="nav-link"
              >
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("activity");
                  }}
                >
                  Activity
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false);
                    navigate("ranking");
                  }}
                >
                  Ranking
                </NavDropdown.Item>
              </NavDropdown>
              <Link
                className="nav-link"
                to={"login"}
                onClick={() => setExpanded(false)}
              >
                KYC
              </Link>
              <Link
                className="nav-link"
                to={"#"}
                onClick={() => setExpanded(false)}
              >
                About Us
              </Link>
              <Link
                className="nav-link"
                to={"#"}
                onClick={() => setclaimmodal(true)}
              >
                claim xdc
              </Link>
            </Nav>

            <Nav className="ms-auto">
              {/* for connect */}
              {!wallet.connected && width > 600 ? (
                <button
                  className="metablog_gradient-button mx-2"
                  onClick={connect}
                >
                  {" "}
                  <span>Connect Wallet</span>{" "}
                </button>
              ) : null}

              {width < 600 ? (
                !wallet.connected ? (
                  <div className="d-flex justify-content-end">
                    <button
                      style={{ width: "50%" }}
                      className="metablog_gradient-button mb-3"
                      onClick={connect}
                    >
                      {" "}
                      <span>Connect Wallet</span>
                    </button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-end">
                    <button
                      style={{ width: "60%" }}
                      className="metablog_gradient-button mb-3"
                      onClick={connect}
                    >
                      {wallet.address.slice(0, 5) +
                        "..." +
                        wallet.address.slice(-5)}
                    </button>
                  </div>
                )
              ) : null}

              {/* for disconnect */}
              {wallet.connected && width > 600 ? (
                <>
                  <button className="metablog_gradient-button mx-2">
                    <Stack direction="horizontal" gap={4}>
                      <FaUserCircle size={18} color="gray" />
                      <span onClick={disconnect}>
                        {wallet.address.slice(0, 5) +
                          "..." +
                          wallet.address.slice(-5)}
                      </span>

                      <IoIosArrowDown
                        onClick={adminDropClick}
                        size={15}
                        color="#1a69a4"
                      />
                    </Stack>
                  </button>
                  {adminDropdown ? (
                    <div className="admin-dropdown">
                      <div
                        onClick={() => {
                          setAdminDropdown(false);
                        }}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>XDC Balance  {amount1}</span>
                        <AiOutlinePlus
                          color="#1a69a4"
                          size={20}
                          onClick={() =>handleOpen() }
                        />
                      </div>
                      <hr
                        style={{
                          borderBottom: ".5px solid lightgray",
                          margin: ".5em 0",
                        }}
                      />
                      <div
                        onClick={() => {
                          navigate("xdcairdrop");
                          setAdminDropdown(false);
                        }}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>XDC AirDrop</span>
                        <AiOutlinePlus color="#1a69a4" size={20} />
                      </div>
                      <hr
                        style={{
                          borderBottom: ".5px solid lightgray",
                          margin: ".5em 0",
                        }}
                      />
                      <div
                        onClick={() => {
                          navigate("nftairdrop");
                          setAdminDropdown(false);
                        }}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>NFT AirDrop</span>
                        <AiOutlinePlus color="#1a69a4" size={20} />
                      </div>
                      <hr
                        style={{
                          borderBottom: ".5px solid lightgray",
                          margin: ".5em 0",
                        }}
                      />
                      <div
                        onClick={() => {
                          navigate("landairdrop");
                          setAdminDropdown(false);
                        }}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>Land AirDrop</span>
                        <AiOutlinePlus color="#1a69a4" size={20} />
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              {width < 576 ? (
                <div className="d-flex justify-content-end">
                  {!localStorage.getItem("UserToken") ? (
                    <button
                      onClick={() => {
                        navigate("signin");
                        setExpanded(false);
                        localStorage.setItem("@loggedin", "logged");
                        playSound();
                      }}
                      style={{ width: "40%" }}
                      className="metablog_primary-button"
                    >
                      <span>Log in</span>
                    </button>
                  ) : (
                    <div className="d-flex ">
                      <FaUserCircle />
                      <AiOutlineLogout />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {!localStorage.getItem("UserToken") ? (
                    <button
                      onClick={() => {
                        navigate("signin");
                        setExpanded(false);
                        playSound();
                      }}
                      className="metablog_primary-button mx-2"
                    >
                      {" "}
                      <span>Log in</span>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              )}
              <div className="myprofile_userlogo d-flex">
                      <Image
                        fluid
                        src={userlogo}
                        height={40}
                        width={40}
                        style={{ objectFit: "cover", borderRadius: "100px" }}
                        onClick={() => navigate("collectors")}
                      />
                </div>
            </Nav>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Stack gap={3}>
                  <h5>Deposit XDC Tokens</h5>

                  <input
                    type="text"
                    className="metabloq_comments-textarea"
                    value={xdcToken}
                    onChange={(e) => setXdcToken(e.target.value)}
                  />

                  <button
                    onClick={depositXDC}
                    className="nftcollection_mobile-category"
                  >
                    <small>Deposit XDC</small>
                  </button>
                </Stack>
              </Box>
            </Modal>

          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ConenctWallet openWallet={openWallet} setOpenWallet={setOpenWallet} />
      <ClaimxdcModal claimmodal={claimmodal} setclaimmodal={setclaimmodal}/>
    </>
  );
};

export default Header;
