import React, { useState, useEffect } from "react";
import { Stack } from "react-bootstrap";
import CollectorsCollectionCard from "../../components/collectorsCollectionCards";
import CollectorsProfile from "../../components/collectorsprofile";
import NFTDetailsCards from "../../components/nftdetails/NFTDetailsCards";
import NFTDetailsList from "../../components/nftdetails/NFTDetailsList";
import { useDispatch, useSelector } from "react-redux";
import { postMethod } from "../../helpers/API&Helpers";
import LandNfts2 from "../../components/citiesHomeCollection/LandNfts2";
function CollectorsPage() {
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address, Marketplace, web3, Token, Collection ,allCollection} = reduxItems;
  const dispatch = useDispatch()
  const [collectionNfts, setcollectionNfts] = useState([]);
  const [parcels, setParcels] = useState({});
  // const [userCollection,setuserCollection] = useState([]);

  const result = allCollection.filter(data=> data.collection_category == "Land")

  const getdata = async () => {
    let staticUrl =  "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/nft/1661751917404testLand.json";
      
    const res = await fetch(staticUrl, { cache: "no-store" });
    const json = await res.json();
    console.log("resss", json?.ok);
    if (json.ok) {
      setParcels(json.data);
    }
  };
  const tokenCheck = async () => {
    try {
      const gettokens = await Collection.methods.getallIds(address).call();
      console.log("fdfdddf0", gettokens);
      let tokens = gettokens.map((x) => parseInt(x));
      console.log("parseInt", tokens);
      try {
        let url = "getUserNftoOnXDC";
        let params = {
          wallet: address,
          tokens: tokens,
        };
        let authtoken = "";
        let response = await postMethod({
          url,
          params,
          authtoken,
        });
        console.log(response);
        if (response.status) {
        }
      } catch (e) {
        console.log(e);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const getUserNftDetails = async () => {
    try {
      let url = "getUserNfts";
      let params = {
        wallet: address,
      };
      let authtoken = "";
      let response = await postMethod({
        url,
        params,
        authtoken,
      });
      console.log("dd", response);
      if (response.status) {
        setcollectionNfts(response.result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserCollection = async()=>{
    try{
      let url = "getCollection";
      let params = {
        wallet: address,
      };
      let authtoken = "";
      let response = await postMethod({url,params,authtoken});
      console.log("response user",response)
      if(response.status){
        dispatch({ type: "GETALLCOLLECTION", payload: response.result });
      }
    }catch(e){
      console.log("err in user collection")
    }
  }
  useEffect(() => {
    if (address != "") {
      getUserNftDetails();
      tokenCheck();
      getdata();
      getUserCollection();
    }
  }, [address]);

  return (
    <div className="metabloq_container">
      <Stack gap={5}>
        <CollectorsProfile />
        <CollectorsCollectionCard myprofile="myprofile" />
        {/* <NFTDetailsCards collectors="collectors" myprofile="myprofile"/> */}
        <NFTDetailsList
          collectionhome="collectionhome"
          collectionNfts={collectionNfts}
          myprofile="myprofile"
        />
        {address!='' && <LandNfts2 result={result[0]}  parcels={parcels} address={address} />}
      </Stack>
    </div>
  );
}

export default CollectorsPage;
