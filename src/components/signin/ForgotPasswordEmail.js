import React, { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";

import {  Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {Snackbar} from "@mui/material";
import { EmailValidator, postMethod } from "../../helpers/API&Helpers";
import MuiAlert from "@mui/material/Alert";

function ForgotPasswordEmail() {
  const [email, setemail] = useState("");
  const navigate = useNavigate();
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

  const getOTP = async(e) => {
    e.preventDefault();
    if (email == "") {
      handleClick("warning", "Enter your email");
      return;
    } else if (!EmailValidator(email)) {
      handleClick("warning", "Enter valid email");
      return;
    }else{
      let mail = email.trim();
      let url = "forgotPassword";
      let params = {
        email: mail,
      };
      let authtoken="";
      let response = await postMethod({ url, params ,authtoken});
      if (!response.status) {
        handleClick("error", "Something went wrong, please try again later");
        return;
      } else {
        if (response.status) {
            navigate("/forgotpassword", {
              state: {mail:mail },
            });
        } else if (response.message == "User not found") {
          handleClick("error", "Email user not found");
          return;
        } else {
          handleClick("error", "Something went wrong, please try again later");
          return;
        }
      }
      setemail("");
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
        <h6 className="text-center text-light lufga">We will send OTP to your registered <br/> email to reset your password</h6>
        <form className="signup-form" onSubmit={getOTP}>
          <Stack gap={3}>
            <input
             value={email}
             onChange={(e)=> setemail(e.target.value)}
              type="text"
              placeholder="Email Address"
              className="login_input" 
            />
            <button type="submit" className="metablog_primary-filled-square-button">
              <small className="font-weight-bold">Get OTP</small>
            </button>
          </Stack>
        </form>
      </Stack>
    </div>
    </div>
  );
}

export default ForgotPasswordEmail;
