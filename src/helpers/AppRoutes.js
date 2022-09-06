import React from "react";
import Header from "../components/header/Header";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/homepage/HomePage";
import NFTCollectionPage from "../pages/nftcollectionpage/NFTCollectionPage";
import NFTDetailsPage from "../pages/nftdetailspage/NFTDetailsPage";
import CollectorsPage from "../pages/collectorspage/CollectorsPage";
import LiveAuctionPage from "../pages/liveautionpage/LiveAuctionPage";
import CreateItemPage from "../pages/createitempage/CreateItemPage";
import CreateCollectionPage from "../pages/createcollectionpage/CreateCollectionPage";
import { LiveAuctionData } from "../components/liveauctions/LiveAuctionData";
import EditProfilePage from "../pages/editprofilepage/EditProfilePage";
import Ranking from "../components/ranking";
import Activity from "../components/activity";
import CollectablesHome from "../components/collectablesHome";
import NftDetailsParcels from "../components/nftdetailsparcels"
import LandPass from "../components/landPass";
import CitiesHomeCollection from "../components/citiesHomeCollection";
import ForgotPasswordEmail from "../components/signin/ForgotPasswordEmail";
import ForgotPassword from "../components/signin/ForgotPassword";
import SignUp from "../components/signup";
import VerifyEmail from "../components/signin/VerifyEmail";
import SignIn from "../components/signin";
import LandAirdrop from "../components/adminPop/LandAirdrop";
import NftAirdrop from "../components/adminPop/NftAirdrop";
import XdcAirdrop from "../components/adminPop/XdcAirdrop";

// export const AuthRoute = () => {
//   return (
//       <Routes>
//         <Route path="/signup" element={<SignUpPage/>}/>
//         <Route path="/signin" element={<SignInPage/>}/>
//         <Route path="/forgotpassword" element={<ForgotPassowrd />} />
//         <Route path="/forgotemail" element={<ForgotPasswordEmail />} />
//         <Route path="/emailverification" element={<VerifyEmail />} />
//       </Routes>
//   );
// };

export const AppRoutes = () => {
  const location = useLocation()
  return (
    <>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/:id" element={<NFTDetailsPage LiveAuctionData={LiveAuctionData}/>}/>
            <Route path="/collectionhome" element={<CollectablesHome/>}/>
            <Route path="liveauction" element={<LiveAuctionPage/>}/>
            <Route path="liveauction/:id" element={<NFTDetailsPage LiveAuctionData={LiveAuctionData}/>}/>
            <Route path="assets" element={<NFTCollectionPage/>}/>
            <Route path="collections/assets" element={<NFTCollectionPage/>}/>
            <Route path="collections/assets/:id" element={<NFTDetailsPage LiveAuctionData={LiveAuctionData}/>}/>
            <Route path="collections" element={<NFTCollectionPage collections="collections"/>}/>
            <Route path="assets/:id" element={<NFTDetailsPage LiveAuctionData={LiveAuctionData}/>}/>
            <Route path="collectors" element={<CollectorsPage/>}/>
            <Route path="collectors/signin" element={<SignIn/>}/>
            <Route path="collectors/activity" element={<Activity myprofile="myprofile"/>}/>
            <Route path="collectors/:id" element={<NFTDetailsPage LiveAuctionData={LiveAuctionData}/>}/>
            <Route path="collectors/editprofile" element={<EditProfilePage/>}/>
            <Route path="collectors/collectionhome" element={<CollectablesHome/>}/>
            <Route path="createcollection" element={<CreateCollectionPage/>}/>
            <Route path="createnft" element={<CreateItemPage/>}/>
            <Route path="ranking" element={<Ranking/>}/>
            <Route path="activity" element={<Activity/>}/>
            <Route path="collections/collectionhome" element={<CollectablesHome/>}/>
            <Route path="/collectionhome/:id" element={<NFTDetailsPage LiveAuctionData={LiveAuctionData}/>}/>
            <Route path="collections/citieshome" element={<CitiesHomeCollection/>}/>
            <Route path="collections/citieshome/:id" element={<NFTDetailsPage LiveAuctionData={LiveAuctionData}/>}/>
            <Route path="collections/landparcels/:id" element={<NftDetailsParcels/>}/>
            <Route path="newpage" element={<LandPass/>}/>

            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/forgotemail" element={<ForgotPasswordEmail />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/landairdrop" element={<LandAirdrop/>} />
            <Route path="/nftairdrop" element={<NftAirdrop />} />
            <Route path="/xdcairdrop" element={<XdcAirdrop />} />
            <Route path="*" element={<h1 className="text-center">404 NOT FOUND</h1>}/>
        </Routes>
    
    </>
  );
}
