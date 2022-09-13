import React, { useState } from "react";
import "./Styles.css";
import { Row, Col, Image, Stack, Form } from "react-bootstrap";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { RiUploadCloudFill } from "react-icons/ri";
import Bounce from "react-reveal/Bounce";
import { AiTwotoneHeart } from "react-icons/ai";
import { Snackbar } from "@mui/material";
import {
  ReactS3Client4,
  postMethod,
  ImageLoad,
} from "../../helpers/API&Helpers/index";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function CreateCollection() {
  const [playSound] = useSound(buttonSound);
  const navigate = useNavigate();
  const [collection, setCollection] = useState({
    collection_name: "",
    category: "Art",
    blockchain: "xdc",
    royalties: "5",
    description: "",
    logo_image: "",
    featured_image: "",
    banner_image: "",
  });
  const [logoImgFileName,setlogoImgFileName] = useState("");
  const [featureImgFileName,setfeatureImgFileName] = useState("");
  const [bannerImgFileName,setbannerImgFileName] = useState("");
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address } = reduxItems;
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
  const insertImageintoS3 = async (e, type) => {
    var file = e.target.files[0];
    var date = new Date();
    var timeStamp = date.getTime();
    let name = file.name;
    let extension = "." + name.split(".").pop();
    let filename = timeStamp + type + extension;
    try {
      console.log("filename", filename, file);
      const data = await ReactS3Client4.uploadFile(file, filename);
      console.log("teasssa", data);
      if (data.status === 204) {
        if (type == "Logo") {
          setlogoImgFileName(name);
          setCollection({ ...collection, logo_image: data.location });
        } else if (type == "Featured") {
          setCollection({ ...collection, featured_image: data.location });
          setfeatureImgFileName(name);
        } else if (type == "Banner") {
          setCollection({ ...collection, banner_image: data.location });
          setbannerImgFileName(name);
        }
      } else {
      }
    } catch (err) {
      console.log("error image uploading", err);
    }
  };

  const pressingCreate = async () => {
    if (address == "") {
      handleClick("warning", "Connect your wallet");
      return;
    } else if (collection.collection_name == "") {
      handleClick("warning", "Enter collection name");
      return;
    } else if (collection.category == "") {
      handleClick("warning", "Enter collection category");
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
    } else {
      let url = "createCollection";
      let params = {
        ...collection,
        wallet: address,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      console.log("create collection", response);
      if (response.status) {
        handleClick("success", "Collection created successfully");
        setTimeout(navigate("/collections"), 2000);
      } else {
        if (response.message == "Collection name already taken") {
          handleClick("warning", "Collection name already taken");
        } else {
          handleClick("error", "Something went wrong");
        }
      }
    }
  };

  return (
    <div className="metabloq_container-fluid">
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
            <div className="collectables_cards metablog_cards">
              <Stack gap={2}>
                <div className="collectables_cards-imgsection">
                  <Image
                    fluid
                    src={
                      collection.banner_image == ""
                        ? ImageLoad
                        : collection.banner_image
                    }
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
                      src={
                        collection.featured_image == ""
                          ? ImageLoad
                          : collection.featured_image
                      }
                      height={45}
                      className="metabloq_img"
                    />
                  </div>
                </div>
                <br />
                <div className="text-center">
                  <div className="font-weight-bold">
                    {collection.collection_name
                      ? collection.collection_name
                      : "Cute Things"}
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
                      <div className="bold">Title Name</div>
                      <input
                        type="text"
                        placeholder="eg.The Floating Pilot"
                        className="createitem_input"
                        // value={collection.collection_name}
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
                      <input
                      type={"number"}
                      max={100}
                      aria-label="Default select example"
                      className="createitem_input"
                      placeholder={"Royalties %"}
                      value={collection.royalties}
                      onChange={(e) => {
                        if(e.target.value<=100  && e.target.value>=0 ){
                          setCollection({
                            ...collection,
                            royalties: e.target.value,
                          });
                        }
                      }}
                      />
                      {/* <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => {
                          setCollection({
                            ...collection,
                            royalties: e.target.value,
                          });
                        }}
                      >
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                      </Form.Select> */}
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
                    <small>JPG, PNG, GIF or WEBP</small>
                    <br />
                    <label class="createitem_upload-button">
                      <RiUploadCloudFill color="white" /> <small>Upload</small>
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
                    <small>JPG, PNG, GIF or WEBP</small>
                    <br />
                    <label class="createitem_upload-button">
                      <RiUploadCloudFill color="white" /> <small>Upload</small>
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
                    <small>JPG, PNG, GIF or WEBP</small>
                    <br />
                    <label class="createitem_upload-button">
                      <RiUploadCloudFill color="white" /> <small>Upload</small>
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

            <Bounce>
              <div className="d-flex justify-content-center">
                <button
                  onClick={() => {
                    playSound();
                    pressingCreate();
                  }}
                  className="metablog_primary-filled-button"
                >
                  <span>Create Collection</span>
                </button>
              </div>
            </Bounce>
          </Stack>
        </Col>
      </Row>
    </div>
  );
}

export default CreateCollection;
