import React, { useState, useEffect } from "react";
import NFTCollectionSection from "../../components/nftcollection";
import WavesBanner from "../../components/wavesbanner";
import "./NFTCollectionPage.css";
import { useDispatch, useSelector } from "react-redux";
import { postMethod, getMethod } from "../../helpers/API&Helpers";
function NFTCollectionPage(props) {
  let { collections } = props;
  const dispatch = useDispatch();
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { allCollection } = reduxItems;
  const getallcollection = async () => {
    let url = "getAllCollection";
    let authtoken = "";
    let response = await getMethod({ url, authtoken });

    if (response.status) {
      dispatch({ type: "GETALLCOLLECTION", payload: response.result });
    }
  };
  useEffect(() => {
    getallcollection();
  }, []);

  return (
    <div>
      <WavesBanner collections={collections} />
      <NFTCollectionSection collections={collections} />
    </div>
  );
}

export default NFTCollectionPage;
