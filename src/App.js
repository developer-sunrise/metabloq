import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "./redux/WalletAction";

import "./App.css";
import { AuthRoute, AppRoutes } from "./helpers/AppRoutes";
import useWindowDimensions from "./helpers/useWindowDimensions";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./helpers/ScrollToTop";
import Header from "./components/header/Header";
import SessionTimeout from "./helpers/session/SessionTimeout";
import { useLocation } from "react-router-dom";

const App = () => {
  const [isAuthenticated, setAuth] = useState(true);
  const wallet = useSelector((state) => state.WalletConnect);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { pathname } = useLocation();
  let path = pathname;
  let UserToken = localStorage.getItem("UserToken");
  const handleClick = () => {
    if (UserToken != null) {
      localStorage.clear();
      window.location.replace("/");
    }
  };

  useEffect(() => {
    const { web3Modal } = wallet;
    if (web3Modal.cachedProvider) {
      dispatch(connectWallet());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <>
        <ScrollToTop />
        <Header />
        <AppRoutes />
        {/* {path == "/signup" ||
        "/signin" ||
        "/forgotpassword" ||
        "/forgotemail" ||
        "/verifyemail" ? null : ( */}
          <Footer />
        {/* )} */}
        <SessionTimeout
          isAuthenticated={isAuthenticated}
          logOut={handleClick}
        />
      </>
    </div>
  );
};

export default App;
