import React, { useState, useEffect } from "react";
import { Stack } from "react-bootstrap";
import CollectorsCollectionCard from "../../components/collectorsCollectionCards";
import CollectorsProfile from "../../components/collectorsprofile";
import NFTDetailsCards from "../../components/nftdetails/NFTDetailsCards";
import NFTDetailsList from "../../components/nftdetails/NFTDetailsList";
import { useDispatch, useSelector } from "react-redux";
import { postMethod, getMethod } from "../../helpers/API&Helpers";
import LandNfts2 from "../../components/citiesHomeCollection/LandNfts2";
function CollectorsPage() {
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { address, Marketplace, web3, Token, Collection ,allCollection} = reduxItems;
  const dispatch = useDispatch()
  const [collectionNfts, setcollectionNfts] = useState([]);
  const [parcels, setParcels] = useState([]);
  // const [userCollection,setuserCollection] = useState([]);
  var data ={
    "collection_id": "49",
    "collection_name": "test land",
    "collection_wallet": "0xeBA41eAa32841629B1d4F64852d0dadf70b0c665",
    "collection_nfts": null,
    "collection_category": "Land",
    "collection_blockchain": "xdc",
    "collection_royalties": 0,
    "collection_description": "des",
    "collection_logo_image": "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/1662701392552Logo.jpeg",
    "collection_featured_image": "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/1661751903229Featured.jpg",
    "collection_banner_image": "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/1662701397606Banner.jpeg",
    "collection_likes": "0",
    "collection_status": true,
    "collection_land_json": "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/nft/1661751917404testLand.json",
    "collection_createdat": "2022-08-29T00:15:58.736Z",
    "collection_ispreminted": false,
    "user_id": "42",
    "user_name": "pradeep",
    "user_email": "pradeep.sunrisetechs@gmail.com",
    "user_password": "Hello@123",
    "user_otp": "2658",
    "user_otp_expiration": "1662536819293",
    "user_created_at": "2022-09-07T02:01:59.575Z",
    "user_updated_at": "2022-09-07T02:01:59.575Z",
    "user_status": "active",
    "user_wallet": "0xeBA41eAa32841629B1d4F64852d0dadf70b0c665",
    "token": null,
    "subscriptionsid": null,
    "subscriptions_status": null,
    "icoID": null,
    "user_image": "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/collection/1662560194844.png"
}
  const result = allCollection.filter(data=> data.collection_category == "Land")

  const getdata = async (result) => {
    const parceldata=[]
    result.map( async(landres,i)=>{
      if(landres.collection_land_json){
        let staticUrl =  landres.collection_land_json
        // "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/nft/1661751917404testLand.json";
        //  https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/nft/1661751917404testLand.json
      const res = await fetch(staticUrl,{ cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        // setParcels(json.data);
        landres.parcels=json.data
        parceldata.push(landres)
        result[i].parcels=json.data
      }}
    })
   console.log("parceldata",result)
   setParcels(result)
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
  const getallcollection = async () => {
    let url = "getAllCollection";
    let authtoken = "";
    let response = await getMethod({ url, authtoken })
    if (response.status) {
    //  setallcollectionsdata(response.result)
     var  Collection = response.result
     const result = Collection.filter( data=> data.collection_category == "Land")
     getdata(result)
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
      if(response.status){
        dispatch({ type: "GETALLCOLLECTION", payload: response.result });
      }
    }catch(e){
      console.log("err in user collection")
    }
  }
  useEffect(() => {
    if (address != "") {
      getallcollection()
      getUserNftDetails();
      tokenCheck();
      // getdata();
      getUserCollection();
    }
  }, [address]);

  return (
    <div className="metabloq_container">
      <Stack gap={5}>
        <CollectorsProfile />
        <CollectorsCollectionCard myprofile="myprofile" />
        <NFTDetailsList
          collectionhome="collectionhome"
          collectionNfts={collectionNfts}
          myprofile="myprofile"
        />
        {address!='' && <LandNfts2 result={data}  parcels={parcels} address={address} />}
      </Stack>
    </div>
  );
}

export default CollectorsPage;
