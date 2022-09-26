import React, { useState, useEffect } from "react";
import { Col, Form, Image, Row, Stack, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEye, AiOutlineDelete, AiTwotoneHeart } from "react-icons/ai";
import { MdOutlineSend } from "react-icons/md";
import Select from "react-select";
import NFTDetailsCards from "./NFTDetailsCards";
import Modalbox from "../modalbox/Modalbox";
import CountdownTimer from "../timer/CountdownTimer";
import "./Styles.css";
import Fade from "react-reveal/Fade";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PlacebidModal from "../placebidModal";
import BuynowModal from "../buynowModal";
import WithModel from "../3dModels/withModel";
import Activity from "../activity";
import MakeOfferModal from "../makeoffermodal";
import SalesHistoryChart from "./SalesHistoryChart";
import { Box, Modal } from "@mui/material";
import { FormatDate1, postMethod, Slicer } from "../../helpers/API&Helpers";
import { FiEdit2 } from "react-icons/fi";
import "./Styles.css";
import { useCountdown } from "../timer/useCountdown";
import ActionWallet from "../connectwallet/actionWallet";
import PurchaseBloqsModal from "../purchasebloqs";
const avatar1 = require("../../assets/profilepics/face7.jpg").default
const avatar2 = require("../../assets/profilepics/face8.jpg").default
const avatar3 = require("../../assets/profilepics/face9.jpg").default
const avatar4 = require("../../assets/profilepics/face5.jpg").default
const bloqs = require("../../assets/logo_block.png").default

const urls = process.env.REACT_APP_SCAN_baseuri_HASH;

// const days = [
//   { value: "Last 7 days", label: "Last 7 days" },
//   { value: "Last 14 days", label: "Last 14 days" },
//   { value: "Last 30 days", label: "Last 30 days" },
//   { value: "Last 60 days", label: "Last 60 days" },
//   { value: "Last 90 days", label: "Last 90 days" },
//   { value: "All time", label: "All time" },
// ];

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

const dropdowndays = [
  { id: 1, days: "60 Days" },
  { id: 2, days: "30 Days" },
  { id: 3, days: "14 Days" },
  { id: 4, days: "7 Days" },
  { id: 5, days: "All Time" },
];

