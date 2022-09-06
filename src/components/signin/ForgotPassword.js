import React, { useEffect, useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";

import {  Stack } from "react-bootstrap";
import {  useLocation, useNavigate } from "react-router-dom";
import {Snackbar} from "@mui/material";
import { PasswordValidator,OtpValidator, postMethod } from "../../helpers/API&Helpers";
import MuiAlert from "@mui/material/Alert";


function ForgotPassword() {
  const [otp, setotp] = useState("");
  const [password1, setpassword1] = useState("");
  const [password2, setpassword2] = useState("");


  const [viewPwd1, setViewPwd1] = useState(true);
  const [viewPwd2, setViewPwd2] = useState(true);

  const [states, setStates] = useState({
    vertical: 'bottom',
    horizontal: 'center',
  });
  const { vertical, horizontal } = states;
  
  const navigate = useNavigate();
  const {state} = useLocation();
  console.log(state.mail)
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
  const viewIconClick1 = () => {
    if (viewPwd1 === false) {
      setViewPwd1(true);
    } else {
      setViewPwd1(false);
    }
  };
  const viewIconClick2 = () => {
    if (viewPwd2 === false) {
      setViewPwd2(true);
    } else {
      setViewPwd2(false);
    }
  };

  const SubmitClick = async(e) => {
    e.preventDefault();
    if(otp == ""){
      handleClick("warning", "Enter your otp");
      return;
    }else if(!OtpValidator(otp)){
      handleClick("warning", "Enter Should be Number only");
      return;
    }
    // else if (otp.length != 6) {
    //   handleClick("error", "Enter valid OTP");
    //   return;
    // }
    else if (password1 == "") {
      handleClick("warning", "Enter your password");
      return;
    } else if (!PasswordValidator(password1)) {
      handleClick(
        "warning",
        "Password must be 8 characters and should be atleast 1 capital letter , 1 small letter and 1 number"
      );
      return;
    }else if (password2 == "") {
      handleClick("warning", "Enter your password");
      return;
    } else if (!PasswordValidator(password2)) {
      handleClick(
        "warning",
        "Password must be 8 characters and should be atleast 1 capital letter , 1 small letter and 1 number"
      );
      return;
    }else if(password1 !== password2){
      handleClick("warning", "Both password should be same");
      return;
    }else{
      let pass1 = password1.trim();
      let pass2 = password2.trim();
      let url = "resetPassword";
      let params = {
        password: pass1,
        otp: otp,
        email:state.mail
      };
      let authtoken="";
      let response = await postMethod({ url, params ,authtoken});
      if (!response.status) {
        if(response.message == "User not found"){
          handleClick("error", response.message);
        return;
        }else if(response.message == "OTP is invalid"){
          handleClick("error", response.message);
          return;
        }else if(response.message == "OTP is expired"){
          handleClick("error", response.message);
          return;
        }else{
          handleClick("error", "something went wrong please try after sometimes");
          return;
        }
      } else {
        if (response.status) {
          setotp("");
          setpassword1("");
          setpassword2("");
          navigate("/signin");
          handleClick("success", "Password changed successfully");
        } else if (response.message == "User not found") {
          handleClick("error", "user not found");
          return;
        }
        else if (response.message == "otp expires") {
          handleClick("error", "OTP expired");
          return;
        }
        else if (response.message == "OTP is invalid") {
          handleClick("error", "OTP is incorrect");
          return;
        }
        else if(response.message =="Old password"){
          handleClick("error", "old password cannot be used");
          return;
        }
        else {
          handleClick("error", "Something went wrong, please try again later");
          return;
        }
      }
    }
  };
  useEffect(() => {
    if (state == null) {
      navigate(-1);
      return;
    }
  }, []);
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
        <form className="signup-form" onSubmit={SubmitClick}>
          <Stack gap={3}>
            <input
             value={otp}
             onChange={(e)=> setotp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              className="login_input" 
            />
            <div className="signup_password-input">
              <input
                type={viewPwd1 ? "password" : "input"}
                value={password1}
                onChange={(e) => setpassword1(e.target.value)}
                placeholder="Password"
                className="login_input"
                />
              <span onClick={viewIconClick1}>
                {viewPwd1 ? (
                  <BiShow color="#838383" size={18} />
                ) : (
                  <BiHide color="#838383" size={18} />
                )}
              </span>
            </div>
           <div className="signup_password-input">
              <input
                type={viewPwd2 ? "password" : "input"}
                value={password2}
                onChange={(e) => setpassword2(e.target.value)}
                placeholder="Retype Password"
                className="login_input"
                />
              <span onClick={viewIconClick2}>
                {viewPwd2 ? (
                  <BiShow color="#838383" size={18} />
                ) : (
                  <BiHide color="#838383" size={18} />
                )}
              </span>
            </div>
            <button type="submit" className="metablog_primary-filled-square-button">
              <small className="font-weight-bold">Submit</small>
            </button>
          </Stack>
        </form>
      </Stack>
    </div>
    </div>
  );
}

export default ForgotPassword;
