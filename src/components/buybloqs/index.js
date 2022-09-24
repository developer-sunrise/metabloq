import React, { useEffect, useState } from 'react';
import "./styles.css";
import { Row, Col, Stack } from "react-bootstrap";
import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Address } from 'decentraland-ui';
import ActionWallet from "../connectwallet/actionWallet";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import MuiAlert from "@mui/material/Alert";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Snackbar } from "@mui/material";
import { postMethod } from "../../helpers/API&Helpers/index";

import CheckoutForm from "./Checkoutform";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    // height: "60%",
    bgcolor: "background.paper",
    border: "none !important",
    boxShadow: 2,
    p: 0,
    borderRadius: "1em",
};
const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    // height: "60%",
    bgcolor: "background.paper",
    border: "none !important",
    boxShadow: 2,
    p: 0,
    borderRadius: "1em",
};

const datas = [
    {
        id: 1,
        city: "London",
        amt: "3.00",
        status: "claim"
    },
    {
        id: 2,
        city: "Brazil",
        amt: "5.00",
        status: "claim"
    },
    {
        id: 3,
        city: "Dubai",
        amt: "6.00",
        status: "claim"
    },
    {
        id: 4,
        city: "Newyork",
        amt: "6.00",
        status: "claimed"
    },
    {
        id: 5,
        city: "sydney",
        amt: "5.00",
        status: "claimed"
    },
    {
        id: 6,
        city: "paris",
        amt: "3.00",
        status: "claimed"
    }
]
function ClaimBloqsModal(props) {
    const metetoken = require("../../assets/logo_block.png").default
    let { claimmodal, setclaimmodal } = props;
    const returnItems = useSelector((state) => state.WalletConnect);
    const { address, connected, XDC_AirDrop, web3, Token } = returnItems
    const stripePromise = loadStripe(process.env.REACT_APP_Stripe_PublishableKey);
    
    const [walletOpen, setWalletOpen] = useState(false);
    const [Loading1, setLoading1] = useState(false);
    const [Loading2, setLoading2] = useState(false);
    const [hashValue, sethashValue] = useState("");
    const [XDCbalance, setXDCbalance] = useState(0)
    const [Tokenbalance, setTokenbalance] = useState(0)
    const [sliderval, setSliderval] = useState()
    const [USDvalue, setUSDvalue] = useState(0)
    const [bloqsvalue, setbloqsvalue] = useState(0)
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [confirmmodal, setConfirmmodal] = useState(false)
    const [clientSecret, setClientSecret] = useState('')
    const [paymentStatus, setPaymentStatus] = useState(false)

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const getacc = async () => {
        var data = await web3.eth.getBalance(address)
        var tokenblc = await Token.methods.balanceOf(address).call()
        data = web3.utils.fromWei(data, 'ether')
        tokenblc = web3.utils.fromWei(tokenblc, 'ether')
        setTokenbalance(tokenblc)
        setXDCbalance(data)
    }
    const handlesetvalue = (e) => {
        // console.log("sider", e)
        setUSDvalue(e)
        setbloqsvalue(e * 10)
    }
    const handleClick = (type, message) => {
        setType(type);
        setMessage(message);
        setOpen(true);
    };
    const getstripkey = async () => {
        if (!USDvalue) {
            handleClick("error","Enter amount")
            return
        }
        let url = "Stripekey";
        let params = {
            items: Number(USDvalue*100)
        };
        let authtoken = "";
        let response = await postMethod({ url, params, authtoken });
        console.log("response", response)
        if (response.status) {
            setClientSecret(response.clientSecret)
            setConfirmmodal(true)
        }
        // fetch("/create-payment-intent", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
        //   })
        //     .then((res) => res.json())
        //     .then((data) => setClientSecret(data.clientSecret));
    }
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    const Claimbloqs = async() => {
        if (!address) {
            handleClick("error","Connect Wallet")
            return
        }
        setWalletOpen(true)
        setLoading1(true)
        var time = Date.now()
        let url = "signatureXDCAirdrop";
        let amount = web3.utils.toWei(String(bloqsvalue),"ether")
        let params = {
            contractAddress: process.env.REACT_APP_XDCAIRDROP_CONTRACT ,
            userAddress: address , 
            amount:amount, 
            isXDC:false,
            nonce:time
        };
         console.log("params",params)
        let authtoken = "";
        let responses = await postMethod({ url, params, authtoken });
        console.log("responses",responses)
        if(responses.signtuple){
            try{
                var Claim = await XDC_AirDrop.methods.claimAirDrops(responses.signtuple).send({from:address});
                setPaymentStatus(false)
                setLoading2(true)
                setLoading1(false)
                let url = "updateBuybloqs";
                let params = {
                    client_secret: clientSecret ,
                };
                 console.log("params",params)
                let authtoken = "";
                let responses1 = await postMethod({ url, params, authtoken });
                console.log("Claim",Claim)
                console.log("responses",responses1)
                setPaymentStatus(false)
                handleClick("success","Completed")
                setLoading2(false)
                setWalletOpen(false)
            }catch(e){
                setLoading2(false)
                setWalletOpen(false)
                handleClick("error","Try Again")
                console.log("error",e)
            }
    }else{
        setLoading2(false)
        setWalletOpen(false)
        handleClick("error","Try Again")
    }
}
    useEffect(() => {
        if (address) {
            getacc()
        }
    }, [connected])

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };
    var formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })
    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
            <Modal
                open={claimmodal}
                onClose={() => setclaimmodal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack gap={3}>
                        <div className='modal_header'>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                                <div>
                                    <h3 className="text-light fw-bold m-0">Buy Bloqs</h3>
                                </div>
                                <div className="text-center">
                                    <small onClick={() => setclaimmodal(false)} style={{ cursor: 'pointer', color: "white" }}>X</small><br />
                                </div>
                            </div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "10px" }} >

                            </div>
                        </div>
                        <div className='modal_body'>
                            <div style={{ justifyContent: "space-around", marginBottom: "10px" }}>
                                <h5 style={{ color: "#181818" }} >I want to spent</h5>
                            </div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", border: "1px solid", borderRadius: "10px", alignItems: "center", borderColor: "#e4e4e4" }} >
                                    <div>
                                        <input placeholder='250' style={{ border: "none" }} value={USDvalue} onChange={(e) => handlesetvalue(e.target.value)} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px", alignItems: "center", backgroundColor: "#e4e4e4", borderRadius: "10px" }} >
                                        <img src={metetoken} style={{ width: "40%", height: "40%" }} />
                                        <p className="text-center">USD</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "100%", padding: "10px", marginBottom: "10px" }} >
                                {/* <Slider
                                    color="blue"
                                    step={5}
                                    min={0}
                                    max={100}
                                    value={sliderval}
                                    onChange={handleslider}
                                    labels={horizontalLabels}
                                /> */}
                            </div>
                            <div style={{ justifyContent: "space-around", marginBottom: "10px" }}>
                                <h5 style={{ color: "#181818" }} >Summary</h5>
                            </div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px", padding: "5px", }} >
                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", border: "1px solid", borderRadius: "10px", alignItems: "center", borderColor: "#e4e4e4" }} >
                                    <div>
                                        <input placeholder='250' style={{ border: "none" }} value={bloqsvalue} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", alignItems: "center", backgroundColor: "#e4e4e4", borderRadius: "10px" }} >
                                        <img src={metetoken} style={{ width: "40%", height: "40%" }} />
                                        <p className="text-center">Bloqs</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center align-items-center'>
                                {
                                    paymentStatus ?
                                        <button className="metablog_primary-filled-button"
                                            // onClick={()=>swapfun()} 
                                            onClick={() => Claimbloqs()}
                                        >
                                            Claim
                                        </button>
                                        :
                                        <button className="metablog_primary-filled-button"
                                            // onClick={()=>swapfun()} 
                                            onClick={() => getstripkey()}
                                        >
                                            Continue
                                        </button>
                                }

                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", width: "100%", padding: "5px" }}>
                                <h5 style={{ color: "#181818" }} >by Continuing you agree to out cookie policy</h5>
                            </div>
                        </div>
                    </Stack>
                </Box>
            </Modal>
            <Modal
                open={confirmmodal}
                // onClose={setConfirmmodal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description" >
                <Box sx={style1}>
                    <div style={{ borderRadius: "1em" }}>
                        <div
                            style={{
                                background:
                                    "linear-gradient(90deg, #6DC6FE 0%, #0295FA 100%)",
                                borderRadius: "1em 1em 0 0 ",
                            }}
                            className="d-flex justify-content-between align-items-center py-4 px-3"
                        >
                            <h3 className="font-weight-bold m-0 text-light">Payment</h3>
                            <small
                                onClick={() => setConfirmmodal(false)}
                                style={{ cursor: "pointer", color: "white" }}
                            >
                                X
                            </small>
                        </div>
                        <div className="py-2 text-center h-100 mx-5">
                            {clientSecret && (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm clientSecret={clientSecret} data={{ amount: USDvalue, bloqs: bloqsvalue }} setConfirmmodal={setConfirmmodal} setPaymentStatus={setPaymentStatus} />
                                </Elements>
                            )}
                        </div>
                        {/* <div className="d-flex justify-content-center px-5 py-3" style={{ display: "flex", justifyContent: "space-between", width: '100%' }} >
                            <div>
                                <button
                                    onClick={() => setConfirmmodal(false)}
                                    className="metablog_primary-filled-button" >
                                    <span>Cancel </span>
                                </button>
                            </div>
                            <div>
                                <button
                                    // onClick={() => swapfun(false)}
                                    className="metablog_primary-filled-button"  >
                                    <span>Proeed </span>
                                </button>
                            </div>
                        </div> */}
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
        </div>
    )
}

export default ClaimBloqsModal