function NFTDetails(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const nft = state.data;
  // console.log("nft details =", nft);
  const attributes =
    nft.nftcollections_attributes != "undefined" ? nft.nftcollections_attributes !== ""
      ? JSON.parse(nft.nftcollections_attributes)
      : [] : [];
  const [playSound] = useSound(buttonSound);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { Land, address, NftSingle, Collection, Marketplace, web3, Token,USD } = reduxItems;
  const dispatch = useDispatch();
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [purchasebloqssts, setPurchasebloqs] = useState(false);
  const [makeModalOpen, setMakeModalOpen] = useState(false);
  const [selectedAxis, setSelectedAxis] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [show, setShow] = useState(false);
  const [commentsInput, setCommentsInput] = useState("");
  const [comments, setComments] = useState([]);
  const [editCommentsModal, setEditCommentsModal] = useState(false);
  const [editInput, setEditInput] = useState("");
  const [cmtsIdHolder, setCmtsIdHolder] = useState("");
  const [cmtsTextHolder, setCmtsTextHolder] = useState("");
  const [offerData, setOfferData] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [activityDatas, setActivityDatas] = useState([]);
  const [highestBid, sethighestBid] = useState([]);
  const [salesHistory, setsalesHistory] = useState([])

  //action wallet states
  const [walletOpen, setWalletOpen] = useState(false);
  const [Loading1, setLoading1] = useState(false);
  const [Loading2, setLoading2] = useState(false);
  const [hashValue, sethashValue] = useState("");
  const [BalanceToken, setBalance] = useState(0);

  const placebidClick = () => {
    setPlaceModalOpen(true);
    playSound();
  };
  const placeModalClose = () => {
    setPlaceModalOpen(false);
  };

  // comments functions
  const postComments = async () => {
    try {
      let url = "createComment";
      let params = {
        nft_id: nft.nftcollections_id,
        comments_text: commentsInput,
        wallet: address //nft.nftcollections_wallet,
      };
      let authtoken = "";
      let response = await postMethod({
        url,
        params,
        authtoken,
      });
      if (response.status) {
        setCommentsInput("");
        getComments();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getComments = async () => {
    try {
      let url = "getComment";
      let params = {
        nft_id: nft.nftcollections_id,
      };
      let authtoken = "";
      let response = await postMethod({
        url,
        params,
        authtoken,
      });
      if (response.status) {
        let result = response.result.map((item, index) => {
          return item;
        });
        setComments(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const editCommentsOpen = (id, comments) => {
    setEditCommentsModal(true);
    setCmtsIdHolder(id);
    setCmtsTextHolder(comments);
    setEditInput(comments);
  };

  const saveEditComments = async () => {
    try {
      let url = "editComment";
      let params = {
        comments_id: cmtsIdHolder,
        comments_text: editInput,
      };
      let authtoken = "";
      let response = await postMethod({
        url,
        params,
        authtoken,
      });
      if (response.status) {
        setEditCommentsModal(false);
        getComments();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const deleteComments = async (id) => {
    try {
      let url = "deleteComment";
      let params = {
        comments_id: id,
      };
      let authtoken = "";
      let response = await postMethod({
        url,
        params,
        authtoken,
      });
      if (response.status) {
        getComments();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const buyClick = async () => {
    playSound();
    setBuyModalOpen(true);
  };
  const buyModalClose = () => {
    setBuyModalOpen(false);
  };
  const purchaseModalClose = () => {
    setPurchasebloqs(false);
  };

  const makeOfferClick = () => {
    setMakeModalOpen(true);
    playSound();
  };
  const makeModalClose = () => {
    setMakeModalOpen(false);
  };

  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [state1, setState1] = React.useState({ num: 0 });
  const counter = React.useRef(0);

  const putonSaleClick = async () => {
    setShow(true);
  };

  // React.useEffect(() => {
  //   counter.current += 1;
  //   const timer = setTimeout(() => {
  //     setState1({ num: state1.num + 1 });
  //     setRotation({ x: 0, y: rotation.y + 0.005, z: 0 });
  //   });
  //   return () => clearTimeout(timer);
  // }, [state1]);

  const getdata = async () => {
    const res = await fetch(
      "https://sunrisetechs.s3.ap-southeast-2.amazonaws.com/metabloqs/json/" +
      id +
      ".json"
    );
    const json = await res.json();
    if (json) {
      setJsonData(json);
      setShowModel(true);
    }
  };

  const getMakeOffers = async () => {
    try {
      let url = "getNftOffersAndBidOffers";
      let params = {
        nft_id: nft.nftcollections_token_id,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      if (response.status) {
        setOfferData(response.resultOffers);
        setBidData(response.resultNftBids);
        const result = response.resultNftBids.map((data, i) => {
          return data.offer_bid_amount
        })
        sethighestBid(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const executeOrder = async (signtuple,isCrypto) => {
    try {
      const acceptOffer = await Marketplace.methods
        .executeOrder(signtuple,isCrypto)
        .send({ from: address });
      return acceptOffer;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  const usertokenbalance = async () => {
    try {
      var balance = await Token.methods.balanceOf(address).call();
      balance = web3.utils.fromWei(balance, 'ether')
      console.log("balance", balance)
      setBalance(balance)
    } catch {
      console.log("ERROR")
    }
  }
  const balance = async (address, amtInWei) => {
    try {
      const balance = await Token.methods.balanceOf(address).call();
      console.log("balance", balance)
      if (parseInt(balance) > amtInWei) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
      console.log(e);
    }
  };
  const acceptMakeOffer = async (buyerAddress, amt, token) => {
    let priceInWei = web3.utils.toWei(amt.toString(), "ether");
    if (await balance(buyerAddress, priceInWei)) {
      try {
        setWalletOpen(true);
        setLoading2(true);
        let date = new Date();
        let timestamp = date.getTime();
        let url = "signature";
        let params = {
          seller: address,
          buyer: buyerAddress,
          nftAddress: process.env.REACT_APP_COLLECTION_CONTRACT,
          amount: priceInWei,
          tokenId: token,
          nonce: timestamp,
        };
        let authtoken = "";
        let signresponse = await postMethod({ url, params, authtoken });
        if (signresponse.status) {
          setLoading1(true);
          const accept = await executeOrder(signresponse.signtuple);
          setLoading1(false);
          sethashValue(accept?.hash)
          if (accept) {
            let url = "updateNft";
            let params = {
              nft_id: id,
              type: "transfer",
              wallet: buyerAddress,
            };
            let authtoken = "";
            let response = await postMethod({ url, params, authtoken });
            if (response.status) {
              let url = "deleteOffer";
              let params = {
                offer_bid_nft_token_id: token
              };
              let authtoken = "";
              let response = await postMethod({ url, params, authtoken });
            }
          }
          try {
            let url = "createActivities";
            let params = {
              wallet: address,
              hash: accept?.transactionHash,
              from: address,
              to: buyerAddress,
              type: "tranfer",
              price: amt,
              quantity: 1,
              collection: nft.nftcollections_id,
              nft: nft.nftcollections_token_id,
              transfer: "transfered",
            };
            let authtoken = "";
            let response = await postMethod({
              url,
              params,
              authtoken,
            })
          } catch (e) {
            console.log(e)
          }
          setLoading2(false);
        }
      } catch (e) {
        console.log(e);
        setWalletOpen(false);
        setLoading1(false);
        setLoading1(false);
      }
      setWalletOpen(false)
    } else {
      alert("check balance");
      setWalletOpen(false);
      setLoading1(false);
      setLoading1(false);
    }
  };
  const rejectMakeOffer = async (id, token) => {
    try {
      let url = "rejectOffer";
      let params = {
        offer_bid_id: id,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      if (response.status) {
        let url = "deleteOffer";
        let params = {
          offer_bid_nft_token_id: token
        };
        let authtoken = "";
        let response = await postMethod({ url, params, authtoken });
        getMakeOffers();
      }
    } catch (e) {
      console.log(e)
    }
  };
  const buy = async (isCrypto) => {
    let priceInWei = web3.utils.toWei(nft.nftcollections_price.toString(), "ether");
    console.log("priceInWei",priceInWei)
    var checkblc = await balance(address, priceInWei)
    console.log("checkblc", checkblc)
    console.log("isCrypto", isCrypto)
    if(!checkblc && isCrypto){
      alert()
      return
    }
    // if (!checkblc && !isCrypto) {
      setWalletOpen(true);
      try {
        setLoading1(true)
        const allowance = await Token.methods.allowance(address,process.env.REACT_APP_Marketplace_CONTRACT).call()
        console.log("allowance",allowance)
        if(allowance<priceInWei){
          const balance = await Token.methods.approve(process.env.REACT_APP_Marketplace_CONTRACT, '100000000000000000000000').send({ from: address });
        }
       
        try {
          setLoading2(true);
          let date = new Date();
          let timestamp = date.getTime();
          let url = "signature";
          let params = {
            seller: nft.nftcollections_wallet,
            buyer: address,
            nftAddress: process.env.REACT_APP_COLLECTION_CONTRACT,
            amount: priceInWei,
            tokenId: nft.nftcollections_token_id,
            nonce: timestamp,
          };
          let authtoken = "";
          let signresponse = await postMethod({ url, params, authtoken });
          if (signresponse.status) {
            console.log("signresponse.signtuple",signresponse.signtuple)
            console.log("signresponse.signtuple",signresponse.signtuple,isCrypto)
            const accept = await executeOrder(signresponse.signtuple,isCrypto);
            sethashValue(accept?.hash);
            setLoading1(false);
            if (accept) {
              let url = "updateNft";
              let params = {
                nft_id: id,
                type: "transfer",
                wallet: address,
              };
              let authtoken = "";
              let response = await postMethod({ url, params, authtoken });
              if (response.status) {
                try {
                  let url = "createActivities";
                  let params = {
                    wallet: address,
                    hash: accept?.transactionHash,
                    from: nft.nftcollections_wallet,
                    to: address,
                    type: "buy",
                    price: nft.nftcollections_price,
                    quantity: 1,
                    collection: nft.nftcollections_id,
                    nft: nft.nftcollections_token_id,
                    transfer: "transfered",
                  };
                  let authtoken = "";
                  let response = await postMethod({
                    url,
                    params,
                    authtoken,
                  })
                } catch (e) {
                  console.log(e)
                }
                let url = "deleteOffer";
                let params = {
                  offer_bid_nft_token_id: nft.nftcollections_token_id,
                };
                let authtoken = "";
                let response = await postMethod({ url, params, authtoken });
                if (response.status) {
                  navigate("/")
                  setBuyModalOpen(false)
                }
              }
              setLoading2(false)
            }
          }
        } catch (e) {
          console.log(e);
          setWalletOpen(false)
          setLoading1(false)
          setLoading2(false)
        }
      } catch (err) {
        console.log("balance", err)
        setWalletOpen(false)
        setLoading1(false)
        setLoading2(false)
      }
      setWalletOpen(false)
    // }
    //  else {
    //   // alert("check balance");
    //   // setPurchasebloqs(true)
    //   setWalletOpen(false)
    //   setLoading1(false)
    //   setLoading2(false)
    // }

    //   try{
    //     const buyNft = await Marketplace.methods
    //     .executeOrder(data.nftcollections_wallet)
    //     .send({ from: address });
    //   let url = "updateNft";
    //   let params = {
    //     nft_id: data.nftcollections_id,
    //     type: "buy",
    //     wallet:address
    //   };
    //   let authtoken = "";
    //   let response = await postMethod({ url, params, authtoken });
    //   console.log("response",response);
    //   if (response.status) {
    //     try{
    //       let url = "createActivities";
    //       let params = {
    //         wallet: address,
    //         hash:"",
    //         from: address,
    //         to: data.nftcollections_wallet,
    //         type: "onsale",
    //         price:"",
    //         quantity: 1,
    //         collection: data.nftcollections_id,
    //         nft: data.nftcollections_token_id,
    //       };
    //       let authtoken = "";
    //       let response = await postMethod({
    //         url,
    //         params,
    //         authtoken,
    //       })
    //       console.log("actvies",response)
    //     }catch(e){
    //       console.log(e)
    //     }
    //     setBuyModalOpen(false);
    //   }
    // }catch(err){
    //   console.log("buy err",err)
    // }
  }
  const transferNft = async (buyerAddress, amt, token) => {
    let priceInWei = web3.utils.toWei(amt.toString(), "ether");
    if (await balance(buyerAddress, priceInWei)) {
      setWalletOpen(true)
      try {
        setLoading2(true)
        let date = new Date();
        let timestamp = date.getTime();
        let url = "signature";
        let params = {
          seller: address,
          buyer: buyerAddress,
          nftAddress: process.env.REACT_APP_COLLECTION_CONTRACT,
          amount: priceInWei,
          tokenId: token,
          nonce: timestamp,
        };
        let authtoken = "";
        let signresponse = await postMethod({ url, params, authtoken });
        if (signresponse.status) {
          setLoading1(true);
          const accept = await executeOrder(signresponse.signtuple);
          sethashValue(accept?.hash);
          setLoading1(false);
          if (accept) {
            let url = "updateNft";
            let params = {
              nft_id: id,
              type: "transfer",
              wallet: buyerAddress,
            };
            let authtoken = "";
            let response = await postMethod({ url, params, authtoken });
            if (response.status) {

              let url = "deleteOffer";
              let params = {
                offer_bid_nft_token_id: token
              };
              let authtoken = "";
              let response = await postMethod({ url, params, authtoken });
              try {
                let url = "createActivities";
                let params = {
                  wallet: address,
                  hash: accept?.transactionHash,
                  from: address,
                  to: buyerAddress,
                  type: "tranfer",
                  price: amt,
                  quantity: 1,
                  collection: nft.nftcollections_id,
                  nft: nft.nftcollections_token_id,
                  transfer: "transfered",
                };
                let authtoken = "";
                let response = await postMethod({
                  url,
                  params,
                  authtoken,
                })
                getdata();
                navigate("/")
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
        setLoading2(false)
        setWalletOpen(true)
      } catch (e) {
        console.log(e);
        setWalletOpen(false)
        setLoading1(false)
        setLoading2(false)
      }
      setWalletOpen(false);
    } else {
      console.log("err while transfered");
      setWalletOpen(false)
      setLoading1(false)
      setLoading2(false)
    }

  };
  const getItemActivity = async () => {
    try {
      let url = "getNftTransferActivites";
      let params = {
        token_id: nft.nftcollections_token_id,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      if (response.status) {
        setActivityDatas(response.resultAllActivites);
        setsalesHistory(response.resultAllTransfer);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const relistClick = async () => {
    try {
      let url = "updateNft";
      let params = {
        nft_id: id,
        type: "relist",
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      if (response.status) {
        navigate("/collections")
      }
    } catch (e) {
      console.log("relist err", e)
    }
  }
  useEffect(() => {
    if (address != "") {
      getdata();
      getComments();
      getMakeOffers();
      getItemActivity();
      usertokenbalance()
    }
  }, [address]);
  const [days, hours, minutes, seconds] = useCountdown(parseInt(nft.nftcollections_auction_time));
  const createNFT = async () => {
    console.log("nft", nft)
    const nftDetails = nft
    // if (address == "") {
    //   handleClick("warning", "Connect your wallet");
    //   return;
    //  }
    try {
      // setWalletOpen(true);
      // setLoading1(true);
      const LastMintId = await Collection.methods.totalSupply().call();
      var mintid = parseInt(LastMintId) + 1;
      console.log("LastMintId", mintid);
      setWalletOpen(true)
      // sethashValue(LastMintId?.hash)
      // setLoading1(false);
      // setLoading2(true);
      try {
        // let imageUrl = data3.location;
        // console.log("preeeeevvv", imageUrl);
        // let filename2 = mintid + ".json";
        // let jsonData = JSON.stringify({
        //   name: nftDetails.name,
        //   description: nftDetails.description,
        //   image: imageUrl,
        //   attributes: nftDetails.attributes,
        // });
        console.log("aaaaa", jsonData);
        try {
          try {
            let amt = 1;
            let amt2 = amt.toString();
            let priceInWei = web3.utils.toWei(amt2, "ether");
            console.log("starttttt");
            const allowance = await Token.methods
              .allowance(
                address,
                process.env.REACT_APP_Marketplace_CONTRACT
              )
              .call();
            if (allowance < priceInWei) {
              const approveToken = await Token.methods
                .approve(
                  process.env.REACT_APP_Marketplace_CONTRACT,
                  "999999999999999999999"
                )
                .send({ from: address });
              console.log("approveToken", approveToken);
            }


            try {
              console.log("dfghjkl", priceInWei);
              let date = new Date();
              let timestamp = date.getTime();
              let url = "signature";
              let params = {
                seller: address,
                buyer: address,
                nftAddress: process.env.REACT_APP_Marketplace_CONTRACT,//nftAddress
                amount: 0,
                tokenId: 1,
                nonce: timestamp,
              };
              let authtoken = "";
              let response = await postMethod({ url, params, authtoken });
              console.log("fghj", response);
              try {
                const signer = await Marketplace.methods.getSigner(response.signtuple).call()
                console.log("signer", signer)
              } catch (err) {
                setWalletOpen(false)
                console.log("Error", err)
              }
              if (response?.status) {
                try {
                  setLoading1(true)
                  setLoading2(true)
                  console.log("start", response.signtuple);
                  const mintNFT = await Marketplace.methods
                    .buyCollections(
                      response.signtuple,
                      nftDetails.nftcollections_metadata_url,
                      parseInt(0)
                    )
                    .send({ from: address });
                  setLoading1(false)
                  console.log("tesss", mintNFT);

                  let url = "updatepremintedNFT";
                  let params = {
                    wallet: address,
                    id: mintid,
                    nft_id: nft.nftcollections_id
                  };
                  let authtoken = "";
                  let responsenft = await postMethod({ url, params, authtoken });
                  console.log("responsenft", responsenft)

                  try {
                    let url = "createActivities";
                    let params = {
                      wallet: address,
                      hash: mintNFT?.transactionHash,
                      from: "",
                      to: address,
                      type: "Mint",
                      price: "",
                      quantity: 1,
                      collection: nftDetails.nftcollections_collection_id,
                      nft: mintid,
                      transfer: "transfered"
                    };
                    let authtoken = "";
                    let responseactive = await postMethod({
                      url,
                      params,
                      authtoken,
                    })
                    console.log("actvies", responseactive)

                    sethashValue(mintNFT?.transactionHash)
                    setLoading2(false)
                    if (response.status) {
                      navigate("/");
                    }
                  } catch (e) {
                    console.log(e)
                  }
                } catch (err) {
                  setWalletOpen(false)
                  console.log("err", err);
                }
              }
            } catch (err) {
              setWalletOpen(false)
              console.log("err in signature", err);
            }
          } catch (err) {
            setWalletOpen(false)
            console.log("tess", err);
          }

        } catch (err) {
          setWalletOpen(false)
          console.log("error json uploading", err);
          //   setWalletOpen(false);
          // setLoading1(false);
          // setLoading2(false)
        }
        // setLoading2(false)
      }
      catch (err) {
        setWalletOpen(false)
        console.log("error thumpnail uploading", err);
        //   setWalletOpen(false);
        // setLoading1(false);
        // setLoading2(false)
      }
      // setWalletOpen(false);
    } catch (err) {
      setWalletOpen(false)
      console.log("err in last supply", err);
      // setWalletOpen(false);
      // setLoading1(false);
      // setLoading2(false)
    }


  };
  var formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 6
	});
  return (
    <div className="metabloq_container nftdetails_container">
      <Stack gap={5}>
        <Row>
          <>
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
              <Fade bottom>
                <div
                  style={{
                    // overflow: "hidden",
                    borderRadius: "1em",
                  }}
                >
                  {/* <babylon
                      model={
                        "https://sunrisetechs.s3.ap-southeast-2.amazonaws.com/metabloqs/nft/" +
                        id +
                        ".glb"
                      }
                    >
                    </babylon> */}
                  {nft.nftcollections_animation_url == "" ? (
                    <Image
                      src={nft.nftcollections_image}
                      fluid
                      style={{
                        height: "400px",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "1em",
                      }}
                      alt=""
                    />
                  ) : (
                    <WithModel
                      id={nft.nftcollections_token_id}
                      bgColor={
                        nft?.nftcollections_background_color == undefined
                          ? "#ffffff"
                          : nft?.nftcollections_background_color
                      }
                    />
                  )}
                </div>
              </Fade>
              <br />
              <div style={{ padding: "1em" }}>
                <h5 className="fw-bold">Details</h5>
                <Stack gap={3}>
                  <div className="d-flex justify-content-between">
                    <div className="text-left">Contract address</div>
                    <a
                      href={`${process.env.REACT_APP_SCAN_baseuri + process.env.REACT_APP_COLLECTION_CONTRACT}`}
                      className="text-right"
                      style={{ textDecoration: "inherit" }}
                      target="_blank"
                    >
                      {process.env.REACT_APP_COLLECTION_CONTRACT.slice(0, 5) +
                        "..." +
                        process.env.REACT_APP_COLLECTION_CONTRACT.slice(-5)}
                    </a>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-left">Token id</span>
                    <span className="text-right">
                      {nft.nftcollections_token_id}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-left">Token Standard</span>
                    <span className="text-right">ERC-721</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-left">Metadata</span>
                    <a
                      href={nft.nftcollections_metadata_url}
                      className="text-right"
                      style={{ textDecoration: "inherit" }}
                      target="_blank"
                    >
                      {nft.nftcollections_metadata_url.slice(0, 20)}
                    </a>
                  </div>
                </Stack>
              </div>
              <br />
              <div style={{ padding: "1em" }}>
                <h5 className="fw-bold">Properties</h5>
                {attributes.length > 0 ? (
                  <Row>
                    {attributes
                      .filter((item) => item.type == "property")
                      .map((item, index) => (
                        <Col
                          xxl={4}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={6}
                          className="mb-2"
                          key={index}
                        >
                          <div className="properties_box h-100">
                            <span>{item.trait_type}</span>
                            <font size="1">{item.value}</font>
                          </div>
                        </Col>
                      ))}
                  </Row>
                ) : (
                  "no properties"
                )}
              </div>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <Fade bottom>
                <Stack gap={4}>
                  <h1 className="font-weight-bold">
                    {nft.nftcollections_name}
                  </h1>
                  <div>
                    <h5 className="fw-bold">Description</h5>
                    <small className="secondary-text">
                      {nft.nftcollections_description}
                    </small>
                  </div>
                  {nft.nftcollections_auction_time && (
                    <div>
                      <CountdownTimer
                        targetDate={parseInt(nft.nftcollections_auction_time)}
                      />
                    </div>
                  )}
                  <div className="d-flex">
                    {/* <Image src={icon} height={45} width={45} /> */}
                    <div className="mr-3 d-flex flex-column">
                      <span className="secondary-text">Created by</span>
                      <span className="bold">
                        {nft.nftcollections_wallet && nft.nftcollections_wallet.slice(0, 5) +
                          "..." +
                          nft.nftcollections_wallet && nft.nftcollections_wallet.slice(-5)}
                      </span>
                    </div>
                    <div className="mx-2 d-flex flex-column">
                      <span className="secondary-text">Collection</span>
                      <span className="bold">{nft.nftcollections_name}</span>
                    </div>
                  </div>
                  {nft.nftcollections_price !== "" && (
                    <>
                      <div className="">
                        <h5 className="fw-bold">Price</h5>
                        <span className="fw-bold">
                          {nft.nftcollections_price}
                        </span>
                        &nbsp;
                        <small>BLOQS</small>
                      </div>

                      <div className="">
                        <span className="fw-bold">
                          {formatter.format(nft.nftcollections_price*USD)}$
                        </span>
                        &nbsp;
                        {/* <small>USD</small> */}
                      </div>
                    </>

                  )}
                  {
                    nft.nftcollections_premintnft == true &&
                    <div className="d-flex">
                      <button
                        onClick={() => createNFT()}
                        className="mr-2 nftcollection_mobile-category"
                      >
                        <span>Mint</span>
                      </button>
                    </div>
                  }
                  <div className="d-flex">
                    {nft.nftcollections_status == "auction" &&
                      nft.nftcollections_wallet !== address ? (
                      <button
                        onClick={placebidClick}
                        className="mr-2 nftcollection_mobile-category"
                      >
                        <span>Place a Bid</span>
                      </button>
                    ) : null}
                    {nft.nftcollections_status == "onsale" &&
                      nft.nftcollections_wallet !== address ? (
                      <button
                        onClick={buyClick}
                        className="mx-2 metablog_primary-filled-square-button"
                      >
                        <span>Buy Now</span>
                      </button>
                    ) : null}
                    {(nft.nftcollections_status == "Mint" ||
                      nft.nftcollections_status == "onsale") &&
                      nft.nftcollections_wallet !== address ? (
                      <button
                        onClick={makeOfferClick}
                        className="mx-2 nftcollection_mobile-category"
                      >
                        <span>Make offer</span>
                      </button>
                    ) : null}
                    {nft.nftcollections_status == "Mint" &&
                      nft.nftcollections_wallet == address ? (
                      <button
                        onClick={putonSaleClick}
                        className="mx-2 metablog_primary-filled-square-button"
                      >
                        <span>Put On Sale</span>
                      </button>
                    ) : null}
                    {(nft.nftcollections_status == "onsale" || nft.nftcollections_status == "auction") && (nft.nftcollections_wallet == address) ?
                      <button
                        onClick={relistClick}
                        className="mx-2 nftcollection_mobile-category"
                      >
                        <span>Delist</span>
                      </button>
                      : null}
                  </div>
                  <div className="sales_history-chart">
                    <h5 className="fw-bold">Sales History</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex justify-content-end ranking_select-input">
                        <Stack direction="horizontal" gap={2}>
                          <Form.Select
                            aria-label="Default select example"
                            className="ranking_input"
                          >
                            <option>All Time</option>
                            {dropdowndays.map((day, i) => (
                              <option value={day.id} key={i}>Last {day.days}</option>
                            ))}
                          </Form.Select>
                        </Stack>
                      </div>
                      <div className="d-flex">
                        <h6 className="fw-bold">AVG Price</h6> &nbsp;
                        <small>0.01 BLOQS</small>
                      </div>
                    </div>
                    <br />
                    <SalesHistoryChart data={salesHistory} />
                  </div>
                  <div className="nftdetails_tabs-small">
                    <Tabs
                      defaultActiveKey="Comments"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab
                        eventKey="Comments"
                        title="Comments"
                        style={{ overflowY: "auto" }}
                      >
                        <Stack gap={3}>
                          <div style={{ maxHeight: "300px" }}>
                            {comments.map((item, i) => (
                              <div key={i} className="d-flex justify-content-between align-items-start comments_box mb-2">
                                <div clasName="p-2">
                                  <span className="fw-bold">
                                    {item.comments_wallet.slice(0, 5) +
                                      "..." +
                                      item.comments_wallet.slice(-5)}
                                  </span>
                                  <br />
                                  <small>{item.comments_text}</small>
                                </div>
                                <div className="d-flex">
                                  {item.comments_wallet == address && (
                                    <small
                                      onClick={() =>
                                        editCommentsOpen(
                                          item.comments_id,
                                          item.comments_text
                                        )
                                      }
                                      className="mx-2"
                                    >
                                      <FiEdit2 size={15} />
                                    </small>
                                  )}
                                  {item.comments_wallet == address || nft.nftcollections_wallet == address ? (
                                    <small
                                      onClick={() =>
                                        deleteComments(item.comments_id)
                                      }
                                      className="mx-2"
                                    >
                                      <AiOutlineDelete size={17} />
                                    </small>
                                  )
                                    : null
                                  }
                                </div>
                              </div>
                            ))}
                            <div className="d-flex align-items-end">
                              <textarea
                                type="text"
                                placeholder="Enter your Comments"
                                className="metabloq_comments-textarea"
                                value={commentsInput}
                                onChange={(e) =>
                                  setCommentsInput(e.target.value)
                                }
                              />
                              <span onClick={postComments}>
                                <MdOutlineSend color=" #0295FA" size={25} />
                              </span>
                            </div>
                          </div>
                        </Stack>
                      </Tab>
                      <Tab
                        eventKey="Offer History"
                        title="Offer History"
                        style={{ overflowY: "auto" }}
                      >
                        <Stack gap={3}>
                          <div className="comments_box" style={{ maxHeight: "300px" }}>
                            {offerData.length > 0 ?
                              offerData.map((offer, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-start comments_box mb-2">
                                  <div clasName="p-2">
                                    <small className="fw-bold"> Wallet</small><br />
                                    <small >{offer.offer_bid_wallet.slice(0, 5) + "..." + offer.offer_bid_wallet.slice(-5)}</small>
                                  </div>
                                  <div clasName="p-2">
                                    <small className="fw-bold"> Price</small><br />
                                    <small className="fw-bold">{offer.offer_bid_amount} BLOQS</small>
                                  </div>
                                  <div clasName="p-2">
                                    <small className="fw-bold"> Date</small><br />
                                    <small className="fw-bold">{offer.offer_bid_createdat ? offer.offer_bid_createdat.slice(0, 10) : ''} </small>
                                  </div>
                                  <div className="d-flex">
                                    {
                                      nft.nftcollections_wallet == address &&
                                      <button onClick={() => acceptMakeOffer(offer.offer_bid_wallet, offer.offer_bid_amount, offer.offer_bid_nft_token_id)}
                                        className="metablog_primary-filled-square-button"><font size="1">Accept</font></button>
                                    }
                                    &nbsp;
                                    {
                                      nft.nftcollections_wallet == address &&
                                      <button onClick={() => rejectMakeOffer(offer.offer_bid_id, offer.offer_bid_nft_token_id)}
                                        className="metablog_gradient-square-button"><font size="1">Reject</font></button>
                                    }
                                  </div>
                                </div>
                              )) : "no offers"
                            }
                          </div>
                        </Stack>
                      </Tab>
                      <Tab
                        eventKey="Bid History"
                        title="Bid History"
                        style={{ overflowY: "auto" }}
                      >
                        <Stack gap={3}>
                          <div className="comments_box" style={{ maxHeight: "300px" }}>
                            {bidData.length > 0 ?
                              bidData.map((bid, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-start comments_box mb-2">
                                  <div clasName="p-2">
                                    <small >{bid.offer_bid_wallet.slice(0, 5) + "..." + bid.offer_bid_wallet.slice(-5)}</small><br />
                                    <small className="fw-bold">{bid.offer_bid_amount} BLOQS</small>
                                  </div>
                                  <div className="">{FormatDate1(bid.offer_bid_createdat)}</div>
                                  <a style={{ textDecoration: "none" }} href={urls + `${bid.offer_bid_hash}`} target="_blank">{bid.offer_bid_hash.slice(0, 5) + "..." + bid.offer_bid_hash.slice(-5)}</a>
                                  <div className="d-flex">
                                    {
                                      (days + hours + minutes + seconds <= 0) && nft.nftcollections_wallet == address ?
                                        <button onClick={() => transferNft(bid.offer_bid_wallet, bid.offer_bid_amount, bid.offer_bid_nft_token_id)}
                                          className="metablog_primary-filled-square-button"><font size="1">Settle</font></button> : null
                                    }
                                  </div>
                                </div>
                              )) : "no bid history"
                            }
                          </div>
                        </Stack>
                      </Tab>
                    </Tabs>
                  </div>
                </Stack>
              </Fade>
            </Col>
          </>
        </Row>
        <div className="">
          <Activity activityDatas={activityDatas} details="details" />
        </div>
        {/* <NFTDetailsCards nftdetailspage="nftdetailspage" /> */}
      </Stack>
      <Modalbox
        show={show}
        setShow={setShow}
        nftsImg={nft.nftcollections_image}
        data={nft}
      />
      <PlacebidModal
        placeModalOpen={placeModalOpen}
        setPlaceModalOpen={setPlaceModalOpen}
        placeModalClose={placeModalClose}
        playSound={playSound}
        data={nft}
        highestBid={highestBid}
      />
      <BuynowModal
        buyModalOpen={buyModalOpen}
        setBuyModalOpen={setBuyModalOpen}
        buyModalClose={buyModalClose}
        playSound={playSound}
        tokenblc={BalanceToken}
        // amount={nft.nftcollections_price}
        action={buy}
        data={nft}
      />
      <PurchaseBloqsModal
        buyModalOpen={purchasebloqssts}
        setBuyModalOpen={setPurchasebloqs}
        buyModalClose={purchaseModalClose}
        playSound={playSound}
        tokenblc={BalanceToken}
        action={buy}
        data={nft}
      />
      <MakeOfferModal
        makeModalOpen={makeModalOpen}
        tokenblc={BalanceToken}
        setMakeModalOpen={setMakeModalOpen}
        makeModalClose={makeModalClose}
        data={nft}
      />
      <Modal
        open={editCommentsModal}
        onClose={() => setEditCommentsModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack gap={3}>
            <h5>Edit Comments</h5>
            <input
              type="text"
              className="metabloq_comments-textarea"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
            />
            <button
              onClick={saveEditComments}
              className="nftcollection_mobile-category"
            >
              <small>save</small>
            </button>
          </Stack>
        </Box>
      </Modal>
      <ActionWallet
        walletOpen={walletOpen}
        loader1={Loading1}
        loader2={Loading2}
        hashValue={hashValue}
        setWalletOpen={setWalletOpen}
      />
    </div>
  );
}

export default NFTDetails;
