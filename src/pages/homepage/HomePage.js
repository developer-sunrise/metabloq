import React from "react";
import { Stack } from "react-bootstrap";
import "./HomePage.css";
import ExploreCategory from "../../components/explorecategory";
import HowItWorks from "../../components/howitworks";
import LiveAuctions from "../../components/liveauctions";
import Collections from "../../components/collections";
import Collectables from "../../components/collectables";
import Join from "../../components/join";
import ChooseUs from "../../components/chooseus";
import FAQs from "../../components/FAQs";
import Banner from "../../components/banner";

function HomePage() {
  return (
    <div>
      <Stack gap={5}>
        <Banner/>
        <HowItWorks />
        <LiveAuctions />
        <ExploreCategory />
        <Collections />
        <Collectables />
        <br />
        <Join />
        <br />
        <ChooseUs />
        <br /><br/><br/>
        <FAQs/>
      </Stack>
      <br />
      <br />
    </div>
  );
}

export default HomePage;
