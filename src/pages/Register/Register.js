import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Col, Row, Button, Spinner, Form, FormGroup, Input } from 'reactstrap';
import FormErrors from '../../components/FormErrors';
import FieldErrors from '../../components/FieldErrors';
import { useSelector,useDispatch } from 'react-redux'

function Register(props) {
  const { AccountStore } = props;
  const { values, errors, loading } = AccountStore;
  const [email,setEmail]=useState('')
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate();

	const wallet = useSelector((state) => state.WalletConnect);
  const {address ,User} =wallet
  useEffect(() => {
    console.log("User",localStorage.getItem("UserToken"))
    console.log("userdata",User)
    if(User){
      AccountStore.setUsername(User.user_name)
      AccountStore.setEmail(User.user_email)
      AccountStore.setPassword(User.user_password)
      setUsername(User.user_name)
      setPassword(User.user_password)
      setEmail(User.user_email)
    }
    return () => { AccountStore.reset(); }
  }, [AccountStore]);


  const register = async()=>{
    console.log("username",username)
  
    var url=process.env.REACT_APP_BASE_URL //process.env.baseurl
    if(address != ""){
    try{
      const requestOptions = {
      method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  "Accept": "application/json"
			},
			body: JSON.stringify({ 
        "walletaddress":address,
        "username":username, 
        "password": password ,
        "email": email
       })
		  };
		  const response = await fetch(url + '/user/register', requestOptions)
      console.log('response',response)
    }catch(err){
      console.log('ERROR',err)
    }
  }else{
    alert("Connet Wallet")
  }
  }
  const proceeds = async()=>{
    const {address } = wallet;
    navigate('/validate',{ state: email })
    // if(address!=""){
    //   // console.log("address",address)
    //   var myHeaders = new Headers();
    //   myHeaders.append("Content-Type", "application/json");
    //   var raw = JSON.stringify({
    //     address: address,
    //     email:email
    //   });
    //   var requestOptions = {
    //     method: "POST",
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: "follow",
    //   };
    //   fetch(process.env.REACT_APP_BASE_URL+"findusersreg",requestOptions)
    //     .then((response) => response.json())
    //     .then((result) => {
    //       // console.log("result",result)
    //       if (result.status != true) {
    //         // console.log("findusersreg",result)
    //         // console.log(username,password,email)
    //         AccountStore.register()
    //           .then( async (res) => { 
    //             await register();
    //             console.log("res",res); 
    //             navigate('/validate',{email:email})})
    //           .catch(err => { console.log("error",err)})
    //       } else{ 
    //         console.log("/findusersreg",result)
    //         alert("wallet already register")
    //         navigate('/login')
    //       }
    //     })
    //     .catch((err)=>{console.log("ERRor",err)})
    //   }else{
    //     alert("please connect wallet")
    //   }
      }
  function handleUsernameChange(e) { AccountStore.setUsername(e.target.value);setUsername(e.target.value) }
  function handleEmailChange(e) { AccountStore.setEmail(e.target.value);setEmail(e.target.value) }
  function handlePasswordChange(e) { AccountStore.setPassword(e.target.value);setPassword(e.target.value) }
  async function handleSubmitForm(e) {
    e.preventDefault();
    await proceeds();
    // console.log(username,password,email)
    // console.log("data1",data1)
    // if(data1 == true){
    //   alert("wallet already working")
    // // AccountStore.register()
    // //   .then( async (res) => { await register();console.log(res); history.replace('/validate')})
    // //   .catch(err => { })
    // //   ;
    // }else if(data1 == false) {
    //   alert("wallet already register")
    // }
  }

  return (
    <Container className="register-container">
      <Row>
        <Col xs="12" md={{ size: 6, offset: 3 }}>
          <h1>Sign Up</h1>
          {/* <p>
            <Link to="/login">Have an account?</Link>
          </p> */}

          <FormErrors errors={errors} />

          <Form onSubmit={handleSubmitForm}>
            <FormGroup>
              <Input
                type="text" placeholder="Username" bsSize="lg" value={values.username} onChange={handleUsernameChange}
                className={errors && errors.fields && errors.fields.username && 'is-invalid'}
              ></Input>
              <FieldErrors errors={errors} field="username" />
            </FormGroup>

            <FormGroup>
              <Input
                type="email" placeholder="Email" bsSize="lg" value={values.email} onChange={handleEmailChange}
                className={errors && errors.fields && errors.fields.email && 'is-invalid'}
              ></Input>
              <FieldErrors errors={errors} field="email" />
            </FormGroup>

            <FormGroup>
              <Input
                type="password" placeholder="Password" bsSize="lg" value={values.password} onChange={handlePasswordChange}
                className={errors && errors.fields && errors.fields.plainPassword && 'is-invalid'}
              ></Input>
              <FieldErrors errors={errors} field="plainPassword" />
            </FormGroup>

            <Button color="primary" size="lg" disabled={loading} className="d-flex align-items-center">
              {loading && <Spinner size="sm" className="mr-2" />}
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default inject('AccountStore')(observer(Register));
