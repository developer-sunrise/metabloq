import React, { useEffect, useState } from "react";
import { Row, Col, Image, Stack, Form } from "react-bootstrap";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { RiUploadCloudFill } from "react-icons/ri";
import Bounce from "react-reveal/Bounce";
import { AiTwotoneHeart } from "react-icons/ai";
import { Snackbar } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import {
  ReactS3Client4,
  ReactS3Client2,
  postMethod, getMethod,
  ImageLoad,
} from "../../helpers/API&Helpers/index";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx/xlsx.mjs";

const empty = require("../../assets/empty.png");

function NftAirdrop() {

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
  const [playSound] = useSound(buttonSound);
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address } = reduxItems;
  const [title, setTitle] = useState("");
  const [bannerImg, setBannerImg] = useState(empty);
  const [featuredImg, setFeaturedImg] = useState(empty);
  const [confirmmodal, setConfirmmodal] = useState(false);
  const [collection, setCollection] = useState({
    collection_name: "",
    category: "Land",
    blockchain: "xdc",
    royalties: "5",
    description: "",
    logo_image: "",
    featured_image: "",
    banner_image: "",
    nfts: []
  });
  const [logoImgFileName, setlogoImgFileName] = useState("");
  const [featureImgFileName, setfeatureImgFileName] = useState("");
  const [bannerImgFileName, setbannerImgFileName] = useState("");

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [collections, setCollections] = useState([])
  const [filename, setFilename] = useState('')
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
  const bannerImageChange = (e) => {
    var file = e.target.files[0];
    const reader = new FileReader();
    reader.fileName = file.name
    reader.onload = async (e) => {
      setFilename(e.target.fileName)
      const data1 = e.target.result;
      const workbook = XLSX.read(data1, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log("fgdnewDatahsk", json.length);
      setCollection({ ...collection, nfts: json });
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };
  const insertImageintoS3 = async (e, type) => {
    e.preventDefault();
    var file = e.target.files[0];
    var date = new Date();
    var timeStamp = date.getTime();
    let name = file.name;
    let extension = "." + name.split(".").pop();
    let filename;
    try {
      var data;
      filename = timeStamp + type + extension;
      data = await ReactS3Client4.uploadFile(file, filename);
      if (data?.status === 204) {
        if (type == "Logo") {
          setCollection({ ...collection, logo_image: data.location });
          setlogoImgFileName(name);
        } else if (type == "Featured") {
          setCollection({ ...collection, featured_image: data.location });
          setfeatureImgFileName(name);
        } else if (type == "Banner") {
          setCollection({ ...collection, banner_image: data.location });
          setbannerImgFileName(name);
        }
      }
    } catch (err) {
      console.log("error image uploading", err);
    }
  };
  const createNftCollection = async (e) => {
    var data = collections.filter(data => {
      return ((data.collection_name).toLowerCase()).match((collection.collection_name).toLowerCase())
    });
    console.log("data", data)
    // if(data.length!=0){
    //   handleClick("warning", "Name already exists");
    //   return;
    // }
    if (address == "") {
      handleClick("warning", "Connect your wallet");
      return;
    } else if (collection.collection_name == "") {
      handleClick("warning", "Enter collection name");
      return;
    } else if (collection.description == "") {
      handleClick("warning", "Enter description");
      return;
    } else if (collection.logo_image == "") {
      handleClick("warning", "Upload logo image");
      return;
    } else if (collection.featured_image == "") {
      handleClick("warning", "Upload featured image");
      return;
    } else if (collection.banner_image == "") {
      handleClick("warning", "Upload banner image");
      return;
    } else if (collection.nfts.length == 0) {
      handleClick("warning", "Upload file");
      return;
    } else {
      let url = "createNftAirdrop";
      let params = {
        ...collection,
        wallet: address,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("fghjk", response);
      if (response.status) {
        handleClick("success", "Collection created successfully");
        setTimeout(navigate("/"), 2000);
      } else {
        handleClick("error", "Something went wrong");
      }
    }
  };
  const getAllCollection = async () => {
    let url = "getAllCollection";
    let authtoken = "";
    let response = await getMethod({ url, authtoken });
    console.log("response", response.result)
    setCollections(response.result)
  }
  
  useEffect(() => {
    getAllCollection()
  }, [])
  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Stack gap={4}>
        <div className="createitempage_createitem">
          <h2 className="bold poppins">NFT AirDrop</h2>
        </div>
        <div className="metabloq_container-fluid">
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
                <div className="collectables_cards metablog_cards">
                  <Stack gap={2}>
                    <div className="collectables_cards-imgsection">
                      <Image
                        fluid
                        src={collection.banner_image == '' ? ImageLoad : collection.banner_image}
                        alt="collectables"
                        className="metabloq_img img-zoom-animation"
                      />
                      <div className="collectables_cards-likesbox d-flex justify-content-center align-items-center">
                        <span>
                          <AiTwotoneHeart color="white" size={18} />
                        </span>
                        <span className="mx-1">150</span>
                      </div>
                      <div className="collectables_cards-avatarbox">
                        <Image
                          fluid
                          src={collection.logo_image == '' ? ImageLoad : collection.logo_image}
                          height={45}
                          className="metabloq_img"
                        />
                      </div>
                    </div>
                    <br />
                    <div className="text-center">
                      <div className="font-weight-bold">
                        {collection.collection_name != "" ? collection.collection_name : "Cute Things"}
                      </div>
                      <small className="secondary-text">
                        Created by{" "}
                        <small className="font-weight-bold text-dark">
                          Sera Cobalt
                        </small>
                      </small>
                    </div>
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
                          <div className="bold">Collection Name</div>
                          <input
                            type="text"
                            placeholder="eg.The Floating Pilot"
                            className="createitem_input"
                            // value={title}
                            onChange={(e) => {
                              setCollection({
                                ...collection,
                                collection_name: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <div className="bold">Blockchain</div>
                          <input
                            type="text"
                            placeholder="XDC"
                            className="createitem_input"
                            disabled
                          />
                        </div>
                      </Stack>
                    </Bounce>
                  </Col>

                  <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                    <Bounce>
                      <Stack gap={4}>
                        <div className="createitem_select">
                          <div className="bold">Category</div>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              setCollection({
                                ...collection,
                                category: e.target.value,
                              });
                            }}
                          >
                            <option value="Art">Art</option>
                            <option value="Meta Pets">Meta Pets</option>
                            <option value="Virtual Real Estate">
                              Virtual Real Estate
                            </option>
                            <option value="Wearables">Wearables</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                          </Form.Select>
                        </div>
                        <div className="createitem_select">
                          <div className="bold">Royalties</div>
                          <Form.Select
                            aria-label="Default select example"
                            onChange={(e) => {
                              setCollection({
                                ...collection,
                                royalties: e.target.value,
                              });
                            }}
                            disabled
                          >
                            <option value="5">5%</option>
                            <option value="10">10%</option>
                            <option value="15">15%</option>
                            <option value="20">20%</option>
                          </Form.Select>
                        </div>
                      </Stack>
                    </Bounce>
                  </Col>
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
                            setCollection({
                              ...collection,
                              description: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </Bounce>
                  </Col>
                </Row>

                <Row>
                  <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                    <div className="bold">Logo Image</div>
                    <Bounce>
                      <div className="p-4 createitem_uploadbox text-center h-100">
                        {
                          logoImgFileName == "" ?
                            <small className="bold">Upload Files</small> :
                            <small className="bold">{logoImgFileName}</small>
                        }
                        <br />
                        <small>JPG, PNG, GIF, WEBP, or MP4. MAX 200mb</small>
                        <br />
                        <label class="createitem_upload-button">
                          <RiUploadCloudFill color="white" />{" "}
                          <small>Upload</small>
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              insertImageintoS3(e, "Logo");
                            }}
                          />
                        </label>
                      </div>
                    </Bounce>
                  </Col>

                  <Col xxl={6} xl={6} lg={6} sm={12} xs={12} className="mb-3">
                    <div className="bold">Featured Image</div>
                    <Bounce>
                      <div className="p-4 createitem_uploadbox text-center h-100">
                        {
                          featureImgFileName == "" ?
                            <small className="bold">Upload Files</small> :
                            <small className="bold">{featureImgFileName}</small>
                        }
                        <br />
                        <small>JPG, PNG, GIF, WEBP, or MP4. MAX 200mb</small>
                        <br />
                        <label class="createitem_upload-button">
                          <RiUploadCloudFill color="white" />{" "}
                          <small>Upload</small>
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              insertImageintoS3(e, "Featured");
                            }}
                          />
                        </label>
                      </div>
                    </Bounce>
                  </Col>
                </Row>

                <Row>
                  <Col xxl={12} xl={12} lg={12} sm={12} xs={12} className="mb-3">
                    <div className="bold">Banner Image</div>
                    <Bounce>
                      <div className="p-4 createitem_uploadbox text-center h-100">
                        {
                          bannerImgFileName == "" ?
                            <small className="bold">Upload Files</small> :
                            <small className="bold">{bannerImgFileName}</small>
                        }
                        <br />
                        <small>JPG, PNG, GIF, WEBP, or MP4. MAX 200mb</small>
                        <br />
                        <label class="createitem_upload-button">
                          <RiUploadCloudFill color="white" />{" "}
                          <small>Upload</small>
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              insertImageintoS3(e, "Banner");
                            }}
                          />
                        </label>
                      </div>
                    </Bounce>
                  </Col>
                </Row>
                <Row>
                  <Col xxl={12} xl={12} lg={12} sm={12} xs={12} className="mb-3">
                    <div className="bold">Nft Airdrop Wallet</div>
                    <Bounce>
                      <div className="p-4 createitem_uploadbox text-center h-100">
                        <small className="bold">Upload Files</small>
                        <br />
                        <small>Upload to XSL format only</small>
                        <br />
                        <label class="createitem_upload-button">
                          <RiUploadCloudFill color="white" />{" "}
                          <small>Upload</small>
                          <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            style={{ display: "none" }}
                            onChange={bannerImageChange}
                          />
                        </label>
                        <br />
                        <h5>{filename}</h5>
                        <br />
                        <a href="https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/1662099831195Logo.xlsx" download>Download File</a>
                      </div>
                    </Bounce>
                  </Col>
                </Row>

                <Bounce>
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={() => { playSound(); setConfirmmodal(true); }}
                      className="metablog_primary-filled-button">
                      <span>Add NFT AirDrop</span>
                    </button>
                  </div>
                </Bounce>
              </Stack>
            </Col>
          </Row>
        </div>

        <Modal
          open={confirmmodal}
          // onClose={setConfirmmodal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description" >
          <Box sx={style}>
            <div style={{ borderRadius: "1em" }}>
              <div
                style={{
                  background:
                    "linear-gradient(90deg, #6DC6FE 0%, #0295FA 100%)",
                  borderRadius: "1em 1em 0 0 ",
                }}
                className="d-flex justify-content-between align-items-center py-4 px-3"
              >
                <h3 className="font-weight-bold m-0 text-light">Confirmation</h3>
                <small
                  onClick={() => setConfirmmodal(false)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  X
                </small>
              </div>
              <div className="py-2 text-center h-100 mx-5">
                <h4>Are you sure you want to create new campaign?</h4><br />
              </div>

              <div className="d-flex justify-content-center px-5 py-3">
                <button
                  onClick={() => { playSound(); createNftCollection(); }}
                  className="metablog_primary-filled-button" >
                  <span>Confirm </span>
                </button>
                <button
                  onClick={() => setConfirmmodal(false)}
                  className="metablog_primary-filled-button"
                >
                  <span>Cancel </span>
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </Stack>
    </>
  );
}

export default NftAirdrop;
