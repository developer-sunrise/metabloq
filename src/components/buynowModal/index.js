import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Image, Stack } from "react-bootstrap";
// import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { postMethod } from "../../helpers/API&Helpers";

const smallstar = require('../../assets/smallstar.png')
const bigstar = require('../../assets/bigstar.png')
const bloqs = require('../../assets/logo_block.png')

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
  
function BuynowModal(props) {
  let { buyModalOpen, setBuyModalOpen,buyModalClose,playSound,data,action,from} = props;
  const [successModal,setSuccessModal] = useState(false);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { wallet,address, Token,web3,Marketplace } = reduxItems;

  const successModalClose = ()=>{
    setSuccessModal(false)
  }

  const buyNow = async()=>{
    playSound();

    if(from=="atlas"){
      action();
    }else{
      action();
    }


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

  return (
    <>
      <Modal
        open={buyModalOpen}
        onClose={buyModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="placebid_modal-box">
            <Stack gap={3}>
                <div className=" d-flex justify-content-between align-items-center">
                  <h3 className="font-weight-bold">Checkout</h3>
                  <small onClick={buyModalClose} style={{cursor:'pointer'}}>X</small>
                </div>
                <small>your payment</small>
              <div>
                <Stack gap={1}>
                  <div className=" d-flex justify-content-between align-items-center">
                    <small>1.005</small> <small className="font-weight-bold"><Image src={bloqs} fluid  height={20} width={20}/> &nbsp;BLOQS</small>
                  </div>
                  <hr/>
                  <div className=" d-flex justify-content-between align-items-center">
                    <small>Your balance</small> <small className="font-weight-bold"><Image src={bloqs} fluid  height={20} width={20}/> &nbsp;8.498 BLOQS</small>
                  </div>
                  <div className=" d-flex justify-content-between align-items-center">
                    <small>Service fee</small> <small className="font-weight-bold"><Image src={bloqs} fluid  height={20} width={20}/> &nbsp;0 BLOQS</small>
                  </div>
                  <div className=" d-flex justify-content-between align-items-center">
                    <small>You pay will</small> <small className="font-weight-bold"><Image src={bloqs} fluid  height={20} width={20}/> &nbsp; 0.007 BLOQS</small>
                  </div>
                </Stack>
              </div>
              <Stack gap={2}>
                <button
                  className="metablog_primary-filled-square-button"
                  onClick={buyNow}
                >
                  <span>Check out</span>
                </button>
                <button
                  className="metablog_gradient-square-button"
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
    </>
  );
}

export default BuynowModal;
