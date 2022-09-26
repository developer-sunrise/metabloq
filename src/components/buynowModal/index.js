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
import Slider from "react-rangeslider";
import ActionWallet from "../connectwallet/actionWallet";

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
const horizontalLabels = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};

function BuynowModal(props) {
  let { buyModalOpen, setBuyModalOpen, buyModalClose, playSound, data, action, from, tokenblc, Totalamt } = props;
  const [successModal, setSuccessModal] = useState(false);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { wallet, address, Token, web3, connected, XDC_AirDrop, USD } = reduxItems;
  const stripePromise = loadStripe(process.env.REACT_APP_Stripe_PublishableKey);
  const metetoken = require("../../assets/logo_block.png").default

  const [Balance, setBalance] = useState(0)
  const [XDCbalance, setXDCbalance] = useState(0)
  const [xdcvalue, setxdcvalue] = useState(0)
  const [bloqsvalue, setbloqsvalue] = useState(0)
  const [checkcard, setCheckcard] = useState(false)
  const [Checkcryptopay, setCheckcryptopay] = useState(false)
  const [BuyBloqsmodal, setBuyBloqs] = useState(false)
  const [checkcrypto, setCheckcrypto] = useState(false)
  const [paymentmethod, setPaymentmethod] = useState(false)
  const [paymentmethodCard, setPaymentmethodcard] = useState(false)
  const [cryptotoprup, setcryptotoprup] = useState(false)
  const [cryptotoprupchoise, setcryptotoprupchoise] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [addbloqs, setAddbloqs] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false);
  const [Loading1, setLoading1] = useState(false);
  const [Loading2, setLoading2] = useState(false);
  const [hashValue, sethashValue] = useState("")
  const [USDvalue, setUSDvalue] = useState(0)

  const [sliderval, setSliderval] = useState()
  const successModalClose = () => {
    setSuccessModal(false)
  }
  const balanceoftoken = async () => {
    try {
      const balance = await Token.methods.balanceOf(address).call();
      console.log("balance", balance)
      var amt = web3.utils.fromWei(balance, 'ether')
      console.log("fromweiamt", amt)
      setBalance(Number(amt))
    } catch {
      console.log("ERROR")
    }
  }
  const buyNow = async (isCrypto) => {
    playSound();
    if (from == "atlas") {
      action(isCrypto);
    } else {
      action(isCrypto);
    }
  }
  const getstripkey = async () => {
    var USDvalue = 1 //USD * data.nftcollections_price
    console.log("USDvalue", USDvalue)
    if (!USDvalue) {
      alert("error", "Enter amount")
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
      setPaymentmethodcard(true)
    }
  }
  const checkconfirm = () => {
    if (!checkcard && !checkcrypto) {
      alert("Select option")
      return
    }
    if (checkcrypto) {  // paymentmethodCard
      console.log("USDvalue", USDvalue)
      console.log("Balance", Balance)
      var amt = data.nftcollections_price
      if (Balance < Number(amt)) {
        setPaymentmethod(true)
      } else {
        buyNow(true)
      }
    } else {
      setPaymentmethodcard(true)
      getstripkey()
    }
  }
  const handlesetvalue = (e) => {
    // console.log("sider", e)
    setxdcvalue(e)
    setbloqsvalue(e * 100)
  }
  const handleslider = (e) => {
    // console.log("sider", e)
    setSliderval(e)
    if (XDCbalance) {
      var val = XDCbalance * (e / 100)
      setxdcvalue((val).toFixed(2))
      // setbloqsvalue((val * 10000).toFixed(2))
    }
  }
  const setPaymentmethodsts = (status) => {
    console.log("status", status)
    buyNow(false)
  }
  const setPaymentmethodclaim = async (SelectedAmt) => {
    //ClaimAirDrops
    setWalletOpen(true)
    setLoading1(true)
    var time = Date.now()
    let url = "signatureXDCAirdrop";
    let amount = web3.utils.toWei(String(SelectedAmt), "")
    let params = {
      contractAddress: process.env.REACT_APP_XDCAIRDROP_CONTRACT,
      userAddress: address,
      amount: amount,
      isXDC: false,
      nonce: time
    };
    console.log("params", params)
    let authtoken = "";
    let responses = await postMethod({ url, params, authtoken });
    // console.log("response",responses)
    //  console.log("response",response.signtuple)
    console.log("Bloqs_AirDrop.methods", responses.signtuple)
    if (responses.signtuple) {
      try {
        var Claim = await XDC_AirDrop.methods.claimAirDrops(responses.signtuple).send({ from: address });
        console.log("Claim", Claim)
        // let url = "UpdateBloqsAirdrop";
        // let params = {id:Selectedid };
        // console.log("paramss",params)
        // let authtoken = "";
        // let response = await postMethod({ url, params, authtoken });
        // console.log("response",response)
        buyNow(true)
        setLoading2(true)
        // getBloqsairdroplist()
        setLoading1(false)
        setLoading2(false)
        setWalletOpen(false)
      } catch (err) {
        setLoading1(false)
        setWalletOpen(false)
        console.log("ERROR", err)
      }
    } else {
      setLoading1(false)
      setWalletOpen(false)
    }

  }
  useEffect(() => {

    if (data) {
      console.log("USD", USD * data.nftcollections_price)
    }
    let amt = Totalamt ? Number(Totalamt) : data ? Number(data.nftcollections_price) : 0
    console.log("USDb" + (amt * USD))
    if (amt) {
      setUSDvalue(Number(amt * USD))
    }
  }, [Totalamt, data, clientSecret])
  useEffect(() => {
    if (connected) {
      balanceoftoken()
    }
  }, [connected])
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
  const handleswapwithxdc = () => {
    var amt = Totalamt ? formatter.format(Number(Totalamt)) : data ? formatter.format(Number(data.nftcollections_price)) : 0
    setxdcvalue(amt / 100) //1 xdc =100 bloqs
    setbloqsvalue(amt)
    setCheckcryptopay(true)
    setcryptotoprup(true)
    setcryptotoprupchoise(true)
    // setCheckcard(false)
    // setCheckcrypto(true)
  }
  const handlecardcash = async () => {
    var amt = Totalamt ? formatter.format(Number(Totalamt)) : data ? formatter.format(Number(data.nftcollections_price)) : 0
    setxdcvalue(amt / 100) //1 xdc =100 bloqs
    setbloqsvalue(amt)
    var USDvalue = 1 //USD * data.nftcollections_price
    console.log("USDvalue", USDvalue)
    if (!USDvalue) {
      alert("error", "Enter amount")
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
      setcryptotoprup(true)
      setcryptotoprupchoise(false)
      // setPaymentmethod(true)
      // setPaymentmethodcard(true)
    }

    // setCheckcard(false)
    // setCheckcrypto(true)
  }
  const swapfun = async () => {
    if (!connected) {
      // handleClick("error", "connect wallet");
      return
    }
    if (!xdcvalue) {
      // handleClick("error", "Invalid Amount");
      return
    }

    // var amt = web3.utils.toWei('10', 'ether')
    var amt = web3.utils.toWei(String(xdcvalue), 'ether')
    var allowance= await Token.methods.allowance(address,process.env.REACT_APP_XDCAIRDROP_CONTRACT).call()
    console.log("allowance",allowance)
    var amttoken = web3.utils.fromWei(allowance,'ether')
    console.log("amttoken",amttoken)
    try{
      if(amttoken<100000){
        var approve = await Token.methods.approve(process.env.REACT_APP_XDCAIRDROP_CONTRACT,'10000000000000000000').send({from:address})
        console.log("approve",approve)
      }
    try {
      setWalletOpen(true);
      setLoading1(true); setLoading2(true)
      var swap = await XDC_AirDrop.methods.SwapXDCtoMetabloqs().send({ from: address, value: amt })
      console.log("swap", swap)
      setAddbloqs(true)
      setLoading1(false)
      setLoading2(false)
      setWalletOpen(false)
    } catch (e) {
      setLoading1(false)
      setLoading2(false)
      setWalletOpen(false)
      console.log("Error", e)
    }
  }catch{
    console.log("Error")
        }
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
        <Box sx={style} style={{ padding: "0px" }}>
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
                data && data.nftcollections_image &&
                <img src={data.nftcollections_image} style={{ width: "100px", height: "125px" }} />
              }

              <div style={{ display: "flex", flexDirection: "column", width: "100%", marginLeft: "10px" }} >
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }} >
                  {data && data.nftcollections_name &&
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
                    <small>{Totalamt ? formatter.format(Number(Totalamt) * USD) : data ? formatter.format(Number(data.nftcollections_price) * USD) : 0} $ </small>
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
                {!paymentmethod ?
                  <>
                    <Stack gap={1}>
                      <hr />
                      <div className=" d-flex justify-content-between align-items-center" style={{ padding: "5px" }}>
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
                    <Stack gap={2} style={{ alignItems: "center" }}>
                      <button
                        style={{ width: "60%", borderRadius: "20px" }}
                        className="metablog_primary-filled-square-button"
                        onClick={checkconfirm}>
                        <span>Complete purchase</span>
                      </button>
                    </Stack>
                  </>
                  :
                  !paymentmethodCard ?
                    !cryptotoprup ?
                      <Stack gap={3} style={{ padding: '0px' }}>
                        {/* <small>Item</small> */}
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                          <div className='modal_headers' style={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "space-between", background: "linear-gradient(90deg, #0295FA 0%, #0295FA 100%)", padding: "15px", borderRadius: "1em 1em 1em 1em" }} >
                            <div>
                              <h5 className="font-weight-bold" style={{ color: "#ffffff" }} >You Need </h5>
                            </div>
                            <div >
                              <img src={metetoken} style={{ width: "20px", height: "15px" }} />
                              <small onClick={buyModalClose} style={{ cursor: 'pointer', color: "#ffffff" }}>{Totalamt ? formatter.format(Number(Totalamt)) : data ? formatter.format(Number(data.nftcollections_price)) : 0} BLOQS</small>
                            </div>
                          </div>
                          <div className=" d-flex" style={{ borderRadius: "10px", padding: "5px", justifyContent: "center", alignItems: 'center', alignContent: "center" }}>
                            <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#ffffff", width: "80%", padding: '10px', borderRadius: "10px", justifyContent: "space-between" }} >
                              <small> Swap xdc with BLOQS or Buy NFT with card it take up to a minute for your balance to update</small>
                            </div>
                          </div>
                        </div>
                        <div className=" d-flex" style={{ borderRadius: "10px", justifyContent: "space-between" }}>
                          <div style={{}} >
                            <small className="font-weight-bold"  >Your Wallet </small>
                          </div>
                          <div style={{}} >
                            <small>Balance : </small>
                            <img src={metetoken} style={{ width: "20px", height: "20px" }} />
                            <small> {formatter.format(Balance)} BLOQS </small>
                          </div>
                        </div>
                        <div className=" d-flex" style={{ borderRadius: "10px", padding: "5px", justifyContent: "space-between" }}>
                          <div style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", display: "flex", border: "1px solid #181818", alignItems: "center", borderRadius: "5px" }} >
                            <input type={"text"} value={address} style={{ width: "100%", height: "48px", border: "none" }} />
                            <img src={metetoken} style={{ width: "20px", height: "20px" }} />
                          </div>
                        </div>
                        <>
                          <Stack gap={0}>
                            <div className=" d-flex justify-content-between align-items-center">
                              <h5>payment method</h5>
                            </div>
                            <div className=" d-flex justify-content-between align-items-center" style={{ backgroundColor: "#e4e4e4", borderRadius: "10px", padding: "10px" }}>
                              <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#ffffff", width: "45%", padding: '10px', borderRadius: "10px", justifyContent: "space-between" }} >
                                <div>
                                  <small>Swap with XDC</small>
                                </div>
                                <input type={"radio"} checked={Checkcryptopay} onChange={handleswapwithxdc} />
                              </div>
                              <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#ffffff", width: "45%", padding: '10px', borderRadius: "10px", justifyContent: "space-between" }} >
                                <div>
                                  <small>Card</small>
                                </div>
                                <input type={"radio"} style={{}} checked={checkcard} onChange={handlecardcash} />
                              </div>
                            </div>
                          </Stack>
                          {/* <Stack gap={2}>
                              <button
                                  className="metablog_primary-filled-square-button"
                                  onClick={checkconfirm}  >
                                  <span>Complete purchase</span>
                              </button>
                          </Stack> */}
                        </>
                      </Stack>
                      :
                      cryptotoprupchoise ?
                        <Stack>
                          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <div className='modal_headers' style={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "space-between", background: "linear-gradient(90deg, #0295FA 0%, #0295FA 100%)", padding: "15px", borderRadius: "1em 1em 1em 1em" }} >
                              <div>
                                <h5 className="font-weight-bold" style={{ color: "#ffffff" }} >You Need </h5>
                              </div>
                              <div >
                                <img src={metetoken} style={{ width: "20px", height: "15px" }} />
                                <small onClick={buyModalClose} style={{ cursor: 'pointer', color: "#ffffff" }}>{Totalamt ? formatter.format(Number(Totalamt)) : data ? formatter.format(Number(data.nftcollections_price)) : 0} BLOQS</small>
                              </div>
                            </div>
                          </div>
                          <div className=" d-flex" style={{ borderRadius: "10px", justifyContent: "space-between" }}>
                            <div style={{}} >
                              <small className="font-weight-bold"  >Your Wallet </small>
                            </div>
                            <div style={{}} >
                              <small>Balance : </small>
                              <img src={metetoken} style={{ width: "20px", height: "20px" }} />
                              <small> {formatter.format(Balance)} BLOQS </small>
                            </div>
                          </div>
                          <div className=" d-flex" style={{ borderRadius: "10px", padding: "5px", justifyContent: "space-between" }}>
                            <div style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", display: "flex", border: "1px solid #181818", alignItems: "center", borderRadius: "5px" }} >
                              <input type={"text"} value={address} style={{ width: "100%", height: "48px", border: "none" }} />
                              <img src={metetoken} style={{ width: "20px", height: "20px" }} />
                            </div>
                          </div>
                          <div className='modal_body'>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                              <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", border: "1px solid", borderRadius: "10px", alignItems: "center", borderColor: "#e4e4e4" }} >
                                <div>
                                  <input placeholder='250' style={{ border: "none", width: "80%" }}
                                    value={xdcvalue} onChange={(e) => handlesetvalue(e.target.value)}
                                  />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px", alignItems: "center", backgroundColor: "#e4e4e4", borderRadius: "10px" }} >
                                  <img src={metetoken} style={{ width: "40%", height: "40%" }} />
                                  <p className="text-center">XDC</p>
                                </div>
                              </div>
                            </div>
                            <div style={{ width: "100%", padding: "10px", marginBottom: "10px" }} >
                              <Slider
                                color="blue"
                                step={5}
                                min={0}
                                max={100}
                                value={sliderval}
                                onChange={handleslider}
                                labels={horizontalLabels}
                              />
                            </div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px", padding: "5px", }} >
                              <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", border: "1px solid", borderRadius: "10px", alignItems: "center", borderColor: "#e4e4e4" }} >
                                <div>
                                  <input placeholder='250' style={{ border: "none", width: "80%" }}
                                    value={bloqsvalue}
                                  />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", alignItems: "center", backgroundColor: "#e4e4e4", borderRadius: "10px" }} >
                                  <img src={metetoken} style={{ width: "40%", height: "40%" }} />
                                  <p className="text-center">Bloqs</p>
                                </div>
                              </div>
                            </div>
                            <div className='d-flex justify-content-center align-items-center' style={{ flexDirection: "row", display: "flex", justifyContent: "space-around" }} >

                              {
                                !addbloqs ?
                                  <button className="metablog_primary-filled-button"
                                    // onClick={()=>swapfun()} 
                                    onClick={() => swapfun()}
                                  >
                                    Add bloqs
                                  </button>
                                  :
                                  <button className="metablog_primary-filled-button-disable"
                                    // onClick={()=>swapfun()} 
                                    disabled
                                  // onClick={() => swapfun()}
                                  >
                                    Add bloqs
                                  </button>
                              }
                              {
                                !addbloqs ?
                                  <button className="metablog_primary-filled-button-disable" disabled
                                    style={{ marginBottom: "10px" }}
                                  >
                                    Complete Purchase
                                  </button>
                                  :
                                  <button className="metablog_primary-filled-button"
                                    style={{ marginBottom: "10px" }}
                                    onClick={() => buyNow(false)}
                                  // onClick={() => setConfirmmodal(true)}
                                  >
                                    Complete Purchase
                                  </button>
                              }
                            </div>
                          </div>
                        </Stack>
                        :
                        clientSecret && (
                          <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm clientSecret={clientSecret} data={{ amount: 0, bloqs: bloqsvalue }} setPaymentStatus={() => setPaymentmethodclaim(10)} />
                          </Elements>
                        )
                    :
                    <div style={{justifyContent:"center",display:'flex',flexDirection:"column" }}>
                      <div className='modal_headers' style={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "space-between", background: "rgb(228, 228, 228)", padding: "15px", borderRadius: "1em 1em 1em 1em" }} >
                              <div style={{display: "flex", flexDirection:"row",justifyContent: "space-between"}} >
                              <img src={data.nftcollections_image} style={{ width: "20px", height: "15px" }} />
                                <h5 className="font-weight-bold" style={{ color: "#181818" }} ><small> Purchasing {data.nftcollections_name} </small>  {formatter.format(data.nftcollections_price*USD)}$ </h5>
                              </div>
                              {/* <div >
                                <img src={metetoken} style={{ width: "20px", height: "15px" }} />
                                <small onClick={buyModalClose} style={{ cursor: 'pointer', color: "#ffffff" }}>{Totalamt ? formatter.format(Number(Totalamt)) : data ? formatter.format(Number(data.nftcollections_price)) : 0} BLOQS</small>
                              </div> */}
                            </div>
                      {
                        clientSecret && (
                          <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm clientSecret={clientSecret} data={{ amount: 0, bloqs: bloqsvalue }} setPaymentStatus={setPaymentmethodsts} />
                          </Elements>
                        )
                      }
                    </div>


                }
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

export default BuynowModal;
