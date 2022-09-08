import React, { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {Snackbar} from "@mui/material";
import { EmailValidator, PasswordValidator, postMethod } from "../../helpers/API&Helpers";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";

function SignIn() {
  const dispatch =useDispatch()
  const wallet = useSelector((state) => state.WalletConnect);
  const { address}= wallet
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const [viewPwd, setViewPwd] = useState(true);

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

  const viewIconClick = () => {
    if (viewPwd === false) {
      setViewPwd(true);
    } else {
      setViewPwd(false);
    }
  };

  const LoginSubmit = async(e) => {
    e.preventDefault();
    if(!address){
      handleClick("warning", "Connect Wallet , Please ensure you will continue to use same wallet for all your transactions in Metablogs ");
      return;
    }else{
      handleClick("warning", "Please ensure you will continue to use same wallet for all your transactions in Metablogs");
    }
    if (email == "") {
      handleClick("warning", "Enter your email");
      return;
    } else if (!EmailValidator(email)) {
      handleClick("warning", "Enter valid email");
      return;
    } else if (password == "") {
      handleClick("warning", "Enter your password");
      return;
    }else{
      let mail = email.trim();
      let pass = password.trim();
      let url = "signin";
      let params = {
        email: mail,
        password: pass,
        address:address,
      };
      let authtoken = "";
      let response = await postMethod({ url, params, authtoken });
      if (!response.status) {
        if(response.message == "User not found"){
          handleClick("error","User not found, Please Register");
          return;
        }else if(response.message == "Password is incorerect"){
          handleClick("error", "Password is Incorrect");
          return;
        }else{
          handleClick("error", "something went wrong please try after sometimes");
          return;
        }
        
      } else {
        if (response.status) {
          
          const user =response.user
          console.log("user",user)
          if(response.user){
            dispatch({
              type: "UPDATE_USER",
              payload: response.user,
            })
          }
          if(user.user_wallet){
            if(user.user_wallet==address){
              const jsonValue = JSON.stringify(response.userToken);
              console.log("jsonValue",jsonValue)
              localStorage.setItem("UserToken", jsonValue);
              var data ={email:user.user_email,user_name:user.user_name,profileImage:user.user_image,wallet:user.user_wallet}
              const jsonObj = JSON.stringify(data);
              localStorage.setItem("Userdata", jsonObj);
              navigate("/");
              setemail("");
              setpassword("");
            }else{
              handleClick("error", 'you can’t switch the wallet');
            }
          }else{
            const jsonValue = JSON.stringify(response.userToken);
              console.log("jsonValue",jsonValue)
              localStorage.setItem("UserToken", jsonValue);
              var data ={email:user.user_email,user_name:user.user_name,profileImage:user.user_image,wallet:user.user_wallet}
              const jsonObj = JSON.stringify(data);
              localStorage.setItem("Userdata", jsonObj);
              navigate("/");
              setemail("");
              setpassword("");
          }
          
          
        } else if (response.message == "User not found") {
          handleClick("error", response.message);
        } else {
          handleClick("error", "Something went wrong, please try again later");
        }
      }
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
        <h4 className="font-weight-bold text-center">Welcome</h4>
        {/* <h5 className="font-weight-bold text-center">Please ensure you will continue to use same wallet for all your transactions in Metablogs</h5> */}
        <form className="signup-form" onSubmit={LoginSubmit}>
          <Stack gap={3}>
            <input
             value={email}
             onChange={(e)=> setemail(e.target.value)}
              type="text"
              placeholder="Email Address"
              className="login_input" 
            />
               <div className="signup_password-input">
              <input
                type={viewPwd ? "password" : "input"}
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Password"
                className="login_input"
              />
              <span onClick={viewIconClick}>
                {viewPwd ? (
                  <BiShow color="#838383" size={18} />
                ) : (
                  <BiHide color="#838383" size={18} />
                )}
              </span>
            </div>
            <button type="submit" className="metablog_primary-filled-square-button">
              <small className="font-weight-bold">Log In</small>
            </button>
          </Stack>
        </form>
        <div className="d-flex justify-content-between">
          <button onClick={()=> navigate("/forgotemail")} className="metablog_gradient-borderless-button">
            <small>Forget password?</small>
          </button>
          <button onClick={()=> navigate("/signup")} className="metablog_gradient-borderless-button">
            <small>Register</small>
          </button>
        </div>
      </Stack>
    </div>
    </div>
  );
}

export default SignIn;
