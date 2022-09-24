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
import { Snackbar } from "@mui/material";
import {
    ReactS3Client4,
    ReactS3Client2,
    postMethod, putMethod,
    ImageLoad,
    FormatDate1,
    Slicer,
} from "../../helpers/API&Helpers/index";
const horizontalLabels = {
    0: "0%",
    25: "25%",
    50: "50%",
    75: "75%",
    100: "100%",
};
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "60%",
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
    const [AirDropdata, setAirDropdata] = useState([])

    const [walletOpen, setWalletOpen] = useState(false);
    const [Loading1, setLoading1] = useState(false);
    const [Loading2, setLoading2] = useState(false);
    const [hashValue, sethashValue] = useState("");
    const [XDCbalance, setXDCbalance] = useState(0)
    const [Tokenbalance, setTokenbalance] = useState(0)
    const [sliderval, setSliderval] = useState()
    const [xdcvalue, setxdcvalue] = useState(0)
    const [bloqsvalue, setbloqsvalue] = useState(0)
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [confirmmodal, setConfirmmodal] = useState(false)
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
    const handleslider = (e) => {
        // console.log("sider", e)
        setSliderval(e)
        if (XDCbalance) {
            var val = XDCbalance * (e / 100)
            setxdcvalue((val).toFixed(2))
            setbloqsvalue((val * 10000).toFixed(2))
        }
    }
    const handlesetvalue = (e) => {
        // console.log("sider", e)
        setxdcvalue(e)
        setbloqsvalue(e * 10000)
    }
    const handleClick = (type, message) => {
        setType(type);
        setMessage(message);
        setOpen(true);
    };
    const swapfun = async () => {
        if (!connected) {
            handleClick("error", "connect wallet");
            return
        }
        if (!xdcvalue) {
            handleClick("error", "Invalid Amount");
            return
        }
        var amt = web3.utils.toWei(xdcvalue, 'ether')
        try {
            setWalletOpen(true);
            setLoading1(true); setLoading2(true)
            var swap = await XDC_AirDrop.methods.SwapXDCtoMetabloqs().send({ from: address, value: amt })
            console.log("swap", swap)
        } catch (e) {
            setLoading1(false)
            setLoading2(false)
            setWalletOpen(false)
            console.log("Error", e)
        }
    }
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    useEffect(() => {
        if (address) {
            getacc()
        }
    }, [connected])

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
                                    <h4 className="text-light fw-bold m-0">Walet Balance</h4>
                                </div>
                                <div className="text-center">
                                    <small onClick={() => setclaimmodal(false)} style={{ cursor: 'pointer', color: "white" }}>X</small><br />
                                </div>
                            </div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "10px" }} >
                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px" }} >
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                        <img src={metetoken} style={{ width: "50%", height: "50%" }} />
                                        <h4 style={{ color: "white", marginLeft: '10px' }} className="text-center">XDC</h4>
                                    </div>
                                    <div className="text-center">
                                        <h5 style={{ color: "white" }} className="text-center">{formatter.format(XDCbalance)}</h5>
                                    </div>
                                </div>
                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px" }} >
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                        <img src={metetoken} style={{ width: "50%", height: "50%" }} />
                                        <h4 style={{ color: "white", marginLeft: '10px' }} className="text-center">Bloqs</h4>
                                    </div>
                                    <div className="text-center">
                                        <h5 style={{ color: "white" }} className="text-center">{formatter.format(Tokenbalance)}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal_body'>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", border: "1px solid", borderRadius: "10px", alignItems: "center", borderColor: "#e4e4e4" }} >
                                    <div>
                                        <input placeholder='250' style={{ border: "none" }} value={xdcvalue} onChange={(e) => handlesetvalue(e.target.value)} />
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
                                        <input placeholder='250' style={{ border: "none" }} value={bloqsvalue} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "5px", alignItems: "center", backgroundColor: "#e4e4e4", borderRadius: "10px" }} >
                                        <img src={metetoken} style={{ width: "40%", height: "40%" }} />
                                        <p className="text-center">Bloqs</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center align-items-center'>
                                <button className="metablog_primary-filled-button"
                                    // onClick={()=>swapfun()} 
                                    onClick={() => setConfirmmodal(true)}
                                >
                                    Swap
                                </button>
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
                            <h3 className="font-weight-bold m-0 text-light">Swap</h3>
                            <small
                                onClick={() => setConfirmmodal(false)}
                                style={{ cursor: "pointer", color: "white" }}
                            >
                                X
                            </small>
                        </div>
                        <div className="py-2 text-center h-100 mx-5">
                            <h4>Would you like to proceed</h4><br />
                        </div>
                        <div className="d-flex justify-content-center px-5 py-3" style={{display:"flex", justifyContent:"space-between",width:'100%'}} >
                            <div>
                            <button
                                onClick={() => setConfirmmodal(false)}
                                className="metablog_primary-filled-button" >
                                <span>Cancel </span>
                            </button>
                            </div>
                            <div>
                            <button
                                onClick={() => swapfun(false)}
                                className="metablog_primary-filled-button"  >
                                <span>Proeed </span>
                            </button>
                            </div>
                        </div>
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