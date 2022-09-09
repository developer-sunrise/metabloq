import React, { useState, useEffect, useCallback } from "react";
import { Col, Image, Row, Stack, Tab, Tabs } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import Modal from "@mui/material/Modal";
import useSound from "use-sound";
import Bounce from "react-reveal/Bounce";
import buttonSound from "../../assets/audio/button.wav";
import NFTDetailsList from "../nftdetails/NFTDetailsList";
import Activity from "../activity";
import { Drawer, CircularProgress, Box } from "@mui/material";
import WebFilter from "../SmallComponents/WebFilter";
import Fade from "react-reveal/Fade";
import MobileFilterBtn from "../SmallComponents/MobileFilterBtn";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import { useLocation, useNavigate } from "react-router-dom";
import LandNfts from "./LandNfts";
import NFTDetails from "../nftdetailsparcels";
import { FiSearch } from "react-icons/fi";
import {
  Switch,
  FormGroup,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BuynowModal from "../buynowModal";
import Modalbox from "../modalbox/Modalbox";
import MakeOfferModal from "../makeoffermodal";
import { LocationOn, ViewModule } from "@mui/icons-material";
import {
  ReactS3Client4,
  ReactS3Client2,
  postMethod,
  FormatDate1,putMethod
} from "../../helpers/API&Helpers";
import PlacebidModal from "../placebidModal";
import CountdownTimer from "../timer/CountdownTimer";
import { useCountdown } from "../timer/useCountdown";
import ActionWallet from "../connectwallet/actionWallet";
const image = require("../../assets/profile/coverpic.png")
const loaderimg = require("../../assets/loading.gif").default
const preimg = require("../../assets/nfts/1.png").default

const urls = process.env.REACT_APP_SCAN_baseuri_HASH;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "none !important",
  boxShadow: 2,
  p: 0,
  borderRadius: "1em",
};

