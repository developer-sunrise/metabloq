import React, { useEffect, useState } from "react";
import { Col, Image, Row, Stack, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEye, AiTwotoneHeart } from "react-icons/ai";
import { MdOutlineSend } from "react-icons/md";
import "./Styles.css";
import Fade from "react-reveal/Fade";
import useSound from "use-sound";
import buttonSound from "../../assets/audio/button.wav";
import { useParams } from "react-router-dom";
import PlacebidModal from "../placebidModal";
import BuynowModal from "../buynowModal";
import Atlas from "../atlas";
import { ReactS3Client2 } from "../../helpers/API&Helpers";
const avatar1 = require("../../assets/profilepics/face7.jpg");
const avatar2 = require("../../assets/profilepics/face8.jpg");
const avatar3 = require("../../assets/profilepics/face9.jpg");
const avatar4 = require("../../assets/profilepics/face5.jpg");
const bloqs = require("../../assets/logo_block.png");
const time_icon = require("../../assets/auction/time_icon.png");
function NFTDetails(props) {
  const { id } = useParams();
  let { LiveAuctionData } = props;
  const [playSound] = useSound(buttonSound);
  const reduxItems = useSelector((state) => state.WalletConnect);
  const { Land, address } = reduxItems;
  const dispatch = useDispatch();
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedAxis, setSelectedAxis] = useState([]);
  const [parcels, setParcels] = useState(null);
  const placeModalClose = () => {
    setPlaceModalOpen(false);
  };
  const buyModalClose = () => {
    setBuyModalOpen(false);
  };
  const reloadPage = () => {
    window.location.reload();
    console.log("relooooaaaaaaadddd");
  };
  const placebidClick = () => {
    setPlaceModalOpen(true);
    playSound();
  };
  const buyClick = () => {
    setBuyModalOpen(true);
    playSound();
  };

  const getCoords = (x, y) => `${x},${y}`;
  const mintLandParcels = async () => {
    console.log("start", selectedAxis.length);
    if (selectedAxis.length == 1) {
      try {
        console.log("start", selectedAxis[0].x, selectedAxis[0].y);

        const id = getCoords(selectedAxis[0].x, selectedAxis[0].y);
        var parcelsSelected = parcels;
        parcelsSelected[id] = {
          type: 15,
          x: -151,
          y: -151,
          owner: address,
          isMinted: true,
        };
        const mintNFT = await Land.methods
          .assignNewParcel(selectedAxis[0].x, selectedAxis[0].y, address)
          .send({ from: address });
        console.log("tesss", mintNFT);
        let filename = "land.json";
        const jsonData = await ReactS3Client2.uploadFile(
          JSON.stringify({
            ok: true,
            data: parcelsSelected,
          }),
          filename
        ); // for json update
        console.log("tesss", jsonData);
        setTimeout(reloadPage, 3000);
        alert("Minting sucessfully completed");
      } catch (err) {
        console.log("err", err);
      }
    } else {
      try {
        console.log("start bulk", selectedAxis);
        let x = [];
        let y = [];
        let uri = [];
        var parcelsSelected = parcels;
        selectedAxis.map((item,i) => {
          x.push(item.x);
          y.push(item.y);
          uri.push("https://pbs.twimg.com/media/FD_IeOOXIA4JiIj.jpg:large");
          var id = getCoords(item.x, item.y);
          parcelsSelected[id] = {
            type: 15,
            x: item.x,
            y: item.y,
            owner: address,
            // name: "name of parcels",
            isMinted: true,
            image:
              "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/nft/police2.jpg",
          };
        });
        const mintNFT = await Land.methods
          .assignMultipleParcels(x, y, address)
          .send({ from: address });
        console.log(" bulk", mintNFT);
        let filename = "land.json";
        const jsonData = await ReactS3Client2.uploadFile(
          JSON.stringify({
            ok: true,
            data: parcelsSelected,
          }),
          filename
        ); // for json update
        console.log("tesss", jsonData);

        alert("Bulk Minting sucessfully completed");
        setTimeout(reloadPage, 3000);
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  const getdata = async () => {
    const res = await fetch(
      "https://sunrisetechs.s3-ap-southeast-2.amazonaws.com/metabloqs/nft/land1.json",
      { cache: "no-store" }
    );
    const json = await res.json();
    console.log("resss", json?.ok);
    if (json.ok) {
      setParcels(json.data);
    }
  };
  useEffect(() => {
    // getdata();
  }, []);
  return (
    <div className="">
      <Stack gap={5} className={""}>
        <Row>
          <>
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="mb-3"
            >
              <Fade bottom>
                <div style={{ overflow: "hidden", borderRadius: "1em" }}>
                  {props?.parcels != null && (
                    <Atlas
                      onSale={props?.onSale}
                      selectedParcels={props?.selectedParcels}
                      parcels={props?.parcels}
                      filterType={props?.filterType}
                      filterTypeValue={props?.filterTypeValue}
                      setSelectedAxis={setSelectedAxis}
                      onSelectGrid={props.onSelectGrid}
                    />
                  )}
                </div>
              </Fade>
            </Col>
          </>
        </Row>
      </Stack>
    </div>
  );
}

export default NFTDetails;
