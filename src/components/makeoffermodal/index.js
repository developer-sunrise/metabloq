import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./Styles.css";
import { Form, Image, Stack } from "react-bootstrap";
import "./Styles.css";
import Divider from '@mui/material/Divider';
import { useSelector } from "react-redux";
import { postMethod } from "../../helpers/API&Helpers";
import ActionWallet from "../connectwallet/actionWallet";

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

const bloqs = require('../../assets/logo_block.png').default

function MakeOfferModal(props) {
  const reduxItems = useSelector((state) => state.WalletConnect);
    const { wallet,address, Token,web3 } = reduxItems;
  let { makeModalOpen, setMakeModalOpen, makeModalClose, data ,from,action} = props;
  const [makeOfferPrice, setMakeOfferPrice] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  //action wallet states
  const [walletOpen, setWalletOpen] = useState(false);
  const [Loading1, setLoading1] = useState(false);
  const [Loading2, setLoading2] = useState(false);
  const [hashValue,sethashValue]= useState("");
  
  const makeOffer = async () => {
    if(from=="atlas"){
      action(makeOfferPrice) 
    }else{
    try {
      setWalletOpen(true);
      setLoading1(true);
      let priceInWei = web3.utils.toWei(makeOfferPrice, "ether");
      const makeOffer = await Token.methods.approve(process.env.REACT_APP_Marketplace_CONTRACT,priceInWei ).send({ from: address })
      setLoading1(false);
      sethashValue(makeOffer?.hash);
      setLoading2(true);
      let url = "makeofferAndBid";
      let params = {
        nft_id: data.nftcollections_token_id,
        wallet: address,
        amount: makeOfferPrice,
        type:"makeoffer",
        hash: makeOffer?.transactionHash,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("make offer response",response);
      if(response.status){
        try{
          let url = "createActivities";
          let params = {
            wallet: address, 
            hash: makeOffer?.transactionHash,
            from: data.nftcollections_wallet,
            to: address,
            type: "makeoffer",
            price:makeOfferPrice,
            quantity: 1,
            collection: data.nftcollections_id,
            nft: data.nftcollections_token_id,
            tranfer:""
          };
          let authtoken = "";
          let response = await postMethod({
            url,
            params,
            authtoken,
          })
        }catch(e){
          console.log(e)
        }
        setMakeModalOpen(false);
      }
      setLoading2(false)
      setWalletOpen(false);
    } catch (e) {
      console.log(e);
      setWalletOpen(false);
      setLoading1(false);
      setLoading2(false);
    }
  }
  };

  const balanceCheck = async()=>{
    const balance = await Token.methods
    .balanceOf(address)
    .call();
    setBalanceAmount(balance);
  }
  useEffect(() => {
    // balanceCheck();
  }, [])


  // const days = [
  //   { id: 1, days: "1 Day" },
  //   { id: 2, days: "3 Days" },
  //   { id: 4, days: "7 Days" },
  //   { id: 5, days: "1 month" },
  // ];
  return (
    <>
      <Modal
        open={makeModalOpen}
        onClose={makeModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="placebid_modal-box">
            <Stack gap={3}>
              <div className=" d-flex justify-content-between align-items-center">
                <h3 className="font-weight-bold">Make an Offer</h3>
                <small onClick={makeModalClose} style={{ cursor: "pointer" }}>
                  X
                </small>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Price</span>
                <span>Balance {balanceAmount}</span>
              </div>
              <div className="d-flex makeoffer_input-holder">
                <small><Image src={bloqs} fluid height={15} width={15} />&nbsp;BLOQS</small>
                <Divider orientation="vertical" variant="middle" flexItem />
                <input
                  type="text"
                  placeholder="Enter amount"
                  className="makeoffer_input"
                  value={makeOfferPrice}
                  onChange={(e) => setMakeOfferPrice(e.target.value)}
                />
              </div>
              <Stack gap={2}>
                <button
                  className="metablog_primary-filled-square-button"
                  onClick={makeOffer}
                >
                  <span>Make Offer</span>
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

export default MakeOfferModal;
