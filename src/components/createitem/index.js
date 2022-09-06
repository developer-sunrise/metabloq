import React, { useState, useEffect } from "react";
import "./Styles.css";
import { Row, Col, Image, Stack, Form } from "react-bootstrap";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { RiUploadCloudFill } from "react-icons/ri";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import Bounce from "react-reveal/Bounce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {
  AiFillStar,
  AiOutlinePlus,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { IoIosStats } from "react-icons/io";
import PropertyModal from "./PropertyModal";
import LevelModal from "./LevelModal";
import StatsModal from "./StatsModal";
import { useDispatch, useSelector } from "react-redux";
import {
  ReactS3Client2,
  ReactS3Client1,
  ReactS3Client3,
  postMethod,
} from "../../helpers/API&Helpers";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Navigate, useNavigate } from "react-router-dom";
import ActionWallet from "../connectwallet/actionWallet";
const time_icon = require("../../assets/auction/time_icon.png");
const avatar1 = require("../../assets/profilepics/face7.jpg");
const fixed = require("../../assets/createitem/fixed.png");
const timed_auction = require("../../assets/createitem/timed_auction.png");
const open_bids = require("../../assets/createitem/open_bids.svg");
const empty = require("../../assets/empty.png");

function CreateItem() {
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { web3, Token, address, Marketplace, Collection } = reduxItems;
  const [playSound] = useSound(buttonSound);
  const { width } = useWindowDimensions();
  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    background_color: "#ffffff",
    attributes: [],
    collection_id: "",
  });
  console.log(nftDetails.attributes);
  const [uploadedImg, setUploadedImg] = useState(empty);
  const [otherFormats, setOtherFormats] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [propModal, setPropModal] = useState(false);
  const [levelModal, setLevelModal] = useState(false);
  const [statsModal, setStatsModal] = useState(false);

  const [userCollections, setUserCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState({});

    //action wallet states
  const [walletOpen, setWalletOpen] = useState(false);
  const [Loading1, setLoading1] = useState(false);
  const [Loading2, setLoading2] = useState(false);
  const [hashValue,sethashValue]= useState("");
  const [fileName,setFileName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClick = (type, message) => {
    setType(type);
    setMessage(message);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const propModalClose = () => {
    setPropModal(false);
  };
  const levelModalClose = () => {
    setLevelModal(false);
  };
  const statsModalClose = () => {
    setStatsModal(false);
  };

  const getBase64 = (e) => {
    var file = e.target.files[0];
    let name = file.name;
    setFileName(name);
    let extension = "." + name.split(".").pop();
    var date = new Date();
    var timeStamp = date.getTime();
    let filename = timeStamp + type + extension;
    console.log("fgh", extension);
    if (
      extension == ".jpg" ||
      extension == ".jpeg" ||
      extension == ".png" ||
      extension == ".gif" ||
      extension == ".webp"
    ) {
      console.log("img");
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUploadedImg(reader.result);
        setPreviewImg(file);
      };
    } else {
      console.log("not img");
      setOtherFormats(file);
    }
  };

  const setAttributes = (item, type) => {
    let oldArr = [...nftDetails.attributes];
    let newArr = oldArr.filter((x) => x.type != type);
    setNftDetails({
      ...nftDetails,
      attributes: [...newArr, ...item],
    });
  };

  const createNFT = async () => {
    if (address == "") {
      handleClick("warning", "Connect your wallet");
      return;
    } else if (nftDetails.name == "") {
      handleClick("warning", "Enter nft name");
      return;
    } else if (nftDetails.description == "") {
      handleClick("warning", "Enter description");
      return;
    } else {
      if (otherFormats == null) {
        console.log("imggggggggg");
        try {
          setWalletOpen(true);
          setLoading1(true);
          const LastMintId = await Collection.methods.totalSupply().call();
          var mintid = parseInt(LastMintId) + 1;
          console.log("LastMintId", mintid);
          sethashValue(LastMintId?.hash)
          setLoading1(false);
          setLoading2(true);
          try {
            let previewname = previewImg?.name;
            let previewextension = "." + previewname.split(".").pop();
            let previewfilename = mintid + previewextension;
            const data3 = await ReactS3Client3.uploadFile(
              previewImg,
              previewfilename
            );
            let imageUrl = data3.location;
            console.log("preeeeevvv", imageUrl);
            let filename2 = mintid + ".json";
            let jsonData = JSON.stringify({
              name: nftDetails.name,
              description: nftDetails.description,
              image: imageUrl,
              attributes: nftDetails.attributes,
            });
            console.log("aaaaa", jsonData);
            try {
              console.log("filename", filename2);
              const data2 = await ReactS3Client1.uploadFile(
                jsonData,
                filename2
              );
              console.log("teasssa", data2);
              if (data2.status === 204) {
                console.log("final json", data2.location);
                try {
                  let amt = 1;
                  let amt2 = amt.toString();
                  let priceInWei = web3.utils.toWei(amt2, "ether");
                  console.log("starttttt");
                  const allowance = await Token.methods
                    .allowance(
                      address,
                      process.env.REACT_APP_Marketplace_CONTRACT
                    )
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
                    console.log("dfghjkl", priceInWei);
                    let date = new Date();
                    let timestamp = date.getTime();
                    let url = "signature";
                    let params = {
                      seller: address,
                      buyer: address,
                      nftAddress: process.env.REACT_APP_Marketplace_CONTRACT,//nftAddress
                      amount: 0,
                      tokenId: 1,
                      nonce: timestamp,
                    };
                    let authtoken = "";
                    let response = await postMethod({ url, params, authtoken });
                    console.log("fghj", response);
                    try{ 
                      const signer = await Marketplace.methods.getSigner(response.signtuple).call()
                      console.log("signer",signer)
                    }catch(err){
                      console.log("Error",err)
                    }
                    if (response?.status) {
                      try {
                        console.log("start", response.signtuple);
                        const mintNFT = await Marketplace.methods
                          .buyCollections(
                            response.signtuple,
                            data2.location,
                            parseInt(selectedCollection?.collection_royalties)
                          )
                          .send({ from: address });
                        console.log("tesss", mintNFT);
                        try {
                          let url = "createNft";
                          let params = {
                            name: nftDetails.name,
                            description: nftDetails.description,
                            image: imageUrl,
                            animation_url: "",
                            background_color: nftDetails.background_color,
                            attributes: JSON.stringify(nftDetails.attributes),
                            token_id: mintid,
                            wallet: address,
                            collection_id: nftDetails.collection_id,
                            metadata_url: data2.location,
                          };
                          let authtoken = "";
                          let response = await postMethod({
                            url,
                            params,
                            authtoken,
                          });
                          if (response.status) {
                            navigate("/");
                          }
                        } catch (err) {
                          console.log("errr update", err);
                        }
                        try{
                          let url = "createActivities";
                          let params = {
                            wallet: address,
                            hash: mintNFT?.transactionHash,
                            from: "",
                            to: address,
                            type: "Mint",
                            price:"",
                            quantity: 1,
                            collection: nftDetails.collection_id,
                            nft: mintid,
                            transfer:"transfered"
                          };
                          let authtoken = "";
                          let response = await postMethod({
                            url,
                            params,
                            authtoken,
                          })
                          console.log("actvies",response)
                        }catch(e){
                          console.log(e)
                        }
                      } catch (err) {
                        console.log("err", err);
                      }
                    }
                  } catch (err) {
                    console.log("err in signature", err);
                  }
                } catch (err) {
                  console.log("tess", err);
                }
              } else {
              }
            } catch (err) {
              console.log("error json uploading", err);
              setWalletOpen(false);
            setLoading1(false);
            setLoading2(false)
            }
            setLoading2(false)
          } 
          catch (err) {
            console.log("error thumpnail uploading", err);
            setWalletOpen(false);
          setLoading1(false);
          setLoading2(false)
          }
          setWalletOpen(false);
        } catch (err) {
          console.log("err in last supply", err);
          setWalletOpen(false);
          setLoading1(false);
          setLoading2(false)
        }
      } else {
        try {
          setWalletOpen(true);
          setLoading1(true);
          const LastMintId = await Collection.methods.totalSupply().call();
          setLoading1(true);
          sethashValue(LastMintId?.hash);
          setLoading2(true);
          var mintid = parseInt(LastMintId) + 1;
          console.log("LastMintId", mintid);
          let name = otherFormats?.name;
          let extension = "." + name.split(".").pop();
          let filename1 = mintid + extension;
          try {
            console.log("filename", filename1);
            const data = await ReactS3Client2.uploadFile(
              otherFormats,
              filename1
            );
            console.log("teasssa", data);
            if (data.status === 204) {
              console.log("teasssa2222", data);
              let animationUrl = data.location;
              console.log("tesss33333", data);
              try {
                let previewname = previewImg?.name;
                let previewextension = "." + previewname.split(".").pop();
                let previewfilename = mintid + previewextension;
                const data3 = await ReactS3Client3.uploadFile(
                  previewImg,
                  previewfilename
                );
                let imageUrl = data3.location;
                console.log("preeeeevvv", imageUrl);
                let filename2 = mintid + ".json";
                let jsonData = JSON.stringify({
                  name: nftDetails.name,
                  description: nftDetails.description,
                  image: imageUrl,
                  animation_url: animationUrl,
                  background_color: nftDetails.background_color,
                  attributes: nftDetails.attributes,
                });
                console.log("aaaaa", jsonData);
                try {
                  console.log("filename", filename2);
                  const data2 = await ReactS3Client1.uploadFile(
                    jsonData,
                    filename2
                  );
                  console.log("teasssa", data2);
                  if (data2.status === 204) {
                    console.log("final json", data2.location);
                    try {
                      let amt = 1;
                      let amt2 = amt.toString();
                      let priceInWei = web3.utils.toWei(amt2, "ether");
                      console.log("starttttt");
                      const allowance = await Token.methods
                        .allowance(
                          address,
                          process.env.REACT_APP_Marketplace_CONTRACT
                        )
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
                        console.log("dfghjkl", priceInWei);
                        let date = new Date();
                        let timestamp = date.getTime();
                        let url = "signature";

                        let params = {
                          seller: address,
                          buyer: address,
                          nftAddress: address,
                          amount: 0,
                          tokenId: 1,
                          nonce: timestamp,
                        };
                        
                        let authtoken = "";
                        let response = await postMethod({
                          url,
                          params,
                          authtoken,
                        });
                        console.log("fghj", response);
                        if (response?.status) {
                          try {
                            console.log("start", response.signtuple);
                            const mintNFT = await Marketplace.methods
                              .buyCollections(
                                response.signtuple,
                                data2.location,
                                parseInt(selectedCollection?.collection_royalties)
                              )
                              .send({ from: address });
                            console.log("minttttsss", mintNFT);
                            try {
                              let url = "createNft";
                              let params = {
                                name: nftDetails.name,
                                description: nftDetails.description,
                                image: imageUrl,
                                animation_url: animationUrl,
                                background_color: nftDetails.background_color,
                                attributes:JSON.stringify( nftDetails.attributes),
                                token_id: mintid,
                                wallet: address,
                                collection_id: nftDetails.collection_id,
                                metadata_url: data2.location,
                              };
                              let authtoken = "";
                              console.log("minttttsdssdaddsss", params, url);
                              let response = await postMethod({
                                url,
                                params,
                                authtoken,
                              });
                              console.log("testss", response);
                              try{
                                let url = "createActivities";
                                let params = {
                                  wallet: address,
                                  hash:mintNFT?.transactionHash,
                                  from: "",
                                  to: address,
                                  type: "Mint",
                                  price:"",
                                  quantity: 1,
                                  collection: nftDetails.collection_id,
                                  nft: mintid,
                                  transfer:"transfered"
                                };
                                let authtoken = "";
                                let response = await postMethod({
                                  url,
                                  params,
                                  authtoken,
                                })
                                console.log("actvies",response)
                              }catch(e){
                                console.log(e)
                              }

                              if (response.status) {
                                navigate("/");
                              }
                            } catch (err) {
                              console.log("errr update", err);
                            }
                          } catch (err) {
                            console.log("err", err);
                          }
                        }
                      } catch (err) {
                        console.log("err in signature", err);
                      }
                    } catch (err) {
                      console.log("tess", err);
                    }
                  } else {
                  }
                } catch (err) {
                  console.log("error json uploading", err);
                }
              } catch (err) {
                console.log("error thumpnail uploading", err);
              }
            } else {
            }
            setLoading2(true);
          } catch (err) {
            console.log("error image uploading", err);
            setWalletOpen(false);
            setLoading1(true);
            setLoading2(true);
          }
        } catch (err) {
          console.log("err in last supply", err);
          setWalletOpen(false);
          setLoading1(true);
          setLoading2(true);
        }
      }
    }
  };
  const getCollection = async () => {
    if (address != "") {
      let url = "getCollection";
      let params = {
        wallet: address,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("fghjk", response);
      if (response.status) {
        setUserCollections(response.result);
        setSelectedCollection(response.result[0]);
        setNftDetails({
          ...nftDetails,
          collection_id: response.result[0].collection_id,
        });
      } else {
        if (response.message == "User collection is empty") {
          console.log("warning", "User collection is empty");
        } else {
          console.log("error", "Something went wrong");
        }
        handleClick(
          "warning",
          "You don't have any collection, please create collection first"
        );
        setTimeout(() => {
          navigate("/createcollection");
        }, 1000);
      }
    }
  };
  useEffect(() => {
    if (address) {
      getCollection();
    }
  }, [address]);

  return (
    <div className="metabloq_container">
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Row>
        <Col
          xxl={3}
          xl={3}
          lg={3}
          md={3}
          sm={12}
          xs={12}
          className="h-100 mb-3"
        >
          <Bounce>
            <div className="bold">Preview Item</div>
            <div className="liveauction_cards metablog_cards h-100">
              <Stack gap={2}>
                <div className="liveauction_cards-imgwithtime my-2">
                  <div
                    style={{
                      height: "250px",
                      width: "100%",
                      overflow: "hidden",
                      borderRadius: ".5em",
                    }}
                  >
                    <Image
                      src={uploadedImg}
                      alt="square"
                      className="metabloq_img img-zoom-animation"
                    />
                  </div>
                </div>
                <h5 className="fw-bold">
                  {nftDetails.name ? nftDetails.name : "Nft Name"}
                </h5>
              </Stack>
            </div>
          </Bounce>
        </Col>

        <Col xxl={9} xl={9} lg={9} md={9}>
          <Stack gap={4}>
            <Row>
              <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                <Bounce>
                  <Stack gap={4}>
                    <div>
                      <div className="bold">Title Name</div>
                      <input
                        type="text"
                        placeholder="eg.The Floating Pilot"
                        className="createitem_input"
                        // value={nftDetails.name}
                        onChange={(e) => {
                          setNftDetails({
                            ...nftDetails,
                            name: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <div className="bold">Price</div>
                      <input
                        type="text"
                        placeholder="Enter price for one item (BLOQS)"
                        className="createitem_input"
                        disabled
                        // value={price}
                        // onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </Stack>
                </Bounce>
              </Col>

              <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                <Bounce>
                  <div className="p-4 createitem_uploadbox text-center h-100">
                    { 
                      fileName == "" ?
                      <small className="bold">Upload Files</small> : 
                      <small className="bold">{fileName}</small>
                    }
                    <br />
                    <small>JPG, PNG, GIF, WEBP,GLB, or MP4. MAX 200mb</small>
                    <br />
                    <label class="createitem_upload-button">
                      <RiUploadCloudFill color="white" />{" "}
                      <small>
                        {otherFormats == null ? "Upload" : "Upload Thumpnail"}
                      </small>
                      <input
                        type={"file"}
                        accept={
                          otherFormats == null
                            ? ""
                            : "image/png, image/gif, image/jpeg"
                        }
                        style={{ display: "none" }}
                        onChange={getBase64}
                      />
                    </label>
                    <br />
                    {otherFormats != null && (
                      <input
                        type={"color"}
                        onChange={(e) => {
                          setNftDetails({
                            ...nftDetails,
                            background_color: e.target.value,
                          });
                        }}
                      />
                    )}
                  </div>
                </Bounce>
              </Col>
            </Row>
            <Row>
              <Col style={{ padding: width < 600 && 5 }}>
                <Bounce>
                  <div className="createitem_select">
                    <div className="bold">Collection</div>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => {
                        setSelectedCollection(userCollections[e.target.value]);
                        setNftDetails({
                          ...nftDetails,
                          collection_id:
                            userCollections[e.target.value].collection_id,
                        });
                      }}
                    >
                      {userCollections?.length != 0
                        ? userCollections.map((x, index) => {
                            return (
                              <option key={index} value={index}>
                                {x.collection_name}
                              </option>
                            );
                          })
                        : null}
                    </Form.Select>
                  </div>
                </Bounce>
              </Col>
              <Col style={{ padding: width < 600 && 5 }}>
                <Bounce>
                  <div className="createitem_select">
                    <div className="bold">Royalties</div>
                    <Form.Select aria-label="Default select example" disabled>
                      <option>
                        {selectedCollection?.collection_royalties}
                      </option>
                    </Form.Select>
                  </div>
                </Bounce>
              </Col>
            </Row>
            <Row>
              <Stack gap={4}>
                <Col sm={12} xs={12}>
                  <Bounce>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <AiOutlineUnorderedList />
                        <span className="bold mx-2">Properties</span>
                      </div>
                      <div
                        onClick={() => setPropModal(true)}
                        className="add-items"
                      >
                        <AiOutlinePlus />
                      </div>
                    </div>
                    <Row>
                      {nftDetails?.attributes.filter(item=> item.type == "property").map((item, index) => (
                        <Col
                          key={index}
                          xxl={3}
                          xl={3}
                          lg={3}
                          md={4}
                          sm={6}
                          xs={6}
                          className="mb-2"
                        >
                          <div className="properties_box h-100">
                            <span>{item.trait_type}</span>
                            <font size="1">{item.value}</font>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Bounce>
                </Col>
                <Col sm={12} xs={12}>
                  <Bounce>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <AiFillStar />
                        <span className="bold mx-2">Levels</span>
                      </div>
                      <div
                        onClick={() => setLevelModal(true)}
                        className="add-items"
                      >
                        <AiOutlinePlus /> 
                      </div>
                    </div>
                    <Row>
                      {
                        nftDetails?.attributes.filter(item=> item.type == "level").map((item,index)=>(
                          <Col
                          key={index}
                          xxl={6}
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={6}
                          className="mb-2"
                        >
                          <div className="properties_box h-100">
                            <span className="text-left">{item.trait_type}</span>
                            <ProgressBar now={item.value}/>
                          </div>
                        </Col>
                        ))
                      }
                    </Row>
                  </Bounce>
                </Col>
                <Col sm={12} xs={12}>
                  <Bounce>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <IoIosStats />
                        <span className="bold mx-2">Stats</span>
                      </div>
                      <div
                        onClick={() => setStatsModal(true)}
                        className="add-items"
                      >
                        <AiOutlinePlus />
                      </div>
                    </div>
                    <Row>
                      {
                        nftDetails?.attributes.filter(item=> item.type == "stats").map((item,index)=>(
                          <Col
                          key={index}
                          xxl={6}
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={6}
                          className="mb-2"
                        >
                        <div className="properties_box h-100 w-70">
                          <div clasName="d-flex">
                            <span>{item.trait_type}</span>
                            <span>{item.value}</span>
                            </div>
                          </div>
                        </Col>
                        ))
                      } 
                    </Row>
                  </Bounce>
                </Col>
              </Stack>
            </Row>
            <Row>
              <Col>
                <Bounce>
                  <div>
                    <div className="bold">Description</div>
                    <textarea
                      type="textarea"
                      className="createitem_input"
                      placeholder="eg.Limited Outspace series"
                      onChange={(e) => {
                        setNftDetails({
                          ...nftDetails,
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Bounce>
              </Col>
            </Row>
            <Bounce>
              <div className="d-flex justify-content-center">
                <button
                  onClick={() => {
                    playSound();
                    createNFT();
                  }}
                  className="metablog_primary-filled-button"
                >
                  <span>Create NFT</span>
                </button>
              </div>
            </Bounce>
          </Stack>
        </Col>
      </Row>
      <PropertyModal
        propModalClose={propModalClose}
        propModal={propModal}
        setPropModal={setPropModal}
        setAttributes={setAttributes}
      />
      <LevelModal
        levelModal={levelModal}
        setLevelModal={setLevelModal}
        levelModalClose={levelModalClose}
        setAttributes={setAttributes}
      />
      <StatsModal
        statsModal={statsModal}
        setStatsModal={setStatsModal}
        statsModalClose={statsModalClose}
        setAttributes={setAttributes}
      />
      <ActionWallet 
        walletOpen={walletOpen}
        loader1={Loading1}
        loader2={Loading2}
        hashValue={hashValue}
        setWalletOpen={setWalletOpen}
       />
    </div>
  );
}

export default CreateItem;
