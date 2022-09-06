import { Drawer } from "@mui/material";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import NFTCollectionCards from "../nftcollection/NFTCollectionCards";
import AuthorSort from "./AuthorSort";
import CollectionSort from "./CollectionSort";
import HighestBidSort from "./HighestBidSort";
import WebFilter from "./WebFilter";

function AssetTab(props) {
  return (
    <div className="filter-tabs raleway">
      <Tabs
        defaultActiveKey={activeTab.loadTab}
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab onClick={() => playSound()} eventKey="All Items" title="All Items">
          <NFTCollectionCards />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Art" title="Art">
          <HighestBidSort />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Buliding" title="Building">
          <CollectionSort />
        </Tab>
        <Tab
          onClick={() => playSound()}
          eventKey="Real Estate"
          title="Virtual Real Estate"
        >
          <AuthorSort />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Meta Pets" title="Meta Pets">
          <NFTCollectionCards />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Wearables" title="Wearables">
          <CollectionSort />
        </Tab>
        <Tab
          onClick={() => playSound()}
          eventKey="Miscellaneous"
          title="Miscellaneous"
        >
          <HighestBidSort />
        </Tab>
        <Tab
          className="ms-auto"
          title={
            <div
              onClick={() => {
                setShowFilter(true);
                playSound();
              }}
              className="nftcollection_filter-div-gradient"
            >
              <small className="d-flex align-items-center">
                Filter & Sort <FiFilter />
              </small>
            </div>
          }
        ></Tab>
      </Tabs>

      <Drawer
        anchor="right"
        open={showFilter}
        onClose={() => setShowFilter(false)}
        style={{ width: "30% !important" }}
        PaperProps={{
          sx: { width: "60%" },
          style: { width: "25%" },
        }}
      >
        <WebFilter
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          rangeSlider={rangeSlider}
          rangeSliderChange={rangeSliderChange}
          horizontalLabels={horizontalLabels}
          collections={collections}
        />
      </Drawer>
    </div>
  );
}

export default AssetTab;
