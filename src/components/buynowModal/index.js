import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Image, Stack } from "react-bootstrap";
// import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { postMethod } from "../../helpers/API&Helpers";
import CheckoutForm from "./CheckoutForm"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BuyBloqs from '../buybloqs'
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
  borderRadius: '1em'
};

function BuynowModal(props) {
  let { buyModalOpen, setBuyModalOpen, buyModalClose, playSound, data, action, from, tokenblc, Totalamt } = props;
  const [successModal, setSuccessModal] = useState(false);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { wallet, address, Token, web3, Marketplace, USD } = reduxItems;
  const stripePromise = loadStripe(process.env.REACT_APP_Stripe_PublishableKey);

  const [Balance, setBalance] = useState(0)
  const [checkcard, setCheckcard] = useState(false)
  const [BuyBloqsmodal, setBuyBloqs] = useState(false)
  const [checkcrypto, setCheckcrypto] = useState(false)
  const [paymentmethod, setPaymentmethod] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const successModalClose = () => {
    setSuccessModal(false)
  }
  const balance = async () => {
    try {
      const balance = await Token.methods.balanceOf(address).call();
      console.log("balance", balance)
      setBalance(balance)
    } catch {
      console.log("ERROR")
    }
  }
  const buyNow = async () => {
    playSound();
    if (from == "atlas") {
      action();
    } else {
      action();
    }
  }
  const getstripkey = async () => {
    var USDvalue =1 //data.nftcollections_price*USD
    console.log("USDvalue",USDvalue)
    if (!USDvalue) {
      alert("error","Enter amount")
      return
    }
    let url = "Stripekey";
    let params = {
      items: Number(USDvalue * 100)
    };
    let authtoken = "";
    let response = await postMethod({ url, params, authtoken });
    console.log("response", response)
    if (response.status) {
      setClientSecret(response.clientSecret)
      setPaymentmethod(true)
    }
  }
  const checkconfirm = () => {
    if (!checkcard && !checkcrypto) {
      alert("Select option")
      return
    }
    if (checkcrypto) {
      buyNow()
    } else {
      // alert("Bloqs")
      // setPaymentmethod(true)
      setBuyBloqs(true)
    }
  }
  useEffect(() => {
    console.log("Totalamt", Totalamt)
    balance()
    console.log("data", data)
    if(data){ 
      console.log("USD", USD*data.nftcollections_price)
    }
  }, [Totalamt,data])
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6
  });
  const handlecardradio = () => {
    setCheckcard(true)
    setCheckcrypto(false)
  }
  const handlecryptoradio = () => {
    setCheckcard(false)
    setCheckcrypto(true)
  }
  const appearance = {
    theme: 'stripe',
};
const options = {
    clientSecret,
    appearance,
};
  return (
    <>
      <Modal
        open={buyModalOpen}
        onClose={buyModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{padding:"0px"}}>
          <div className='modal_header' style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
            <div>
              <h3 className="font-weight-bold">Checkout</h3>
            </div>
            <div>
              <small onClick={buyModalClose} style={{ cursor: 'pointer' }}>X</small>
            </div>
          </div>
          <Stack gap={3} style={{ padding: '16px' }}>
            <small className="font-weight-bold" >Item</small>
        
              <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around" }}>
                {
                  data&&data.nftcollections_image&&
                  <img src={data.nftcollections_image} style={{ width: "150px", height: "175px" }} />
                }
                
                <div style={{ display: "flex", flexDirection: "column", width: "100%", marginLeft: "10px" }} >
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }} >
                    { data&& data.nftcollections_name&&
                      <div>
                      <h5 className="font-weight-bold" >{data.nftcollections_name}</h5>
                    </div>}
                    <div>
                      <small className="font-weight-bold" >{Totalamt ? formatter.format(Number(Totalamt)) : data ? formatter.format(Number(data.nftcollections_price)) : 0} </small> <small className="font-weight-bold"><Image src={bloqs} fluid height={20} width={20} /> &nbsp;BLOQS</small>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                    <div> <small></small> </div>
                    <div>
                      <small>{Totalamt ? formatter.format(Number(Totalamt)*USD) : data ? formatter.format(Number(data.nftcollections_price)*USD) : 0} $ </small>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                    <div> <small>Royalty Fee %</small> </div>
                    <div>
                      <small>  </small>
                    </div>
                  </div>
                </div>
              </div>
              <>
                    <>
                      <Stack gap={1}>
                        <hr />
                        <div className=" d-flex justify-content-between align-items-center" style={{padding:"5px"}}>
                          <h5>payment method </h5>
                        </div>
                        <div className=" d-flex justify-content-between align-items-center" style={{ backgroundColor: "#e4e4e4", borderRadius: "10px", padding: "10px" }}>
                          <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#ffffff", width: "45%", padding: '10px', borderRadius: "10px", justifyContent: "space-between" }} >
                            <div>
                              <small>Crypto</small>
                            </div>
                            <input type={"radio"} checked={checkcrypto} onChange={handlecryptoradio} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#ffffff", width: "45%", padding: '10px', borderRadius: "10px", justifyContent: "space-between" }} >
                            <div>
                              <small>Card</small>
                            </div>
                            <input type={"radio"} style={{}} checked={checkcard} onChange={handlecardradio} />
                          </div>
                        </div>
                      </Stack>
                      <Stack gap={2} style={{alignItems:"center"}}>
                        <button
                          style={{width:"60%",borderRadius:"20px"}}
                          className="metablog_primary-filled-square-button"
                          onClick={checkconfirm}>
                          <span>Complete purchase</span>
                        </button>
                      </Stack>
                    </>
                    <BuyBloqs claimmodal={BuyBloqsmodal} setclaimmodal={setBuyBloqs} />
              </>
          </Stack>
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
                <small onClick={successModalClose} style={{ cursor: 'pointer' }}>X</small>
              </div>
              <div className="d-flex flex-column mx-auto">
                <Stack gap={2}>
                  <div className="d-flex justify-content-center">
                    <Image fluid src={smallstar} alt="small start" />
                    <Image fluid src={bigstar} alt="bigstar" />
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