function CitiesHomeCollection({ selectedItem }) {
  const { width } = useWindowDimensions();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address, Marketplace, web3, Token, LandRegistry, EstateRegistry } = reduxItems;
  const [playSound] = useSound(buttonSound);
  const { id, type, data } = location.state;
  const [parcels, setParcels] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterTypeValue, setFilterTypeValue] = useState(null);
  const [onSale, setOnSale] = useState(false);
  const [Confirmmodal, setConfirmmodal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState(selectedItem ? selectedItem : null);
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [buyModalOpen2, setBuyModalOpen2] = useState(false);
  const [atlasLoader, setAtlasLoader] = useState(false);
  const [makeModalOpen, setMakeModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [highestBid, sethighestBid] = useState([]);
  const [formats, setFormats] = useState("map");
  const [activityDatas, setActivityDatas] = useState([]);
  const [adjcent, setAdjcent] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [tokenAddress, settokenAddress] = useState("");
  const [Xvalue, setxvalue] = useState(null);
  const [Yvalue, setyvalue] = useState(null);

  const [Loading, setLoading] = useState(false);
  const [imgloading, setloading] = useState(false);

  const [walletOpen, setWalletOpen] = useState(false);
  const [Loading1, setLoading1] = useState(false);
  const [Loading2, setLoading2] = useState(false);
  const [hashValue, sethashValue] = useState("");
  const [bannerImgFileName, setbannerImgFileName] = useState("");
  const [logoImgFileName, setLogoImgFileName] = useState("");
  const [CollectionNmae, setCollectionNmae] = useState("");
  const [BalanceToken, setBalance] = useState(0);
  const [Totalamt, setTotalamt] = useState(0);

  const getCoords = (x, y) => `${x},${y}`;
  const handleFormat = (event, newFormats) => {
    console.log("tesss", newFormats);
    setFormats(newFormats);
  };
  const buyModalClose2 = () => {
    setBuyModalOpen2(false);
  };
  const buyModalClose = () => {
    setBuyModalOpen(false);
  };
  const makeModalClose = () => {
    setMakeModalOpen(false);
  };
  const placeModalClose = () => {
    setPlaceModalOpen(false);
  };
  const onSelectGrid = (item) => {
    console.log("onSelectGrid",item)
    if (item.length > 0) {
      setSelectedGrid(item);
      getMakeOffers(item[0]);
      getItemActivity(item[0]);
      findAdjcent(item);
    } else {
      setSelectedGrid(null);
      dispatch({ type: "ADJCENT", payload: [] });
    }
    setFormats("map");
  };
  const getDetails = useCallback(
    (x, y) => {
      const id = getCoords(x, y);
      const tile = parcels[id];
      return tile;
    },
    [parcels]
  );
  const price = () => {
    let total = 0;
    selectedGrid.map((item) => {
      total = total + getDetails(item.x, item.y)?.bloqs_price;
    });
    return total;
  };
  const owner = () => {
    let owner = "";
    selectedGrid.map((item) => {
      owner = getDetails(item.x, item.y)?.owner;
    });
    if (owner) {
      return owner;
    } else {
      return "";
    }
  };
  const auctionTime = () => {
    let auction_time = 0;
    selectedGrid.map((item) => {
      auction_time = getDetails(item.x, item.y)?.auction_time;
    });
    if (auction_time != 0) {
      return auction_time;
    } else {
      return 0;
    }
  };
  const status = () => {
    let status = "";
    selectedGrid.map((item) => {
      status = getDetails(item.x, item.y)?.status;
    });
    if (status != "") {
      return status;
    } else {
      return "";
    }
  };
  const isMinted = () => {
    let minted = false;
    selectedGrid.map((item) => {
      minted = getDetails(item.x, item.y)?.isMinted;
    });
    if (minted) {
      return true;
    } else {
      return false;
    }
  };
  const buyClick = () => {
    if (selectedGrid.length == 1) {
      const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
      var parcelsSelected = parcels;
      let amt = parcelsSelected[id].bloqs_price;
      console.log("amt",amt)
      setTotalamt(amt)
    }else{
      var parcelsSelected = parcels;
      let price = 0;
      selectedGrid.map((item) => {
        price = price + parcelsSelected[id].bloqs_price;
      });
      let amt = price;
      let amt2 = amt.toString();
      setTotalamt(amt2)
    }
    setBuyModalOpen(true);
    playSound();
  };
  const buyClick2 = () => {
    if (selectedGrid.length == 1) {
      const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
      var parcelsSelected = parcels;
      let amt = parcelsSelected[id].bloqs_price;
      console.log("amt",amt)
      setTotalamt(amt)
    }else{
      var parcelsSelected = parcels;
      let price = 0;
      selectedGrid.map((item) => {
        price = price + parcelsSelected[id].bloqs_price;
      });
      let amt = price;
      let amt2 = amt.toString();
      setTotalamt(amt2)
    }
    setBuyModalOpen2(true)
  };
  const makeofferClick = () => {
    if (selectedGrid.length == 1) {
      const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
      var parcelsSelected = parcels;
      let amt = parcelsSelected[id].bloqs_price;
      console.log("amt",amt)
      setTotalamt(amt)
    }else{
      var parcelsSelected = parcels;
      let price = 0;
      selectedGrid.map((item) => {
        price = price + parcelsSelected[id].bloqs_price;
      });
      let amt = price;
      let amt2 = amt.toString();
      setTotalamt(amt2)
    }
    setMakeModalOpen(true)
  };
  const executeOrder = async (signtuple) => {
    try {
      const acceptOffer = await Marketplace.methods
        .executeOrder(signtuple)
        .send({ from: address });
      return acceptOffer;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  // adjcent
  const findAdjcent = async (data) => {
    console.log("data", data);
    let arr = selectedGrid == null ? [...data] : [...selectedGrid, ...data];
    let newArr = [];
    console.log("tesss", arr)
    arr.map((item) => {
      newArr.push(
        {
          x: item.x + 1,
          y: item.y,
        },
        {
          x: item.x - 1,
          y: item.y,
        },
        {
          x: item.x,
          y: item.y + 1,
        },
        {
          x: item.x,
          y: item.y - 1,
        }
      );
    });
    console.log("newwewew", newArr);
    var parcelsSelected = parcels;
    console.log("parcelsSelected",parcels)
    let newArr2 = [];
    newArr.map((item) => {
      let id = getCoords(item.x, item.y);
      let tile = parcelsSelected[id];
      if (tile.type == 9) {
        newArr2.push(item);
      }
    });
    console.log("newArr2", newArr2);
    let uniqueArr = newArr2.filter(
      (v, i, a) => a.findIndex((v2) => v2.x === v.x && v2.y === v.y) === i
    );
    console.log("uniqueArr", uniqueArr);
    setAdjcent(uniqueArr);
    dispatch({ type: "ADJCENT", payload: uniqueArr });

  };
  //   balance
  const balance = async (address, amtInWei) => {
    try {
      const balance = await Token.methods.balanceOf(address).call();

      console.log(
        "Ddd",
        parseInt(balance) > amtInWei,
        parseInt(balance),
        amtInWei
      );
      if (parseInt(balance) > amtInWei) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
      console.log(e);
    }
  };
  // buy for 1st time (mint) from contract
  const buy = async () => {
    var filename =
      data?.collection_land_json?.split("/")?.pop()?.split(".")?.shift() +
      ".json";
    console.log("start", filename, selectedGrid);
    if (selectedGrid == null) {
      console.log("selectedGrid null");
      return;
    }
    if (selectedGrid.length == 1) {
      setWalletOpen(true)
      setLoading1(true)
      let Staticimgurl =
        "https://pbs.twimg.com/media/FD_IeOOXIA4JiIj.jpg:large";
      const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
      var parcelsSelected = parcels;
      parcelsSelected[id] = {
        ...parcelsSelected[id],
        type: 9,
        owner: address,
        isMinted: true,
        status: "Mint",
        name: "xdc new contract test",
      };
      let amt = parcelsSelected[id].bloqs_price;
      let amt2 = amt.toString();
      let priceInWei = web3.utils.toWei(amt2, "ether");
      try {
        const allowance = await Token.methods
          .allowance(address, process.env.REACT_APP_Marketplace_CONTRACT)
          .call();
        if (allowance < priceInWei) {
          const approveToken = await Token.methods
            .approve(
              process.env.REACT_APP_Marketplace_CONTRACT,
              "999999999999999999999"
            )
            .send({ from: address });
          console.log("approveToken", approveToken);
        }
        try {
          console.log("ssss");

          let date = new Date();
          let timestamp = date.getTime();
          let url = "signature";
          let params = {
            seller: address,
            buyer: address,
            nftAddress: address,
            amount: priceInWei,
            tokenId: 1,
            nonce: timestamp,
          };
          let authtoken = "";
          let response = await postMethod({ url, params, authtoken });
          console.log("fghj", response);
          if (response?.status) {
            try {
              const mintNFT = await Marketplace.methods
                .mintLands(
                  selectedGrid[0].x,
                  selectedGrid[0].y,
                  Staticimgurl,
                  response.signtuple
                )
                .send({ from: address });
              console.log("tesss", mintNFT);
              console.log("start", filename);
              const jsonData = await ReactS3Client2.uploadFile(
                JSON.stringify({
                  ok: true,
                  data: parcelsSelected,
                }),
                filename
              ); // for json update
              console.log("tesss", jsonData);
              if (jsonData.status == 204) {
                const tokenId = await LandRegistry.methods
                  .getlandIds(selectedGrid[0].x, selectedGrid[0].y)
                  .call();
                try {
                  let url = "createActivities";
                  let params = {
                    wallet: address,
                    hash: mintNFT?.transactionHash,
                    from: address,
                    to: "",
                    type: "Mint",
                    price: amt,
                    quantity: 1,
                    collection: data.collection_id,
                    nft: tokenId,
                    transfer: "transfered",
                    Land: true,
                  };
                  let authtoken = "";
                  let response = await postMethod({
                    url,
                    params,
                    authtoken,
                  });

                  setLoading1(false)
                  setLoading2(true)
                  getdata();
                  setLoading2(false)
                  setWalletOpen(false)
                } catch (e) {
                  setLoading1(false)
                  setWalletOpen(false)
                  console.log(e);
                }
                // setTimeout(window.location.reload(), 3000);
              }
            } catch (err) {
              setWalletOpen(false)
              console.log("err", err);
              alert("failed");
            }
          }
        } catch (err) {
          setWalletOpen(false)
          setLoading1(false)
          console.log("err in signature", err);
        }
      } catch (err) {
        setWalletOpen(false)
        setLoading1(false)
        console.log("allowance", err);
      }
    } else {
      setWalletOpen(true)
      setLoading1(true)
      console.log("start bulk", selectedGrid);
      let x = [];
      let y = [];
      let uri = [];
      var parcelsSelected = parcels;
      let price = 0;
      selectedGrid.map((item) => {
        x.push(item.x);
        y.push(item.y);
        uri.push("https://pbs.twimg.com/media/FD_IeOOXIA4JiIj.jpg:large");
        var id = getCoords(item.x, item.y);
        parcelsSelected[id] = {
          ...parcelsSelected[id],
          type: 9,
          owner: address,
          name: "xdc new contract test bulk",
          isMinted: true,
          status: "Mint",
        };
        price = price + parcelsSelected[id].bloqs_price;
      });
      let amt = price;
      let amt2 = amt.toString();
      let priceInWei = web3.utils.toWei(amt2, "ether");

      try {
        const allowance = await Token.methods
          .allowance(address, process.env.REACT_APP_Marketplace_CONTRACT)
          .call();
        if (allowance < priceInWei) {
          const approveToken = await Token.methods
            .approve(
              process.env.REACT_APP_Marketplace_CONTRACT,
              "999999999999999999999"
            )
            .send({ from: address });
          console.log("approveToken", approveToken);
        }
        try {
          let date = new Date();
          let timestamp = date.getTime();
          let url = "signature";
          let params = {
            seller: address,
            buyer: address,
            nftAddress: address,
            amount: priceInWei,
            tokenId: 1,
            nonce: timestamp,
          };
          let authtoken = "";
          let response = await postMethod({ url, params, authtoken });
          console.log("fghj", response);
          if (response?.status) {
            try {
              const mintNFT = await Marketplace.methods
                .mintsMultipleLands(x, y, uri, response.signtuple)
                .send({ from: address });
              console.log(" bulk", mintNFT);
              const jsonData = await ReactS3Client2.uploadFile(
                JSON.stringify({
                  ok: true,
                  data: parcelsSelected,
                }),
                filename
              ); // for json update
              console.log("tesss", jsonData);
              if (jsonData.status == 204) {
                const tokenId = await LandRegistry.methods
                  .getlandIds(selectedGrid[0].x, selectedGrid[0].y)
                  .call();
                try {
                  let url = "createActivities";
                  let params = {
                    wallet: address,
                    hash: mintNFT?.transactionHash,
                    from: address,
                    to: "",
                    type: "Mint",
                    price: amt,
                    quantity: 1,
                    collection: data.collection_id,
                    nft: tokenId,
                    transfer: "transfered",
                    Land: true,
                  };
                  let authtoken = "";
                  let response = await postMethod({
                    url,
                    params,
                    authtoken,
                  });
                  setLoading1(false)
                  setLoading2(true)
                  getdata()
                  setLoading2(false)
                  setWalletOpen(false)
                } catch (e) {
                  setWalletOpen(false)
                  setLoading1(false)
                  console.log(e);
                }
                // setTimeout(window.location.reload(), 3000);
              }
              // setTimeout(window.location.reload(), 3000);
            } catch (err) {
              setWalletOpen(false)
              setLoading1(false)
              console.log("err bulk", err);
            }
          }
        } catch (err) {
          setWalletOpen(false)
          setLoading1(false)
          console.log("err in signature", err);
        }
      } catch (err) {
        setWalletOpen(false)
        setLoading1(false)
        console.log("allowance", err);
      }
    }
  };
  // putonsale and bid
  const action = async (type, price, time) => {
    try {
      const tokenId = await LandRegistry.methods
        .getlandIds(selectedGrid[0].x, selectedGrid[0].y)
        .call();

      if (type == "fixedsale") {
        putonsale(tokenId, price, time);
      } else {
        putonaction(tokenId, price, time);
      }
    } catch (err) {
      console.log("ddsds", err);
    }
  };
  // putonsale
  const putonsale = async (tokenId, price, time) => {
    try {
      setWalletOpen(true)
      setLoading1(true)
      console.log("tokenIdtokenId", tokenId);
      const NftFixedSale = await LandRegistry.methods
        .approve(process.env.REACT_APP_Marketplace_CONTRACT, tokenId)
        .send({ from: address });
      console.log("tesss", NftFixedSale);
      const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
      var parcelsSelected = parcels;
      parcelsSelected[id] = {
        ...parcelsSelected[id],
        type: 1,
        status: "onsale",
        bloqs_price: price,
      };
      var filename =
        data?.collection_land_json?.split("/")?.pop()?.split(".")?.shift() +
        ".json";
      const jsonData = await ReactS3Client2.uploadFile(
        JSON.stringify({
          ok: true,
          data: parcelsSelected,
        }),
        filename
      ); // for json update
      console.log("json updateee", jsonData);
      if (jsonData.status == 204) {
        try {
          let url = "createActivities";
          let params = {
            wallet: address,
            hash: NftFixedSale?.transactionHash,
            from: address,
            to: "",
            type: "onsale",
            price: price,
            quantity: 1,
            collection: data.collection_id,
            nft: tokenId,
            transfer: "",
            Land: true,
          };
          let authtoken = "";
          let response = await postMethod({
            url,
            params,
            authtoken,
          });
          console.log("response", response)
          setLoading1(false)
          setLoading2(true)
          getdata()
          setWalletOpen(false)
          setLoading2(false)
        } catch (e) {
          setWalletOpen(false)
          setLoading1(false)
          console.log(e);
        }
        // setTimeout(window.location.reload(), 3000);
      }
      // setTimeout(window.location.reload(), 3000);
    } catch (err) {
      setWalletOpen(false)
      setLoading1(false)
      console.log("dsdds", err);
    }
  };
  // auction
  const putonaction = async (tokenId, price, time) => {
    try {
      console.log("tokenIdtokenId", tokenId);
      const NftAuction = await LandRegistry.methods
        .approve(process.env.REACT_APP_Marketplace_CONTRACT, tokenId)
        .send({ from: address });
      console.log("tesss", NftAuction);
      const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
      var parcelsSelected = parcels;
      parcelsSelected[id] = {
        ...parcelsSelected[id],
        type: 2,
        status: "auction",
        bloqs_price: price,
        auction_time: time,
      };
      var filename =
        data?.collection_land_json?.split("/")?.pop()?.split(".")?.shift() +
        ".json";
      const jsonData = await ReactS3Client2.uploadFile(
        JSON.stringify({
          ok: true,
          data: parcelsSelected,
        }),
        filename
      ); // for json update
      console.log("json updateee actionnn", jsonData);
      if (jsonData.status == 204) {
        try {
          let url = "createActivities";
          let params = {
            wallet: address,
            hash: NftAuction?.transactionHash,
            from: address,
            to: "",
            type: "onsale",
            price: price,
            quantity: 1,
            collection: data.collection_id,
            nft: tokenId,
            transfer: "",
            Land: true,
          };
          let authtoken = "";
          let response = await postMethod({
            url,
            params,
            authtoken,
          });
        } catch (e) {
          console.log(e);
        }
        // setTimeout(window.location.reload(), 3000);
      }
      // setTimeout(window.location.reload(), 3000);
    } catch (err) {
      console.log("dsdds", err);
    }
  };
  // make offer
  const makeOffer = async (price) => {
    const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
    var parcelsSelected = parcels;
    console.log(parcelsSelected[id].owner);
    try {
      setWalletOpen(true)
      setLoading1(true)
      const tokenId = await LandRegistry.methods
        .getlandIds(selectedGrid[0].x, selectedGrid[0].y)
        .call();
      console.log("SSSSSSs", price, tokenId);
      let priceInWei = web3.utils.toWei(price, "ether");
      const makeOffer = await Token.methods
        .approve(process.env.REACT_APP_Marketplace_CONTRACT, priceInWei)
        .send({ from: address });
      console.log("makeOffer", makeOffer);
      let url = "makeofferAndBidLand";
      let params = {
        nft_id: tokenId,
        wallet: address,
        amount: price,
        type: "makeoffer",
        hash: makeOffer?.transactionHash,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("make offer response", response);
      if (response.status) {
        try {
          let url = "createActivities";
          let params = {
            wallet: address,
            hash: makeOffer?.transactionHash,
            from: makeOffer?.from,
            to: address,
            type: "makeoffer",
            price: price,
            quantity: 1,
            collection: data.collection_id,
            nft: tokenId,
            transfer: "",
            Land: true,
          };
          let authtoken = "";
          let response = await postMethod({
            url,
            params,
            authtoken,
          });
          setLoading1(false)
          setLoading2(true)
          getdata()
          setWalletOpen(false)
          setLoading2(false)
        } catch (e) {
          setWalletOpen(false)
          setLoading2(false)
          console.log(e);
        }
      }
    } catch (err) {
      setWalletOpen(false)
      setLoading2(false)
      console.log("ddsds", err);
    }
  };
  // place bid
  const placeBid = async (price) => {
    console.log("ddddddddbifddddd", price);
    try {
      setWalletOpen(true)
      setLoading1(true)
      const tokenId = await LandRegistry.methods
        .getlandIds(selectedGrid[0].x, selectedGrid[0].y)
        .call();
      console.log("SSSSSSs", price, tokenId);
      let priceInWei = web3.utils.toWei(price, "ether");
      const placebid = await Token.methods
        .approve(process.env.REACT_APP_Marketplace_CONTRACT, priceInWei)
        .send({ from: address });
      console.log("makeOffer", placebid);
      let url = "makeofferAndBidLand";
      let params = {
        nft_id: tokenId,
        wallet: address,
        amount: price,
        type: "bid",
        hash: placebid?.transactionHash,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("bid response", response);
      if (response.status) {
        try {
          let url = "createActivities";
          let params = {
            wallet: address,
            hash: placebid?.transactionHash,
            from: placebid?.from,
            to: address,
            type: "bid",
            price: price,
            quantity: 1,
            collection: data.collection_id,
            nft: tokenId,
            transfer: "",
          };
          let authtoken = "";
          let response = await postMethod({
            url,
            params,
            authtoken,
          });
          setLoading1(false)
          setLoading2(true)
          getdata()
          setWalletOpen(false)
          setLoading2(false)
        } catch (e) {
          setWalletOpen(false)
          setLoading1(false)
          console.log(e);
        }
      }
    } catch (err) {
      setWalletOpen(false)
      setLoading1(false)
      console.log("ddsds", err);
    }
  };
  //buy
  const realBuy = async () => {
    try {
      setWalletOpen(true)
      setLoading1(true)
      var parcelsSelected = parcels;
      const tokenId = await LandRegistry.methods
        .getlandIds(selectedGrid[0].x, selectedGrid[0].y)
        .call();
      const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
      let tile = parcelsSelected[id];
      console.log("dsddssd", tile);
      let priceInWei = web3.utils.toWei(tile.bloqs_price, "ether");
      console.log("priceInWei", priceInWei);
      var checkblc = await balance(address, priceInWei)
      console.log("checkblc", checkblc)
      if (checkblc) {
        let date = new Date();
        let timestamp = date.getTime();
        let url = "signature";
        let params = {
          seller: tile.owner,
          buyer: address,
          nftAddress: process.env.REACT_APP_LAND_REGISTRY_CONTRACT,
          amount: priceInWei,
          tokenId: tokenId,
          nonce: timestamp,
        };
        let authtoken = "";
        let signresponse = await postMethod({ url, params, authtoken });
        if (signresponse.status) {
          const accept = await executeOrder(signresponse.signtuple);
          if (accept) {
            parcelsSelected[id] = {
              ...parcelsSelected[id],
              type: 9,
              owner: address,
              status: "Mint",
            };
            var filename =
              data?.collection_land_json
                ?.split("/")
                ?.pop()
                ?.split(".")
                ?.shift() + ".json";
            const jsonData = await ReactS3Client2.uploadFile(
              JSON.stringify({
                ok: true,
                data: parcelsSelected,
              }),
              filename
            );
            if (jsonData.status == 204) {
              try {
                let url = "createActivities";
                let params = {
                  wallet: address,
                  hash: accept?.transactionHash,
                  from: tile.owner,
                  to: address,
                  type: "buy",
                  price: tile.bloqs_price,
                  quantity: 1,
                  collection: data.collection_id,
                  nft: tokenId,
                  transfer: "transfered",
                };
                let authtoken = "";
                let response = await postMethod({
                  url,
                  params,
                  authtoken,
                });
                setLoading1(false)
                setLoading2(true)
                getdata()
                setWalletOpen(false)
                setLoading2(false)
              } catch (e) {
                console.log(e);
              }
              // setTimeout(window.location.reload(), 3000);
            }
            console.log("jsonData", jsonData);
          }
        }
      } else {
        setWalletOpen(false)
        setLoading1(false)
        console.log("check balanceeee");
      }
    } catch (err) {
      setWalletOpen(false)
      setLoading1(false)
      console.log("ddd", err);
    }
  };
  // accept make offer
  const acceptMakeOffer = async (buyerAddress, amt, token) => {
    let priceInWei = web3.utils.toWei(amt.toString(), "ether");
    if (await balance(buyerAddress, priceInWei)) {

      try {
        setWalletOpen(true)
        setLoading1(true)
        let date = new Date();
        let timestamp = date.getTime();
        let url = "signature";
        let params = {
          seller: address,
          buyer: buyerAddress,
          nftAddress: process.env.REACT_APP_LAND_REGISTRY_CONTRACT,
          amount: priceInWei,
          tokenId: token,
          nonce: timestamp,
        };
        let authtoken = "";
        let signresponse = await postMethod({ url, params, authtoken });
        if (signresponse.status) {
          const accept = await executeOrder(signresponse.signtuple);
          if (accept) {
            var parcelsSelected = parcels;
            const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
            parcelsSelected[id] = {
              ...parcelsSelected[id],
              type: 9,
              owner: buyerAddress,
              status: "Mint",
            };
            var filename =
              data?.collection_land_json
                ?.split("/")
                ?.pop()
                ?.split(".")
                ?.shift() + ".json";
            const jsonData = await ReactS3Client2.uploadFile(
              JSON.stringify({
                ok: true,
                data: parcelsSelected,
              }),
              filename
            );
            if (jsonData.status == 204) {
              try {
                let url = "createActivities";
                let params = {
                  wallet: address,
                  hash: accept?.transactionHash,
                  from: address,
                  to: buyerAddress,
                  type: "transfer",
                  price: amt,
                  quantity: 1,
                  collection: data.collection_id,
                  nft: token,
                  transfer: "transfered",
                  Land: true,
                };
                let authtoken = "";
                let response = await postMethod({
                  url,
                  params,
                  authtoken,
                });
                setLoading2(true)
                getdata()
                setWalletOpen(false)
                setLoading2(false)
              } catch (e) {
                setWalletOpen(false)
                setLoading1(false)
                console.log(e);
              }
              // setTimeout(window.location.reload(), 3000);
            }
            console.log("jsonData", jsonData);
          }
        }
      } catch (e) {
        setWalletOpen(false)
        setLoading1(false)
        console.log(e);
      }
    } else {
      alert("check balance");
    }
  };
  // place bid
  const transferNft = async (buyerAddress, amt, token) => {
    let priceInWei = web3.utils.toWei(amt.toString(), "ether");
    if (await balance(buyerAddress, priceInWei)) {
      try {
        let date = new Date();
        let timestamp = date.getTime();
        let url = "signature";
        let params = {
          seller: address,
          buyer: buyerAddress,
          nftAddress: process.env.REACT_APP_LAND_REGISTRY_CONTRACT,
          amount: priceInWei,
          tokenId: token,
          nonce: timestamp,
        };
        let authtoken = "";
        let signresponse = await postMethod({ url, params, authtoken });
        if (signresponse.status) {
          const accept = await executeOrder(signresponse.signtuple);
          if (accept) {
            var parcelsSelected = parcels;
            const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
            parcelsSelected[id] = {
              ...parcelsSelected[id],
              type: 9,
              owner: buyerAddress,
              status: "Mint",
            };
            var filename =
              data?.collection_land_json
                ?.split("/")
                ?.pop()
                ?.split(".")
                ?.shift() + ".json";
            const jsonData = await ReactS3Client2.uploadFile(
              JSON.stringify({
                ok: true,
                data: parcelsSelected,
              }),
              filename
            );
            if (jsonData.status == 204) {
              try {
                let url = "createActivities";
                let params = {
                  wallet: address,
                  hash: accept?.transactionHash,
                  from: address,
                  to: buyerAddress,
                  type: "transfer",
                  price: amt,
                  quantity: 1,
                  collection: data.collection_id,
                  nft: token,
                  transfer: "transfered",
                  Land: true,
                };
                let authtoken = "";
                let response = await postMethod({
                  url,
                  params,
                  authtoken,
                });
              } catch (e) {
                console.log(e);
              }
              // setTimeout(window.location.reload(), 3000);
            }
            console.log("jsonData", jsonData);
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("err while transfered");
    }
  };

  // rejectMakeOffer
  const rejectMakeOffer = async (id, token) => {
    try {
      let url = "rejectOfferLand";
      let params = {
        offer_bid_id: id,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      if (response.status) {
        let url = "deleteOfferLand";
        let params = {
          offer_bid_nft_token_id: token,
        };
        let authtoken = "";
        let response = await postMethod({ url, params, authtoken });
        getMakeOffers(selectedGrid[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const usertokenbalance = async () => {
    try {
      var balance = await Token.methods.balanceOf(address).call();
      balance =web3.utils.fromWei(balance,'ether')
      console.log("balance",balance)
      setBalance(balance)
    }catch{
      console.log("ERROR")
    }
  }
  // relist
  const relist = async () => {
    setLoading(true)
    const tokenId = await LandRegistry.methods
      .getlandIds(selectedGrid[0].x, selectedGrid[0].y)
      .call();
    const id = getCoords(selectedGrid[0].x, selectedGrid[0].y);
    console.log("TOKEN ID", tokenId)
    var parcelsSelected = parcels;
    parcelsSelected[id] = {
      ...parcelsSelected[id],
      type: 9,
      status: "Mint",
    };
    var filename =
      data?.collection_land_json?.split("/")?.pop()?.split(".")?.shift() +
      ".json";
    const jsonData = await ReactS3Client2.uploadFile(
      JSON.stringify({
        ok: true,
        data: parcelsSelected,
      }),
      filename
    );

    console.log("json updateee actionnn", jsonData);
    let url = "createActivities";
    let params = {
      wallet: address,
      hash: "",
      from: address,
      to: "",
      type: "Delist",
      price: 0,
      quantity: 1,
      collection: data.collection_id,
      nft: tokenId,
      transfer: "",
      Land: true,
    };
    let authtoken = "";
    let response = await postMethod({
      url,
      params,
      authtoken,
    });
    console.log("response", response)
    getdata()
    setLoading(false)
  };
  // create esate
  const createEstate = async () => {
    console.log("createEstatecreateEstate", selectedGrid);

    try {
      const EstateLastMintId = await EstateRegistry.methods.totalSupply().call();
      var Estatemintid = parseInt(EstateLastMintId) + 1;
      console.log("LastMintId", Estatemintid);
      var filename =
        data?.collection_land_json?.split("/")?.pop()?.split(".")?.shift() +
        ".json";
      let x = [];
      let y = [];
      var parcelsSelected = parcels;
      selectedGrid.map((item) => {
        x.push(item.x);
        y.push(item.y);
        var id = getCoords(item.x, item.y);
        parcelsSelected[id] = {
          ...parcelsSelected[id],
          type: 3,
          isEstate: true,
          estateId: Estatemintid,
          top: 1,
          left: 1,
          topLeft: 1,
        };
      });
      try {
        const estateCreate = await LandRegistry.methods
          .createEstate(x, y, address)
          .send({ from: address });
        const jsonData = await ReactS3Client2.uploadFile(
          JSON.stringify({
            ok: true,
            data: parcelsSelected,
          }),
          filename
        ); // for json update
        console.log("estate update", jsonData);
      } catch (err) {
        console.log("ERRR", err);
      }
    } catch (err) {
      console.log("dddd", err);
    }
  };

  const getdata = async () => {
    setAtlasLoader(true);
    const res = await fetch(data?.collection_land_json, { cache: "no-store" });
    const json = await res.json();
    setAtlasLoader(false);
    console.log("resss", json?.ok);
    console.log("getdata", json);
    if (json.ok) {
      setParcels(json.data);
    }
  };

  const getMakeOffers = async (item) => {
    try {
      const tokenId = await LandRegistry.methods
        .getlandIds(item.x, item.y)
        .call();
      // console.log("dff", tokenId);
      if (tokenId) {
        settokenAddress(tokenId);
        try {
          let url = "getNftOffersAndBidOffersLand";
          let params = {
            nft_id: tokenId,
          };
          let authtoken = "";
          let response = await postMethod({ url, params, authtoken });
          if (response.status) {
            setOfferData(response.resultOffers);
            setBidData(response.resultNftBids);
            const result = response.resultNftBids.map((data, i) => {
              return data.offer_bid_amount;
            });
            sethighestBid(result);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getItemActivity = async (item) => {
    const tokenId = await LandRegistry.methods
      .getlandIds(item.x, item.y)
      .call();
    console.log("tokenId item activity", tokenId);
    if (tokenId) {
      try {
        let url = "getNftTransferActivitesLand" //"getNftTransferActivites";
        let params = {
          token_id: tokenId,
        };
        let authtoken = "";
        let response = await postMethod({ url, params, authtoken });
        console.log("response in item acivity", response);
        if (response.status) {
          setActivityDatas(response.resultAllActivites);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const jsonUpdation = () => {
    return (
      <p>time over</p>
    )
  }
  const insertImageintoS3 = async (e, type) => {

    var file = e.target.files[0];
    var date = new Date();
    var timeStamp = date.getTime();
    let name = file.name;
    let extension = "." + name.split(".").pop();
    let filename = timeStamp + type + extension;
    try {
      setloading(true)
      // console.log("filename", filename, file);
      const data = await ReactS3Client4.uploadFile(file, filename);
      console.log("data",data)
      if (data.status === 204) {
        console.log("type",type)
        if (type == "Logo") {
          console.log("data.location ,logo",data.location)
          setLogoImgFileName(data.location)
          setloading(false)
        } else if (type == "Banner") {
          console.log("data.location ,Banner",data.location)
          setbannerImgFileName(data.location);
          setloading(false)
        }
      } else {
        setloading(false)
      }
    } catch (err) {
      console.log("error image uploading", err);
      setloading(false)
    }
  };
  const Updatecollection =async()=>{
    let url = "updatecollection";
    let method ="put";
    let params = {
      collection_name:CollectionNmae,
      collection_id:data.collection_id ,
      banner_image:bannerImgFileName,
      logo_image:logoImgFileName
    };
    console.log("params",params)
    let authtoken = "";
    try{
      let response = await postMethod({
        url,
        params,
        authtoken,
      });
      console.log("response",response)
      navigate('/')
    }catch(err){
      console.log("Error",err)
    }
  
  }
  useEffect(() => {
    if(data){
      setCollectionNmae(data.collection_name)
      setLogoImgFileName(data.collection_logo_image)
      setbannerImgFileName(data.collection_banner_image)
    }
    if(location.state.item){
      console.log("state",location.state.item)
      // setTimeout(function() {  onSelectGrid(location.state.item)}, 8000);
      // onSelectGrid(location.state.item)
    }

    getdata();
  }, [data]);
  useEffect(()=>{
    if(address){
      usertokenbalance()
    }
  },[address])
  return (
    <div className="metabloq_container">
      <Fade bottom>
        <div className="collections_home-wrapper">
          <div className="collections_home-banner">
            <Image
              fluid
              src={data?.collection_banner_image}
              style={{
                height: "150px",
                width: "100%",
                objectFit: "cover",
                borderRadius: "1em 1em 0 0",
              }}
            />
          </div>
          <div className="px-sm-3 h-100 collection_logo-preview d-flex align-items-end">
            <Image
              fluid
              src={data?.collection_logo_image}
              alt="profile"
              style={{
                borderRadius: "1em",
                border: "5px solid white",
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                height: width > 600 ? "170px" : "150px",
                width: width > 600 ? "170px" : "150px"
              }}
            />
            <div className="mx-3">
              <h2>{data?.collection_name}</h2>
              <span>created by {data?.collection_wallet.slice(0, 5) + "..." + data?.collection_wallet.slice(-5)}</span>
            </div>
            <div className="mx-3">
              {/* <h2>{data?.collection_name}</h2> */}
              <span> </span>
              <button
                onClick={() => setConfirmmodal(true)}
                className="mr-2 nftcollection_mobile-category" >
                <span>Edit</span>
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-start align-items-center h-100 mb-sm-3">
            {/* <Stack gap={width > 600 ? "5" : "2"} direction="horizontal">
              <div className="d-flex flex-column ">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">9.4k</span>
                    <small>Items</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">9.4k</h3>
                    <span>Items</span>
                  </>
                )}
              </div>
              <div className="d-flex flex-column ">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">5.7k</span>
                    <small>Owners</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">5.7k</h3>
                    <span>Owners</span>
                  </>
                )}
              </div>

              <div className="d-flex flex-column ">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">8.9k</span>
                    <small>Total volume</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">8.9k</h3>
                    <span>Total volume</span>
                  </>
                )}
              </div>
              <div className="d-flex flex-column">
                {width < 600 ? (
                  <>
                    <span className="fw-bold">1.85</span>
                    <small>Floor price</small>
                  </>
                ) : (
                  <>
                    <h3 className="fw-bold">1.85</h3>
                    <span>Floor price</span>
                  </>
                )}
              </div>
            </Stack> */}
          </div>
        </div>
      </Fade>
      <hr style={{ margin: "20px 0", borderTop: ".8px solid lightgray" }} />
      {
        // !selectedGrid &&
        <div className="d-flex mb-4 align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {/* <FiSearch size={20} /> */}
            {/* <input
              type="text"
              placeholder="NFTs Name"
              className="input-revert"
            /> */}
          </div>
          <div className="d-flex align-items-center justify-content-between">
            {formats != "map" ?
              <>
                {/* <select
              id="cars"
              name="carlist"
              form="carform"
              className="input-revert mr-4"
              onChange={(e) => {
                if (e.target.value == "") {
                  setFilterTypeValue(null);
                } else {
                  setFilterTypeValue(e.target.value);
                }
              }}
            >
              <option value={""}>Filter</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value={{ start: "0", to: "1" }}>5 too</option>
            </select> */}
                <select
                  id="cars"
                  name="carlist"
                  form="carform"
                  className="input-revert mr-4"
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setFilterType(null);
                    } else {
                      setFilterType(e.target.value);
                    }
                  }}
                >
                  <option value={""}>Filter</option>
                  <option value="8">8-Public places</option>
                  <option value="1">1-parcels on sale</option>
                  <option value="2">2-parcels on aution</option>
                  <option value="9">9-Already owned</option>
                  <option value="11">11-Available (ready to buy)</option>
                  <option value="12">12-comming soon (under process)</option>
                </select>
              </>
              :
              null
            }


            {formats != "map" &&
              <>
                <input
                  type="text"
                  placeholder="X value"
                  className="input-revert"
                  onChange={(e) => setxvalue(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Y value"
                  className="input-revert"
                  onChange={(e) => { console.log("Xvalue", Xvalue); setyvalue(e.target.value) }}
                />
              </>
            }
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={onSale}
                    onChange={() => {
                      setOnSale((e) => !e);
                    }}
                  />
                }
                label="onSale"
              />
            </FormGroup>
            <ToggleButtonGroup
              value={formats}
              exclusive
              onChange={handleFormat}
              aria-label="text formatting"
            >
              <ToggleButton value="grid" aria-label="bold">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="map" aria-label="italic">
                <LocationOn />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      }

      {atlasLoader && (
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {parcels != null ? (
        formats == "grid" ? (
          <LandNfts
            parcels={parcels}
            filterType={filterType}
            onSelectGrid={onSelectGrid}
            xvalue={Xvalue}
            yvalue={Yvalue}
            adjcent={adjcent}
            filterTypeValue={filterTypeValue}
          />
        ) : (
          <NFTDetails
            onSale={onSale}
            parcels={parcels}
            filterType={filterType}
            onSelectGrid={onSelectGrid}
            selectedParcels={selectedGrid}
            adjcent={adjcent}
            filterTypeValue={filterTypeValue}
          />
        )
      ) : null}
      {selectedGrid != null && (
        <>
          <Row className="mt-5">
            <>
              <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                <Fade bottom>
                  <Stack gap={4}>
                    <h1 className="font-weight-bold">{"Parcel"}</h1>
                    {selectedGrid.map((item) => {
                      return (
                        <h4 className="font-weight-bold">
                          {"x:" + item.x + ",y:" + item.y}
                        </h4>
                      );
                    })}

                    <div className="d-flex justify-content-start"></div>
                    <div>
                      <div>Description</div>
                      <small className="secondary-text">{"des"}</small>
                    </div>
                    <div>
                      <div>owner</div>
                      <small className="secondary-text">{owner()}</small>
                    </div>
                    <div>
                      {status() == "auction" && (
                        <div>
                          <CountdownTimer
                            targetDate={parseInt(auctionTime())}
                            jsonUpdation={jsonUpdation}
                          />
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column">
                      <span>Price</span>
                      <span>
                        {/* {item?.bloqs_price} */}
                        {price()}

                        <span className="secondary-text">{"$0"}</span>
                      </span>
                    </div>
                    <div className="d-flex">
                      {selectedGrid.length == 1 ? (
                        owner() == address ? (
                          status() == "Mint" ? (
                            <button
                              onClick={() => setShow(true)}
                              className="mr-2 nftcollection_mobile-category"
                            >
                              <span>Put on sale</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => relist()}
                                disabled={Loading}
                                className="mr-2 nftcollection_mobile-category"
                              >
                                <span>Delist</span>{
                                  Loading &&
                                  <img src={loaderimg} style={{ width: "30px", height: "30px" }} />
                                }
                              </button>
                            </>
                          )
                        ) : isMinted() ? (
                          status() == "Mint" ? (
                            <>
                              <button
                                onClick={() => makeofferClick () }
                                className="mx-2 nftcollection_mobile-category"
                              >
                                <span>Make offer</span>
                              </button>
                            </>
                          ) : status() == "onsale" ? (
                            <>
                              <button
                                className="mx-2 metablog_primary-filled-square-button"
                                onClick={() => buyClick2()}
                              >
                                <span>Buy Now</span>
                              </button>
                              <button
                                onClick={() => makeofferClick()   }
                                className="mx-2 nftcollection_mobile-category"
                              >
                                <span>Make offer</span>
                              </button>
                            </>
                          ) : status() == "auction" ? (
                            <>
                              <button
                                // onClick={"placebidClick"}

                                onClick={() => setPlaceModalOpen(true)}
                                className="mr-2 nftcollection_mobile-category"
                              >
                                <span>Place a Bid</span>
                              </button>
                              <button
                                onClick={() => makeofferClick() }
                                className="mx-2 nftcollection_mobile-category"
                              >
                                <span>Make offer</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                  onClick={() => makeofferClick() }
                                // onClick={() => setMakeModalOpen(true)}
                                className="mx-2 nftcollection_mobile-category"
                              >
                                <span>Make offer</span>
                              </button>
                            </>
                          )
                        ) : (
                          <>
                            <button
                              onClick={buyClick}
                              className="mx-2 metablog_primary-filled-square-button"
                            >
                              <span>Buy Now </span>
                            </button>
                          </>
                        )
                      ) : owner() == address ? (
                        <button
                          onClick={createEstate}
                          className="mx-2 metablog_primary-filled-square-button"
                        >
                          <span>Create Estate</span>
                        </button>
                      ) : (
                        <button
                          onClick={buyClick}
                          className="mx-2 metablog_primary-filled-square-button">
                          <span>Buy Now 1</span>
                        </button>
                      )}
                    </div>
                    <div className="nftdetails_tabs-small"></div>
                  </Stack>
                </Fade>
              </Col>
              <Col
                xxl={6}
                xl={6}
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="mb-3"
              >
                <br />
                <div style={{ padding: "1em" }}>
                  <h5 className="fw-bold">Details</h5>
                  <Stack gap={3}>
                    <div className="d-flex justify-content-between">
                      <div className="text-left">Contract address</div>
                      <a
                        href={process.env.REACT_APP_SCAN_baseuri + process.env.REACT_APP_LAND_REGISTRY_CONTRACT}
                        className="text-right"
                        style={{ textDecoration: "inherit" }}
                        target="_blank"
                      >
                        {process.env.REACT_APP_LAND_REGISTRY_CONTRACT.slice(
                          0,
                          5
                        ) +
                          "..." +
                          process.env.REACT_APP_LAND_REGISTRY_CONTRACT.slice(
                            -5
                          )}
                      </a>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-left">Token id</span>
                      <span className="text-right">
                        {tokenAddress ? tokenAddress : "-"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-left">Token Standard</span>
                      <span className="text-right">ERC-1155</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-left">Metadata</span>
                      <span className="text-right">Centralized</span>
                    </div>
                  </Stack>
                </div>
                <br />
                <div className="nftdetails_tabs-small">
                  <Tabs
                    defaultActiveKey="Offer History"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab
                      eventKey="Offer History"
                      title="Offer History"
                      style={{ overflowY: "auto" }}
                    >
                      <Stack gap={3}>
                        <div
                          className="comments_box"
                          style={{ maxHeight: "300px" }}
                        >
                          {offerData.length > 0
                            ? offerData.map((offer, i) => (
                              <div
                                key={i}
                                className="d-flex justify-content-between align-items-start comments_box mb-2"
                              >
                                <div clasName="p-2">
                                  <small>
                                    {offer.offer_bid_land_wallet.slice(0, 5) +
                                      "..." +
                                      offer.offer_bid_land_wallet.slice(-5)}
                                  </small>
                                  <br />
                                  <small className="fw-bold">
                                    {offer.offer_bid_land_amount} BLOQS
                                  </small>
                                </div>
                                <div className="d-flex">
                                  {owner() == address && (
                                    <button
                                      onClick={() =>
                                        acceptMakeOffer(
                                          offer.offer_bid_land_wallet,
                                          offer.offer_bid_land_amount,
                                          offer.offer_bid_land_token_id
                                        )
                                      }
                                      className="metablog_primary-filled-square-button"
                                    >
                                      <font size="1">Accept</font>
                                    </button>
                                  )}
                                  &nbsp;
                                  {owner() == address && (
                                    <button
                                      onClick={() =>
                                        rejectMakeOffer(
                                          offer.offer_bid_land_id,
                                          offer.offer_bid_land_token_id
                                        )
                                      }
                                      className="metablog_gradient-square-button"
                                    >
                                      <font size="1">Reject</font>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                            : "no offers"}
                        </div>
                      </Stack>
                    </Tab>
                    <Tab
                      eventKey="Bid History"
                      title="Bid History"
                      style={{ overflowY: "auto" }}
                    >
                      <Stack gap={3}>
                        <div
                          className="comments_box"
                          style={{ maxHeight: "300px" }}
                        >
                          {bidData.length > 0
                            ? bidData.map((bid, i) => (
                              <div
                                key={i}
                                className="d-flex justify-content-between align-items-start comments_box mb-2"
                              >
                                <div clasName="p-2">
                                  <small>
                                    {bid.offer_bid_land_wallet.slice(0, 5) +
                                      "..." +
                                      bid.offer_bid_land_wallet.slice(-5)}
                                  </small>
                                  <br />
                                  <small className="fw-bold">
                                    {bid.offer_bid_land_amount} BLOQS
                                  </small>
                                </div>
                                <div className="">
                                  {FormatDate1(bid.offer_bid_land_createdat)}
                                </div>
                                <a
                                  style={{ textDecoration: "none" }}
                                  href={urls + `${bid.offer_bid_land_hash}`}
                                  target="_blank"
                                >
                                  {bid.offer_bid_land_hash.slice(0, 5) +
                                    "..." +
                                    bid.offer_bid_land_hash.slice(-5)}
                                </a>
                                <div className="d-flex">
                                  {
                                    // (days + hours + minutes + seconds <= 0) &&
                                    owner() == address ? (
                                      <button
                                        onClick={() =>
                                          transferNft(
                                            bid.offer_bid_land_wallet,
                                            bid.offer_bid_land_amount,
                                            bid.offer_bid_land_token_id
                                          )
                                        }
                                        className="metablog_primary-filled-square-button"
                                      >
                                        <font size="1">Settle</font>
                                      </button>
                                    ) : null
                                  }
                                </div>
                              </div>
                            ))
                            : "no bid history"}
                        </div>
                      </Stack>
                    </Tab>
                  </Tabs>
                </div>
              </Col>
            </>
          </Row>
          <div className="">
            <Activity activityDatas={activityDatas} details="details" />
          </div>
        </>
      )}

      <BuynowModal
        buyModalOpen={buyModalOpen}
        setBuyModalOpen={setBuyModalOpen}
        buyModalClose={buyModalClose}
        playSound={playSound}
        action={buy}
      />
      <Modalbox
        show={show}
        setShow={setShow}
        nftsImg={
          "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/preview/1.jpg"
        }
        // data={price}
        from={"atlas"}
        action={action}
      />
      <MakeOfferModal
        makeModalOpen={makeModalOpen}
        setMakeModalOpen={setMakeModalOpen}
        makeModalClose={makeModalClose}
        // data={nft}
        tokenblc={BalanceToken}
        Totalamt={Totalamt}
        from={"atlas"}
        action={makeOffer}
      />
      <PlacebidModal
        placeModalOpen={placeModalOpen}
        setPlaceModalOpen={setPlaceModalOpen}
        placeModalClose={placeModalClose}
        playSound={playSound}
        highestBid={highestBid}
        from={"atlas"}
        action={placeBid}
      />
      <BuynowModal
        buyModalOpen={buyModalOpen2}
        setBuyModalOpen={setBuyModalOpen2}
        buyModalClose={buyModalClose2}
        playSound={playSound}
        from={"atlas"}
        Totalamt={Totalamt}
        tokenblc={BalanceToken}
        action={realBuy}
      />
      <ActionWallet
        walletOpen={walletOpen}
        loader1={Loading1}
        loader2={Loading2}
        hashValue={hashValue}
        setWalletOpen={setWalletOpen}
      />
         <Modal
        open={Confirmmodal}
        onClose={()=>setConfirmmodal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ borderRadius: "1em" }}>
            <Stack gap={3}>
              <div
                style={{
                  background:
                    "linear-gradient(90deg, #6DC6FE 0%, #0295FA 100%)",
                  borderRadius: "1em 1em 0 0 ",
                }}
                className="d-flex justify-content-between align-items-center py-4 px-3"
              >
                <h3 className="font-weight-bold m-0 text-light">Edit Collection</h3>
                
                <small
                  onClick={()=>setConfirmmodal(false)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  X
                </small>
              </div>
              <div className="px-5">
                <Row>
                  <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                    <Bounce>
                      <Stack gap={4}>
                        <div>
                          <div className="bold">Collection Name</div>
                          <input
                            type="text"
                            placeholder="Enter campaing name"
                            className="createitem_input"
                            value={CollectionNmae}
                            onChange={(e) => {
                              setCollectionNmae(e.target.value)
                            }}
                          />
                        </div>
                      
                      </Stack>
                    </Bounce>
                  </Col>

                  {/* <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                    <Bounce>
                      <Stack gap={4}>
                      </Stack>
                    </Bounce>
                  </Col> */}
                </Row>
              </div>
              <div className="py-2 createitem_uploadbox text-center h-100 mx-5">
                <small className="bold">Logo Image</small>
                
                <br />
                <small>Upload JPG, PNG, GIF or WEBP</small>
                <br />
                <label class="createitem_upload-button">
                  {/* <RiUploadCloudFill color="white" />  */}
                  <small>Upload</small>
                  <input
                    type="file"
                    // accept=".xlsx, .xls, .csv"
                    style={{ display: "none" }}
                    onChange={(e)=>insertImageintoS3(e,'Logo')}
                  />
                   {
                    imgloading?
                    <img src={loaderimg} style={{width:"30px",height:"30px"}} />
                    :
                    <img src={logoImgFileName} style={{width:"30px",height:"30px"}} />
                  }
                </label>
                <br />
                {/* <small className="bold">{filename}</small> */}
                <br />
              </div>
              <div className="py-2 createitem_uploadbox text-center h-100 mx-5">
                <small className="bold">Banner Image</small>
                <br />
                <small>Upload JPG, PNG, GIF or WEBP</small>
                <br />
                <label class="createitem_upload-button">
                  {/* <RiUploadCloudFill color="white" />  */}
                  <small>Upload</small>
                  <input
                    type="file"
                    // accept=".xlsx, .xls, .csv"
                    style={{ display: "none" }}
                    onChange={(e)=>insertImageintoS3(e,'Banner')}
                  />
                  {
                    imgloading?
                    <img src={loaderimg} style={{width:"30px",height:"30px"}} />
                    :
                    <img src={bannerImgFileName} style={{width:"30px",height:"30px"}} />
                  }
                </label>
                <br />
                {/* <small className="bold">{filename}</small> */}
                <br />
              </div>
              <Bounce>
                <div className="d-flex justify-content-center px-5 py-3">
                  <button
                    onClick={() => {
                      playSound();
                     
                      Updatecollection()
                      // pressingSubmit();
                    }}
                    className="metablog_primary-filled-button"
                  >
                    <span>Submit</span>
                  </button>
                </div>
              </Bounce>
            </Stack>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default CitiesHomeCollection;
