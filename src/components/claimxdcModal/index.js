import React, { useEffect, useState } from 'react';
import "./styles.css";
import { Row, Col, Stack } from "react-bootstrap";
import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Address } from 'decentraland-ui';
import ActionWallet from "../connectwallet/actionWallet";
import {
    ReactS3Client4,
    ReactS3Client2,
    postMethod,putMethod,
    ImageLoad,
    FormatDate1,
    Slicer,
} from "../../helpers/API&Helpers/index";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
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
function ClaimxdcModal(props) {
    let { claimmodal, setclaimmodal } = props;
    const returnItems = useSelector((state) => state.WalletConnect);
    const { address, connected,XDC_AirDrop ,web3 } = returnItems
    const [AirDropdata, setAirDropdata] = useState([])
    const [Selectedid, setselectedid] = useState([])
    const [SelectedAmt, SetSelectedAmt] = useState(0)

    const [walletOpen, setWalletOpen] = useState(false);
    const [Loading1, setLoading1] = useState(false);
    const [Loading2, setLoading2] = useState(false);
    const [hashValue, sethashValue] = useState("");

    const getXDCairdroplist = async () => {
        let url = "xdcAirdroplist";
        let params = {
            wallet: address,
        };
        let authtoken = "";
        let response = await postMethod({ url, params, authtoken });
        console.log("response", response.data)
        if (response.data) {
            console.log("response.data.result", response.data)
            setAirDropdata(response.data)
        }
    }
    const Claimairdrop = async() => {
        //ClaimAirDrops
        setWalletOpen(true)
        setLoading1(true)
        console.log("Selectedid",Selectedid)
        if(!Selectedid){
            alert("select")
            return 
        }   
        var time = Date.now()
        let url = "signatureXDCAirdrop";
        let amount = web3.utils.toWei(String(SelectedAmt),"")
        let params = {
            contractAddress: process.env.REACT_APP_XDCAIRDROP_CONTRACT ,
            userAddress: address , 
            amount:amount, 
            nonce:time
        };
        // console.log("params",params)
        let authtoken = "";
        let responses = await postMethod({ url, params, authtoken });
        // console.log("response",responses)
        //  console.log("response",response.signtuple)
        console.log("XDC_AirDrop.methods",XDC_AirDrop.methods)
        if(responses.signtuple){
            try{
                var Claim = await XDC_AirDrop.methods.claimAirDrops(responses.signtuple).send({from:address});
                console.log("Claim",Claim)
                let url = "UpdateXDCAirdrop";
                let params = {id:Selectedid };
                console.log("paramss",params)
                let authtoken = "";
                let response = await postMethod({ url, params, authtoken });
                console.log("response",response)
                setLoading2(true)
                getXDCairdroplist()
                setLoading1(false)
                setLoading2(false)
                setWalletOpen(false)
              }catch(err){
                setLoading1(false)
                setWalletOpen(false)
                console.log("ERROR",err)
              }
        }else{
            setLoading1(false)
            setWalletOpen(false)
        }
    }
    const handlecheckbox = (e, data) => {
        var id = data.airdrop_wallets_id
        var amt = data.airdrop_amt
        console.log("Selectedid",Selectedid)
        if (e.target.checked) {
            Selectedid.push(id)
            var data = SelectedAmt+Number(amt)
            SetSelectedAmt(data)
            
        } else {
            var amount =Math.abs(SelectedAmt-Number(amt))
            // console.log("amount",amount)
            SetSelectedAmt(amount)
            const index = Selectedid.indexOf(id);
            if (index > -1) { 
                Selectedid.splice(index, 1)
               
            }
        }
        // console.log("SelectedAmt",SelectedAmt)
    }
    useEffect(() => {
        if (address) {
            getXDCairdroplist()
        }
    }, [connected])
    return (
        <div>
            <Modal
                open={claimmodal}
                onClose={() => setclaimmodal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack gap={3}>
                        <div className='modal_header'>
                            <h4 className="text-light fw-bold m-0">Claim XDC</h4>
                            <small onClick={() => setclaimmodal(false)} style={{ cursor: 'pointer', color: "white" }}>X</small>
                        </div>
                        <div className='modal_body'>
                            <Row className="mb-2">
                                <Col className="text-left">Campaign name</Col>
                                <Col className="text-center">Amount</Col>
                                <Col className="text-right">Status</Col>
                            </Row>
                            <Row>
                                {
                                    AirDropdata.map((data) => (
                                        <>
                                            <Col className="text-left" xxl={4} xl={4} lg={4} md={4}>
                                                <div className="my-2">{data.xdcairdrop_campaign_name}</div>
                                            </Col>
                                            <Col className="text-center" xxl={4} xl={4} lg={4} md={4}>
                                                <div className="my-2">{data.airdrop_amt}</div>
                                            </Col>
                                            <Col className="text-right" xxl={4} xl={4} lg={4} md={4} >
                                                <span className="my-2">{data.airdrop_claimed_status ? "claimed" : "claim"}</span>
                                                {data.airdrop_claimed_status == false &&
                                                    <input type="checkbox" onChange={(e) => handlecheckbox(e, data)} className="ml-2" />
                                                }
                                            </Col>
                                        </>
                                    ))
                                }
                            </Row>
                            <div className='d-flex justify-content-center align-items-center'>
                                <button className="metablog_primary-filled-button" onClick={() => Claimairdrop()} >
                                    claim
                                </button>
                            </div>
                        </div>
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
    )
}

export default ClaimxdcModal