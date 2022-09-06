import { Drawer } from "@mui/material";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import CollectorsCollectionCard from "../collectorsCollectionCards";
import ArtCollection from "./ArtCollection";
import BuildingCollection from "./BuildingCollection";
import MetapetsCollection from "./MetapetsCollection";
import MiscellaneousCollection from "./MiscellaneousCollection";
import VirtualCollection from "./VirtualCollection";
import WearablesCollection from "./WearablesCollection";
import WebFilter from "./WebFilter";

function CollectionTab(props) {
  return (
    <div className="filter-tabs raleway">
      <Tabs
        defaultActiveKey={activeTab.loadTab}
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab onClick={() => playSound()} eventKey="All Items" title="All Items">
          <CollectorsCollectionCard collections="collections" />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Art" title="Art">
          <ArtCollection art="Art" />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Buliding" title="Building">
          <BuildingCollection building="Buildings" />
        </Tab>
        <Tab
          onClick={() => playSound()}
          eventKey="Real Estate"
          title="Virtual Real Estate"
        >
          <VirtualCollection virtual="Virtual Real Estate" />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Meta Pets" title="Meta Pets">
          <MetapetsCollection meta="Meta pets" />
        </Tab>
        <Tab onClick={() => playSound()} eventKey="Wearables" title="Wearables">
          <WearablesCollection wear="Wearables" />
        </Tab>
        <Tab
          onClick={() => playSound()}
          eventKey="Miscellaneous"
          title="Miscellaneous"
        >
          <MiscellaneousCollection miscellaneous="Miscellaneous" />
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

export default CollectionTab;
