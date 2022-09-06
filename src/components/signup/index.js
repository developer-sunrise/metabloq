import React, { useState } from "react";
import "./Styles.css";
import { Stack } from "react-bootstrap";
import { BiShow, BiHide } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {Snackbar} from "@mui/material";
import { PasswordValidator,EmailValidator, postMethod } from "../../helpers/API&Helpers";
import MuiAlert from "@mui/material/Alert";

function SignUp() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [states, setStates] = useState({
    vertical: 'bottom',
    horizontal: 'center',
  });
  const { vertical, horizontal } = states;

  const [viewPwd, setViewPwd] = useState(true);
  const navigate = useNavigate();

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

  const viewIconClick = () => {
    if (viewPwd === false) {
      setViewPwd(true);
    } else {
      setViewPwd(false);
    }
  };

  const createAccount = async(e) => {
    e.preventDefault();
    if(username == ""){
      handleClick("warning", "Enter your name");
      return;
    }else if (email == "") {
      handleClick("warning", "Enter your email");
      return;
    } else if (!EmailValidator(email)) {
      handleClick("warning", "Enter valid email");
      return;
    } else if (password == "") {
      handleClick("warning", "Enter your password");
      return;
    } else if (!PasswordValidator(password)) {
      handleClick(
        "warning",
        "Password must be minimum eight characters, at least one uppercase, one lowercase, one number and one special character"
      );
      return;
    }else{
      let mail = email.trim();
      let pass = password.trim();
      let url = "Signup";
      let params = {
        email: mail,
        password: pass,
        username: username,
      };
      let authtoken="";
      let response = await postMethod({ url, params,authtoken });
      console.log("response",response)
      if (!response.status) {
        if(response.message == "Please enter a valid password"){
          handleClick("error",response.message);
          return;
        }else if(response.message == "Email already exist"){
          handleClick("error",response.message);
          return; 
        }
        else if(response.message == "Please enter a valid email"){
          handleClick("error",response.message);
          return;
        }else{
          handleClick("error", "Something went wrong, please try again later");
          return;
        }
      } else {
        if (response.status) {
          navigate("/verifyemail", {state: {mail:mail }});
          setusername("");
          setemail("");
          setpassword("");
        } else if (!response.status) {
          handleClick("error", response.result);
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
        <h4>Create Account</h4>
        <form className="signup-form" onSubmit={createAccount}>
          <Stack gap={3}>
            <input
              value={username}
              onChange={(e) => setusername(e.target.value)}
              type="text"
              placeholder="User Name"
              className="login_input"
            />
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
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
            <button
              type="submit"
              className="metablog_primary-filled-square-button"
            >
              <small className="font-weight-bold">Create Account</small>
            </button>
          </Stack>
        </form>
        <div className="d-flex justify-content-center">
          <span>Already have an account?</span>
          <button onClick={()=> navigate("/signin")} className="metablog_gradient-borderless-button">
            <small>Login</small>
          </button>
        </div>
      </Stack>
    </div>
    </div>
  );
}

export default SignUp;
