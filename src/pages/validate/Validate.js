import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Col, Row, Button, Spinner, Form, FormGroup, Input } from 'reactstrap';
import FormErrors from '../../components/FormErrors';
import FieldErrors from '../../components/FieldErrors';
import {useSelector } from "react-redux";

function Validate(props) {
  const { AccountStore } = props;
  const { values, errors, loading } = AccountStore;
  const navigate = useNavigate();
  const wallet = useSelector((state) => state.WalletConnect);
  const {address } = wallet;
  useEffect(() => {
    return () => { AccountStore.reset(); }
  }, [AccountStore]);

  function handleCodeChange(e) { AccountStore.setCode(e.target.value); }
  function handleSubmitForm(e) {
    if(!address){
      alert("Connect Wallet")
      return
    }
    e.preventDefault();
    AccountStore.validate()
      .then(() =>{proceed()})
      .catch(err => {
        if (err && err.response && err.response.status === 401) {
          navigate('/')
        }
      })
  };


  const proceed = async()=>{
    let email =props.location.state.data.email
    if(!address){
      alert("Connect Wallet")
      return
    }
    if(email){
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        address: address,
        email:email
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(process.env.REACT_APP_BASE_URL+"findusers",requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("token", result);
          if (result.status == false) {
            if(result.description == "Function Failed"){
              alert("Function Failed")
            }else{
              navigate("/register");
            }
          } else {
            // if (result.subscription != 'completed') {
              console.log("db_status", result.description[0]);
              navigate("/login", { data: result.description[0],token:result.jwt });
            // } else {
            //   BuyToken()
            // }
          }
        })
    }else{
      alert("Function Failed")
    }
     
  }
  


  return (
    <Container className="account-validate-container">
      <Row>
        <Col xs="12" md={{ size: 6, offset: 3 }}>
          <h1>Validate account</h1>
          <p>
            <Link to="/validate/resend">Resend validation code?</Link>
          </p>
          <FormErrors errors={errors} />
          <Form onSubmit={handleSubmitForm}>
            <FormGroup>
              <Input
                type="text" placeholder="Code" bsSize="lg" value={values.code} onChange={handleCodeChange}
                className={errors && errors.fields && errors.fields.code && 'is-invalid'}
              ></Input>
              <FieldErrors errors={errors} field="code" />
            </FormGroup>
            <Button color="primary" size="lg" disabled={loading} className="d-flex align-items-center">
              {loading && <Spinner size="sm" className="mr-2" />}
              Validate
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default inject('AccountStore')(observer(Validate));
