import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./Styles.css";
import { Image, Stack } from "react-bootstrap";
import useSound from 'use-sound';
import buttonSound from "../../assets/audio/button.wav";
import { useSelector } from "react-redux";
import { postMethod } from "../../helpers/API&Helpers";
import Swal from 'sweetalert2'
import ActionWallet from "../connectwallet/actionWallet";
import { useNavigate } from "react-router-dom";

const smallstar = require('../../assets/smallstar.png').default
const bigstar = require('../../assets/bigstar.png').default
const bloqs = require('../../assets/logo_block.png').default
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: 'none !important',
    boxShadow: 2,
    p: 2,
    borderRadius:'1em'
  };
  
  
function PlacebidModal(props) {
  let { placeModalOpen, setPlaceModalOpen,placeModalClose,data,highestBid,from,action } = props;
  const navigate =useNavigate()
  const [successModal,setSuccessModal] = useState(false);
  const [placeBidPrice,setPlaceBidPrice] = useState("");
  const [placeBidPriceUSD,setPlaceBidPriceusd] = useState(0);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { wallet,address, Token,web3,USD } = reduxItems;
  const [balanceAmount,setBalanceAmount]  = useState("");
    //action wallet states
    const [walletOpen, setWalletOpen] = useState(false);
    const [Loading1, setLoading1] = useState(false);
    const [Loading2, setLoading2] = useState(false);
    const [hashValue,sethashValue]= useState("");
  const successModalClose = ()=>{
    setSuccessModal(false)
  }

  const placebidClick = async()=>{
    console.log("placeBidPrice",placeBidPrice)
    if(from=="atlas"){
      action(placeBidPrice) 
    }else{
    if(parseFloat(data?.nftcollections_price) > parseFloat(placeBidPrice)){
      setPlaceModalOpen(false)
      Swal.fire('Enter Amount Higher than Minimum Amount');
    }else{
    try{
      setWalletOpen(true);
      setLoading1(true);
      let priceInWei = web3.utils.toWei(placeBidPrice, "ether");
      const placebid = await Token.methods
      .approve(process.env.REACT_APP_Marketplace_CONTRACT,priceInWei )
      .send({ from: address });
      setLoading1(false);
      sethashValue(placebid?.hash);
      setLoading2(true);
      let url = "makeofferAndBid";
      let params = {
        nft_id: data.nftcollections_token_id,
        wallet: address,
        amount: placeBidPrice,
        type:"bid",
        hash: placebid?.transactionHash,
      };
      console.log("place",params)
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("response place bid",response);
      if(response.status){
        try{
          let url = "createActivities";
          let params = {
            wallet: address,
            hash:placebid?.transactionHash,
            from: address,
            to: data.nftcollections_wallet,
            type: "bid",
            price:placeBidPrice,
            quantity: 1,
            collection: data.nftcollections_id,
            nft: data.nftcollections_token_id,
            transfer:""
          };
          let authtoken = "";
          let response = await postMethod({
            url,
            params,
            authtoken,
          })

          console.log("actvies",response)
          navigate("/")
        }catch(e){
          console.log(e)
        }
        setPlaceModalOpen(false);
        setTimeout(()=>{
          setSuccessModal(true);
        },3000)
        setLoading2(false)
      }
      setWalletOpen(false)
    }catch(e){
      console.log(e)
      setWalletOpen(false)
      setLoading1(false)
      setLoading2(false)
    }}
  }
  }
  const [playSound] = useSound(buttonSound);
  const balanceCheck = async()=>{
    const balance = await Token.methods
    .balanceOf(address)
    .call();
    setBalanceAmount(balance);
  }
  const handleplacebit =(e)=>{
    setPlaceBidPrice(e)
    setPlaceBidPriceusd(e*USD)
  }
  useEffect(() => {
    // balanceCheck();
  }, [])
  var formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 4
	});
  return (
    <>
      <Modal
        open={placeModalOpen}
        onClose={placeModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="placebid_modal-box">
            <Stack gap={3}>
              <div>
                <div className=" d-flex justify-content-between align-items-center">
                  <h3 className="font-weight-bold">Place a bid</h3>
                  <small onClick={placeModalClose} style={{cursor:'pointer'}}>X</small>
                </div>
                <span>Minimum Bid Amount <span className="fw-bolder">{data?.nftcollections_price}</span> BLOQS</span><br/>
                <span>Highest Bidder <span className="fw-bolder">{Math.max(highestBid)}</span> BLOQS</span>
                </div>
                <div>
                <Stack gap={1}>
                  <small className="font-weight-bold">Your Bid</small>
                  <div className="d-flex makeoffer_input-holder">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="makeoffer_input"
                    value={placeBidPrice}
                    onChange={(e) =>{ if(e.target.value>=0){ handleplacebit(e.target.value) } }}
                    required
                  />
                </div>
                  <div className=" d-flex justify-content-between align-items-center">
                    <small>Your Bid</small> <small className="font-weight-bold">&nbsp;{formatter.format(placeBidPriceUSD)}$ USD</small>
                  </div>
                  <div className=" d-flex justify-content-between align-items-center">
                    <small>Your balance</small> <small className="font-weight-bold"><Image src={bloqs} fluid  height={20} width={20}/>&nbsp;{balanceAmount} BLOQS</small>
                  </div>
                </Stack>
              </div>
              <Stack gap={2}>
                <button
                  className="metablog_primary-filled-square-button"
                  onClick={placebidClick}
                >
                  <span>Place bid</span>
                </button>
                <button
                  className="metablog_gradient-square-button"
                  onClick={placeModalClose}
                >
                  <span>Cancel</span>
                </button>
              </Stack>
            </Stack>
          </div>
        </Box>
      </Modal>

      <Modal
        open={successModal}
        onClose={successModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="placebid_modal-box">
            <Stack gap={3}>
                <div className=" d-flex justify-content-between align-items-center">
                  <h3 className="font-weight-bold">Payment success</h3>
                  <small onClick={successModalClose} style={{cursor:'pointer'}}>X</small>
                </div>
              <div className="d-flex flex-column mx-auto">
                <Stack gap={2}>
                  <div className="d-flex justify-content-center">
                    <Image fluid src={smallstar} alt="small start"/>
                    <Image fluid src={bigstar} alt="bigstar"/>
                  </div>
                  <span className="lufga-bold">Your payment was success</span>
                  <div className="d-flex justify-content-between">
                    <font size="2">Payment Id</font>
                    <font size="2" className="lufga-bold">15263541</font>
                  </div>
                </Stack>
                  
              </div>
              <Stack gap={2}>
                <button
                  className="metablog_gradient-square-button"
                  onClick={successModalClose}
                >
                  <span>Back to home</span>
                </button>
              </Stack>
            </Stack>
          </div>
        </Box>
      </Modal>
      <ActionWallet 
        walletOpen={walletOpen}
        loader1={Loading1}
        loader2={Loading2}
        hashValue={hashValue}
        setWalletOpen={setWalletOpen}
       />
    </>
  );
}

export default PlacebidModal;
