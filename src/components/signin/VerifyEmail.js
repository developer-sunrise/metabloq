import React, { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";

import {  Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {Snackbar} from "@mui/material";
import { OtpValidator, postMethod } from "../../helpers/API&Helpers";
import MuiAlert from "@mui/material/Alert";


function VerifyEmail() {
  const [otp, setotp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [states, setStates] = useState({
    vertical: 'bottom',
    horizontal: 'center',
  });
  const { vertical, horizontal } = states;
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

  const Next = async(e) => {
    e.preventDefault();
    if(otp == ""){
      handleClick("warning", "Enter your otp");
      return;
    }else if(!OtpValidator(otp)){
      handleClick("warning", "Enter Should be Number only");
      return;
    }
    else{
      let url = "userVerification";
      let params = {
        email: state.mail,
        otp: otp,
      };
      let authtoken="";
      let response = await postMethod({ url, params,authtoken });
      if (!response.status) {
        if(response.message == "OTP is expired"){
          handleClick("error", response.message);
          return;
        }else if(response.message == "OTP is invalid"){
          handleClick("error", "Entered OTP is incorrect");
        }
        else{
          handleClick("error", "Something went wrong, Check the entered OTP");
          return;
        }
      } else {
        if (response.status) {
           navigate("/signin");
        } else if (response.message == "OTP is invalid") {
          handleClick("error", "Entered OTP is incorrect");
        } else if (response.message == "OTP is expired") {
          handleClick("error", "OTP Expired");
        }
      }
      setotp("");
    }
  };
  return (
    <div className='signuppage_container'>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    <div className="signup_container">
      <Stack gap={3}>
        <div className="text-right">
          <font size="1">English (IN)</font>
        </div>
        <h6 className="text-center text-light lufga">Please enter the OTP sent to your <br/>
        registered email to verify your account.</h6>
        <form className="signup-form" onSubmit={Next}>
          <Stack gap={3}>
            <input
             value={otp}
             onChange={(e)=> setotp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              className="login_input" 
            />
            <button type="submit" className="metablog_primary-filled-square-button">
              <small className="font-weight-bold">Verify</small>
            </button>
          </Stack>
        </form>
      </Stack>
    </div>
    </div>
  );
}

export default VerifyEmail;
