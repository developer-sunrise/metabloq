import "./Styles.css";
import { Row, Col, Stack, Image } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Country, State, City } from 'country-state-city';
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { ReactS3Client1, ReactS3Client2, ReactS3Client4, postMethod } from "../../helpers/API&Helpers";
import { Navigate, useNavigate } from "react-router-dom";
const uploadimg = require("../../assets/loading.gif").default
const profilepic = require('../../assets/profile/blankprofile.png').default
function EditProfile() {
  const wallet = useSelector((state) => state.WalletConnect)
  const navigate = useNavigate()
  const { address, User } = wallet
  const [uploadedImg, setUploadedImg] = useState();
  const [phoneCode, setPhoneCode] = useState();
  const [Email, setEmail] = useState();
  const [Username, setUsername] = useState();
  const [Facebooklink, setFacebooklink] = useState('');
  const [Instagramlink, setInstagramlink] = useState('');
  const [Twitterlink, setTwitterlink] = useState('');
  const [Telegramlink, setTelegramlink] = useState('');
  const [Profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);

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
  const getBase64 = async (e) => {
    var date = new Date()
    var timeStamp = date.getTime()
    var file = e.target.files[0];
    let name = file.name;
    let extension = "." + name.split(".").pop();
    let filename = timeStamp + extension;

    try {
      var final = await fetch(process.env.REACT_APP_BASE_URL + "json")
      var finalJson = await final.json()
      console.log("filenamegsadb", finalJson.ok)
      const data = await ReactS3Client2.uploadFile(JSON.stringify(finalJson.result), filename);
      console.log("teasssa", data)
      if (data.status === 204) {
        // setProfilePicture(data.location);
        // setUploadedImg(data.location);
      } else {
      }
    } catch (err) {
      // console.log("error image uploading", err);
    }
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   setUploadedImg(reader.result);
    // };
    // reader.onerror = function (error) {
    //   console.log("Error: ", error);
    // };
  };
  const insertImageintoS3 = async (e, type) => {
    setLoading(true)
    var file = e.target.files[0];
    var timeStamp = Date.now()
    let name = file.name;
    let extension = "." + name.split(".").pop();
    let filename = timeStamp + extension;
    try {
      const data = await ReactS3Client4.uploadFile(file, filename);
      var userprofile = JSON.parse(localStorage.getItem('Userdata'))
      userprofile.profileImage = data.location
      const jsonObj = JSON.stringify(userprofile);
      localStorage.setItem("Userdata", jsonObj);
      setProfile(data.location)
      if (Email) {
        let url = "updateimage";
        let params = {
          image: data.location,
          email: Email
        }
        let authtoken = "";
        let response = await postMethod({ url, params, authtoken })
        console.log("response", response)
      }
      // navigate("/collectors") 
      setLoading(false)
    } catch (err) {
      console.log("ERROR", err)
      setLoading(false)
    }
  }
  const userprofileupdate = async () => {
    if (Email) {
      let url = "updateuserprofile";
      let params = {
        // image: data.location,
        email: Email,
        facebooklink:Facebooklink,
        twitterlink:Twitterlink,
        telegramlink:Telegramlink,
        instagramlink:Instagramlink
      }
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken })
      console.log("response", response)
      var userprofile = JSON.parse(localStorage.getItem('Userdata'))
      userprofile.facebooklink = Facebooklink
      userprofile.twitterlink = Twitterlink
      userprofile.telegramlink = Telegramlink
      userprofile.instagramlink = Instagramlink
      const jsonObj = JSON.stringify(userprofile);
      localStorage.setItem("Userdata", jsonObj);
      handleClick("success", "Profile Updated");
      navigate('/')
    } 
  }
  const addressFromik = useFormik({
    initialValues: {
      country: "India",
      state: null,
      city: null
    },
    onSubmit: (values) => console.log("submit", JSON.stringify(values))
  });

  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.id,
    ...country
  }));
  const updatedStates = (countryId) =>
    State
      .getStatesOfCountry(countryId)
      .map((state) => ({ label: state.name, value: state.id, ...state }));
  const updatedCities = (stateId) =>
    City
      .getCitiesOfState(stateId)
      .map((city) => ({ label: city.name, value: city.id, ...city }));

  const { values, handleSubmit, setFieldValue, setValues } = addressFromik;

  useEffect(() => {
    var userprofile = JSON.parse(localStorage.getItem('Userdata'))
    console.log("User", userprofile.email)
    if (userprofile) {
      setUsername(userprofile.user_name)
      setEmail(userprofile.email)
      setFacebooklink(userprofile.facebooklink)
      setTelegramlink(userprofile.telegramlink)
      setTwitterlink(userprofile.twitterlink)
      setInstagramlink(userprofile.instagramlink)
      if (userprofile.profileImage) {
        setProfile(userprofile.profileImage)
      }
    }
    // setUsername()
  }, [User]);

  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
   
    <div className="editprofile_container">
      <Row>
        <div>Profile Photo</div>
        <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
          <div className="editprofile_imgupload-box h-100">
            {!uploadedImg ? (
              <div>
                <Stack gap={2}>
                  {
                    Profile ?
                      <Image
                        fluid
                        src={Profile}
                        alt="upload"
                        height={80}
                        width={80}
                        className="mx-auto"
                      />
                      :
                      <Image
                        fluid
                        src={profilepic}
                        alt="upload"
                        height={80}
                        width={80}
                        className="mx-auto"
                      />

                  }

                  {/* <h4 className="text-center">
                    Drag and drop <br />
                    files to upload
                  </h4> */}
                  {/* <div className="text-center">OR</div> */}
                  <label class="metablog_primary-filled-square-button">
                    <small>Browse</small>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={insertImageintoS3}
                    />
                    {
                      loading ?
                        <img src={uploadimg} style={{ width: "30px", height: "30px" }} />
                        :
                        null
                    }

                  </label>
                </Stack>
              </div>
            ) : (
              <Image fluid src={uploadedImg} alt="img" className="h-100" />
            )}
          </div>
        </Col>

        <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="mb-3">
          <form onSubmit={handleSubmit}>
            <Stack gap={2} direction="horizontal" className="d-flex">
              <div className="fieldgap" >
                <span>First Name</span>
                <input
                  type="text"
                  placeholder="mobina"
                  className="editprofile_input"
                  value={Username}
                // onChange={(e)=>setUsername(e.target.value)}
                />
              </div>
            </Stack>
            <div className="fieldgap">
              <span>Email</span>
              <input
                type="text"
                placeholder="Enter value"
                className="editprofile_input"
                value={Email}
              // onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div className="fieldgap">
              <span>FaceBook</span>
              <input
                type="text"
                placeholder="Enter FaceBook Link"
                className="editprofile_input"
                value={Facebooklink}
                onChange={(e) => setFacebooklink(e.target.value)}
              />
            </div>
            <div className="fieldgap">
              <span>Instagram</span>
              <input
                type="text"
                placeholder="Enter Instagram Link"
                className="editprofile_input"
                value={Instagramlink}
                onChange={(e) => setInstagramlink(e.target.value)}
              />
            </div>
            <div className="fieldgap" >
              <span>Twitter</span>
              <input
                type="text"
                placeholder="Enter Twitter Link"
                className="editprofile_input"
                value={Twitterlink}
                onChange={(e) => setTwitterlink(e.target.value)}
              />
            </div>
            <div className="fieldgap" >
              <span>Telegram</span>
              <input
                type="text"
                placeholder="Enter Telegram Link"
                className="editprofile_input"
                value={Telegramlink}
                onChange={(e) => setTelegramlink(e.target.value)}
              />
            </div>
            {/* <div className="checking-div">
            <span>Phone Number</span>
            <Stack gap={2} direction="horizontal">
              <div className="w-25">
                <PhoneInput
                  defaultCountry="IN"
                  placeholder="+91"
                  value={phoneCode}
                  onChange={setPhoneCode}
                />
              </div>
              <div className="w-75">
                <input
                  type="text"
                  placeholder="9120000000"
                  className="editprofile_input"
                />
              </div>
            </Stack>
          </div> */}
            {/* <div className="dummy-wrapper">
            <span>Country</span>
            <Select
              id="country"
              name="country"
              label="country"
              options={updatedCountries}
              value={values.country}
              onChange={(value) => {
                setValues({ country: value, state: null, city: null }, false);
              }}
            />
          </div> */}
            {/* <div className="dummy-wrapper">
            <span>State</span>
            <Select
              id="state"
              name="state"
              options={updatedStates(
                values.country ? values.country.value : null
              )}
              value={values.state}
              onChange={(value) => {
                setValues({ state: value, city: null }, false);
              }}
            />
          </div> */}
            {/* <div className="dummy-wrapper">
            <span>City</span>
            <Select
              id="city"
              name="city"
              options={updatedCities(values.state ? values.state.value : null)}
              value={values.city}
              onChange={(value) => setFieldValue("city", value)}
            />
          </div> */}
            <div className="d-flex mt-2">
              <button onClick={()=>userprofileupdate()} type="submit" className="metablog_primary-filled-square-button">
                <font size="2">Save</font>
              </button>
            </div>
          </form>
        </Col>
      </Row>
    </div>
    </>
  );
}

export default EditProfile;
