import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Col, Row } from 'reactstrap';
import ListWrapper from '../../components/Subscription/ListWrapper';
// const logo = require("../../assets/images/logo.png");


function SubscriptionList(props) {
  const location = useLocation();
  const { SubscriptionStore } = props;
  const { subscriptions, loading } = SubscriptionStore;

  useEffect(() => {
    SubscriptionStore.loadSubscriptions();
    console.log("location",location)
  }, [SubscriptionStore]);

  return (
    <Container className="subscriptions-container">
{/* <div><Link to="/userbuy"><img src={logo} alt="logo" className="main_logo my-2"/></Link></div> */}

      <Row>
        <Col>
          <Row className="justify-content-md-between align-items-md-center mb-3">
            <Col xs="12" md={{ size: 'auto' }}>
              <h1>Subscription <small>list</small></h1>
            </Col>
            {/* <Col xs="12" md={{ size: 'auto' }}>
              <Link to={`${location}/new`} className="btn btn-primary w-100">New</Link>
            </Col> */}
          </Row>

          <ListWrapper
            subscriptions={subscriptions}
            loading={loading}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default inject('SubscriptionStore')(observer(SubscriptionList));
