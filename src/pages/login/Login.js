import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Col, Row, Button, Spinner, Form, FormGroup, Input } from 'reactstrap';
 import FormErrors from '../../components/FormErrors';
 import { useDispatch, useSelector } from "react-redux";

function Login(props) {
  const { AccountStore } = props;
  const { values, errors, loading } = AccountStore;
  const [username,setusername]= useState("");
  const [password,setpassword]=useState("");
  const [email,setemail]=useState("");
  const [tokens,settokens]=useState("");
  const navigate = useNavigate();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address } = reduxItems;
  useEffect(() => {
    // console.log('props1',props.location.state.data.username)
    // console.log('props2',props.location.state.data.password)
    // if(props.location.state && props.location.state.data.username !=" " && props.location.state.data.username != null && props.location.state.data.username != undefined ){
    // if(username !=" " && username != null && username != undefined ){
    //   // if(props.location.state.data.password !=" " && props.location.state.data.password != null && props.location.state.data.password != undefined ){
    //   if(password !=" " && password != null && password != undefined ){
    //       AccountStore.setUsername(username); 
    //       AccountStore.setPassword(password); 
    //     tokencreate();
    //   }
    // }
    var userprofile = JSON.parse(localStorage.getItem('Userdata'))
    if (userprofile) {
      // console.log("User", userprofile.profileImage)
      setemail(userprofile.email)
    }
    return () => { AccountStore.reset(); }
  }, [AccountStore]);

const tokencreate =async()=>{
  // console.log('username',props.location.state.data.username)
  // console.log('password',props.location.state.data.password)
  // console.log('walletaddress',props.location.state.data.walletaddress)

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    // username: props.location.state.data.username,
    // password: props.location.state.data.password,
    username: username,
    password: password,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch(process.env.REACT_APP_BASE_URL+"tokencreate", requestOptions)
    .then((response) => response.json())
    .then((result) => {
     var token = result.token
     settokens(token)
      if (result.status ==true){
      inserttoken(token);
      }else{
        console.log("tokencreaction fail")
      }
})
}

const inserttoken =async(token)=>{
  console.log("inserttoken")
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    walletaddress: address,
    token: token,
    // email: props.location.state.data.email,
    useremail: email,
    // subscriptions_status:props.location.state.data.subscriptions_status?props.location.state.data.subscriptions_status  : "Pending"
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch(process.env.REACT_APP_BASE_URL+"inserttoken", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("result",result)
      if (result.status ==true){
        var ico = result.subscriptionsid
        loginfunction(ico)
      }else{
        console.log("tokencreaction fail")
      }
})
}
 const loginfunction = async(ico)=>{
 console.log("icovalue",ico)
 
 if(ico !="" && ico !=null )

  AccountStore.login()
  .then(() => {navigate(`/Subscription/${ico}`)})
  .catch(err => {
    if (err && err.response && err.response.status === 403) {
      navigate('/validate')
    }
  })
  ;

 }

  function handleUsernameChange(e) { setusername (e.target.value);AccountStore.setUsername(e.target.value); }
  function handlePasswordChange(e) {setpassword(e.target.value); AccountStore.setPassword(e.target.value); }
  function handleSubmitForm(e) {
    e.preventDefault();
    tokencreate()

    // AccountStore.login()
    //   .then(() => {navigate('/Subscription')})
    //   .catch(err => {
    //     if (err && err.response && err.response.status === 403) {
    //       navigate('/validate')
    //     }
    //   })
      ;
  };

  return (
    <Container className="login-container">
      <Row>
        <Col xs="12" md={{ size: 6, offset: 3 }}>
          <h1>Sign In</h1>
          <Row className="justify-content-between">
            <Col xs="12" md={{ size: 'auto' }}>
              <p>
                <Link to="/register">Need an account?</Link>
              </p>
            </Col>
            {/* <Col xs="12" md={{ size: 'auto' }}>
              <Link to="/password-reset/request">Forgot password?</Link>
            </Col> */}
          </Row>
          <FormErrors errors={errors} />
          <Form onSubmit={handleSubmitForm}>
            <FormGroup>
              <Input type="text" placeholder="Username" bsSize="lg" value={values.username} onChange={handleUsernameChange}></Input>
            </FormGroup>
            <FormGroup>
              <Input type="password" placeholder="Password" bsSize="lg" value={values.password} onChange={handlePasswordChange}></Input>
            </FormGroup>
            <Button color="primary" size="lg" disabled={loading} className="d-flex align-items-center">
              {loading && <Spinner size="sm" className="mr-2" />}
              Sign In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default inject('AccountStore')(observer(Login));
