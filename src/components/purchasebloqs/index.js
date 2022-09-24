import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Image, Stack } from "react-bootstrap";
// import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { postMethod } from "../../helpers/API&Helpers";
import Swap from '../swap'
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

function PurchaseBloqsModal(props) {
    let { buyModalOpen, setBuyModalOpen, buyModalClose, playSound, data, action, from, tokenblc, Totalamt } = props;
    const metetoken = require("../../assets/logo_block.png").default
    const [successModal, setSuccessModal] = useState(false);
    const reduxItems = useSelector((state) => state.WalletConnect);
    const { wallet, address, Token, web3, Marketplace, USD } = reduxItems;

    const [Balance, setBalance] = useState(0)
    const [checkcard, setCheckcard] = useState(false)
    const [checkcrypto, setCheckcrypto] = useState(false)
    const [paymentmethod, setPaymentmethod] = useState(false)
    const [clientSecret, setClientSecret] = useState('')
    const [swapmodal, setswapmodal] = useState(false)
    const [BuyBloqsmodal, setBuyBloqs] = useState(false)
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
        var USDvalue = 1 //data.nftcollections_price*USD
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
        }
    }
    const checkconfirm = () => {
        if (!checkcard && !checkcrypto) {
            alert("Select option")
            return
        }
        if (checkcrypto) {
            setswapmodal(true)
        } else {
            setBuyBloqs(true)

        }
    }
    useEffect(() => {
        console.log("Totalamt", Totalamt)
        balance()

    }, [Totalamt])
    var formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
    });
    const handlecardradio = () => {
        setCheckcard(true)
        setCheckcrypto(false)
    }
    const handlecryptoradio = () => {
        setCheckcard(false)
        setCheckcrypto(true)
    }

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
                            <h3 className="font-weight-bold">Add fund to purchase</h3>
                        </div>
                        <div>
                            <small onClick={buyModalClose} style={{ cursor: 'pointer' }}>X</small>
                        </div>
                    </div>
                    <Stack gap={3} style={{ padding: '16px' }}>
                        {/* <small>Item</small> */}
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center",alignItems:"center" }}>
                            <div className='modal_headers' style={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "space-between",  background: "linear-gradient(90deg, #0295FA 0%, #0295FA 100%)", padding: "1em", borderRadius: "1em 1em 1em 1em" }} >
                                <div>
                                    <h3 className="font-weight-bold" style={{color:"#ffffff"}} >You Need </h3>
                                </div>
                                <div >
                                <img src={metetoken} style={{ width: "20px", height: "20px" }} />
                                    <small onClick={buyModalClose} style={{ cursor: 'pointer' ,color:"#ffffff"}}>1 BLOQS</small>
                                </div>
                            </div>
                            <div className=" d-flex" style={{ borderRadius: "10px", padding: "10px",justifyContent:"center",alignItems:'center',alignContent:"center" }}>
                                <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#ffffff", width: "80%", padding: '10px', borderRadius: "10px", justifyContent: "space-between" }} >
                                   <small> Swap xdc with BLOQS or Add funds With a Card it take up to a minute for your balance to update</small>
                                </div>
                            </div>
                        </div>
                        <div className=" d-flex" style={{ borderRadius: "10px", padding: "10px",justifyContent:"space-between"}}>
                                <div style={{ }} >
                                   <small className="font-weight-bold"  >Your Wallet </small>
                                </div>
                                <div style={{ }} >
                                <small>Balance : </small>
                                <img src={metetoken} style={{ width: "20px", height: "20px" }} />
                                   <small> {formatter.format(Balance)} BLOQS </small>
                                </div>
                            </div>
                        <>

                            <Stack gap={1}>
                                <hr />
                                <div className=" d-flex justify-content-between align-items-center">
                                    <h5>payment method </h5>
                                </div>
                                <div className=" d-flex justify-content-between align-items-center" style={{ backgroundColor: "#e4e4e4", borderRadius: "10px", padding: "10px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#ffffff", width: "45%", padding: '10px', borderRadius: "10px", justifyContent: "space-between" }} >
                                        <div>
                                            <small>Swap with XDC</small>
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
                            <Stack gap={2}>
                                <button
                                    className="metablog_primary-filled-square-button"
                                    onClick={checkconfirm}  >
                                    <span>Complete purchase</span>
                                </button>
                            </Stack>
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
            <Swap claimmodal={swapmodal} setclaimmodal={setswapmodal} />
            <BuyBloqs claimmodal={BuyBloqsmodal} setclaimmodal={setBuyBloqs} />
        </>
    );
}

export default PurchaseBloqsModal;
