import React, { useState } from "react"
import Select from 'react-select'
import { Grid, Button, Modal, Typography, Switch, FormControlLabel, Box } from '@mui/material'
import { Styles } from './styles'
import './modal.css';

import Price from '../../assets/price.svg'
import Auction from '../../assets/time.svg'
import { Col, Image, Row, Stack } from "react-bootstrap";
import { postMethod } from "../../helpers/API&Helpers";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import ActionWallet from "../connectwallet/actionWallet";
const putonimg = require('../../assets/putonimg.png')

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

function Modalbox(props) {
    let { show, setShow, nftsImg, data ,from,action} = props;
    const navigate = useNavigate()
    const [fixedPriceModal, setFixedPriceModal] = useState(false)
    const [timedAuctionModal, setTimedAuctionModal] = useState(false);
    const [fixedSalePrice, setFixedSalePrice] = useState("");
    const [auctionSalePrice, setAuctionSalePrice] = useState("");
    const reduxItems = useSelector((state) => state.WalletConnect);
    const { address, Collection } = reduxItems;
    const classes = Styles()
    const [auctionPeriod, setAuctionPeriod] = useState("");
     //action wallet states
    const [walletOpen, setWalletOpen] = useState(false);
    const [Loading1, setLoading1] = useState(false);
    const [Loading2, setLoading2] = useState(false);
    const [hashValue,sethashValue]= useState("");

    const method = [
        { value: 'sell to highest bidter', label: 'sell to highest bidter', },
    ]

    const fixedSalePopup = async () => {
        setFixedPriceModal(true);
        setShow(false)
    }
    const fixedSale = async () => {
        if(from=='atlas'){
            action("fixedsale",fixedSalePrice,null)
            setFixedPriceModal(false);
        }else{
        try {
            setWalletOpen(true);
            setLoading1(true);
            const NftFixedSale = await Collection.methods
                .approve(process.env.REACT_APP_Marketplace_CONTRACT, data.nftcollections_token_id)
                .send({ from: address })
            sethashValue(NftFixedSale?.hash);
            setLoading1(false);
            setLoading2(true);
            let url = "updateNft";
            let params = {
                nft_id: data.nftcollections_id,
                type: "putonsale",
                price: fixedSalePrice
            };
            let authtoken = "";
            let response = await postMethod({ url, params, authtoken });
            console.log("response", response)
            if (response.status) {
                try{
                    let url = "createActivities";
                    let params = {
                      wallet: address,
                      hash:NftFixedSale?.transactionHash,
                      from: address,
                      to: "",
                      type: "onsale",
                      price:fixedSalePrice,
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
                    navigate("/collections")
                  }catch(e){
                    console.log(e)
                  }
                setFixedPriceModal(false);
            }
            setLoading2(false);
            setWalletOpen(false);
        } catch (e) {
            setWalletOpen(false);
            setLoading1(false);
            setLoading2(false);
            console.log("fixed sale error", e)
        }
    }
    }
    const auctionSalePopup = async () => {
        setTimedAuctionModal(true);
        setShow(false)
    }
    let enddate = new Date(auctionPeriod);
    let auction_time = enddate.getTime();

    const auctionSale = async () => {
        if(from=='atlas'){
            action("auctionSale",auctionSalePrice,auction_time)
            setTimedAuctionModal(false);
        }
        else{
        try {
            setWalletOpen(true);
            setLoading1(true);
            const NftAuctionSale = await Collection.methods
                .approve(process.env.REACT_APP_Marketplace_CONTRACT, data.nftcollections_token_id)
                .send({ from: address });
            sethashValue(NftAuctionSale?.hash);
            setLoading1(false);
            setLoading2(true);
            console.log("NftFixedSale", NftAuctionSale)
            let url = "updateNft";
            let params = {
                nft_id: data.nftcollections_id,
                type: "auction",
                price: auctionSalePrice,
                auction_time: auction_time
            };
            let authtoken = "";
            let response = await postMethod({ url, params, authtoken });
            console.log("response", response)
            if (response.status) {
                try{
                    let url = "createActivities";
                    let params = {
                      wallet: address,
                      hash:NftAuctionSale.transactionHash,
                      from: address,
                      to: "",
                      type: "auction",
                      price:"",
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
                    navigate("/collections")
                  }catch(e){
                    console.log(e)
                  }
                setTimedAuctionModal(false);
            }
            setLoading2(false);
            setWalletOpen(false);
        } catch (e) {
            console.log("auction sale error", e)
            setWalletOpen(false);
            setLoading1(false);
            setLoading2(false);
        }
    }
    }
    return (
        <div>
            <Modal
                open={show}
                onClose={() => setShow(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="puton_modal-box">
                        <Stack gap={3}>
                            <div className=" d-flex justify-content-between align-items-center ">
                                <h3 className="font-weight-bold text-light">Put On Sale</h3>
                                <small onClick={() => setShow(false)} style={{ cursor: "pointer" }}>
                                    X
                                </small>
                            </div>
                            <Row>
                                <Col>
                                    <div style={{ height: "250px", borderRadius: "1em", overflow: "hidden" }} >
                                        <Image src={nftsImg} fluid alt="img" style={{ borderRadius: "1em", border: "4px solid white" }} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex  align-items-center text-dark mb-sm-3">
                                                <div onClick={fixedSalePopup} className="bg-sec-color mx-2">
                                                    <Image src={Price} alt='rg' height={30} width={30} />
                                                </div>
                                                <span>Fixed Price</span>
                                            </div>
                                            <div className="d-flex  align-items-center text-dark mb-sm-3">
                                                <div onClick={auctionSalePopup} className="bg-sec-color mx-2">
                                                    <Image src={Auction} alt='rg' height={30} width={30} />
                                                </div>
                                                <span>Timed Auction</span>
                                            </div>
                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </Stack>
                    </div>
                </Box>
            </Modal>
            <Modal open={fixedPriceModal} onClose={() => setFixedPriceModal(false)} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description" >
                <Box sx={style}>
                    <div className="uton_modal-box">
                        <Stack gap={3}>
                            <div className=" d-flex justify-content-between align-items-center ">
                                <h3 className="font-weight-bold">Fixed price</h3>
                                <small onClick={() => setFixedPriceModal(false)} style={{ cursor: "pointer" }}>
                                    X
                                </small>
                            </div>
                            <h3 className="text-center">Price</h3>
                            <div className='forinputselectsec'>
                                <input value={fixedSalePrice} onChange={(e) => setFixedSalePrice(e.target.value)}
                                    className='inputinnerselectsec' type='text' placeholder='0 BLOQS' />
                            </div>
                            <div className="d-flex justify-content-center">
                                <button onClick={fixedSale} className="metablog_primary-filled-button">
                                    List for sale
                                </button>
                            </div>
                        </Stack>
                    </div>
                </Box>
            </Modal>


            <Modal open={timedAuctionModal} onClose={() => setTimedAuctionModal(false)} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description" >
                <Box sx={style}>
                    <div className="uton_modal-box">
                        <Stack gap={3}>
                            <div className=" d-flex justify-content-between align-items-center ">
                                <h3 className="font-weight-bold">Timed Auction</h3>
                                <small onClick={() => setTimedAuctionModal(false)} style={{ cursor: "pointer" }}>
                                    X
                                </small>
                            </div>
                            <h5 >Method</h5>
                            <div className='forinputwithselectboxmethod'>
                                <Select placeholder='Sell to highest bidter' options={method} />
                            </div>
                            <h5 >Price</h5>
                            <div className='forinputselectsec'>
                                <input value={auctionSalePrice} onChange={(e) => setAuctionSalePrice(e.target.value)}
                                    className='inputinnerselectsec' type='text' placeholder='0 BLOQS' />
                            </div>
                            <h5 >Duration</h5>
                            <div className='forinputselectsec'>
                                <input type="datetime-local" value={auctionPeriod} onChange={(e) => setAuctionPeriod(e.target.value)} min={new Date()} className='inputinnerselectsec' />
                            </div>
                            <div className="d-flex justify-content-center">
                                <button onClick={auctionSale} className="metablog_primary-filled-button">
                                    List for sale
                                </button>
                            </div>
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
        </div>
    )
}

export default Modalbox