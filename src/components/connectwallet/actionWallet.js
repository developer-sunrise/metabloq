import React from "react";
import {
  Button,
  Box,
  CardMedia,
  Typography,
  Modal,
  Radio,
  Stack
} from "@mui/material";
// import Images from "../../assets/Images";
import useStyles from "./styles";
import { useDispatch, 
  // useSelector
 } from "react-redux";
import { connectWallet } from "../../redux/WalletAction";
import {MdOutlineCancel} from 'react-icons/md';

function ActionWallet(props) {
 let { walletOpen, setWalletOpen, playSound, loader1,loader2,hashValue } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = React.useState("Metamask");
  const [selectedwallet, setSelectedwallet] = React.useState("metamask");

  const handleChange = (event) => {
    setSelectedValue(event.title);
    setSelectedwallet(event.wallet)
  };
  const img1 = require("../../assets/walletImg/wallet.svg").default
  const img2 = require("../../assets/walletImg/time.svg").default
  const img3 = require("../../assets/walletImg/transaction.svg").default


  const loader = require("../../assets/loading.gif").default
  const link = process.env.REACT_APP_SCAN_baseuri_HASH+hashValue;
  return (
    <Box>
<Modal open={walletOpen} onClose={() => setWalletOpen(false)}>
  <Box className={classes.walletContainer}>
      <Box className={classes.modalHeader}>
        <Typography variant="h5" className={classes.walletTitle}>
          Wallet Action
        </Typography>
        <small onClick={() => setWalletOpen(false)}>X</small>
      </Box>
      <Box className={classes.itemContainer}>
        {/* {walletData.map((item, index) => ( */}
        <Box className={classes.radioContainer} >
          <Box className={classes.radioTitle}>
            <CardMedia
              component="img"
              image={img1}
              style={{ width: "30px", height: "30px" }}
            />
            <p style={{ opacity: ".6", margin: "0 .5em" }}>
              Request to Send Wallet
            </p>
          </Box>
          <Radio
            checked={true}
            value={"Request to Send Wallet"}
            name="radio-buttons"
            inputProps={{ "aria-label ": "Request to Send Wallet" }}
            style={{ border: ".5px solid white!important" }}
          />
        </Box>
        <Box className={classes.radioContainer}>
          <Box className={classes.radioTitle}>
            <CardMedia
              component="img"
              image={img2}
              style={{ width: "30px", height: "30px" }}
            />
            <p style={{ opacity: ".6", margin: "0 .5em" }}>
              Transaction Underway
            </p>
          </Box>
          {loader1 ?
            <img src={loader} style={{ width: "20px", height: "20px" }} alt="loader" />
            :
            <Radio
              checked={!loader1&&!loader2}
              value={"Transaction Underway"}
              name="radio-buttons"
              inputProps={{ "aria-label": "Transaction Underway" }}
              style={{ border: ".5px solid white!important" }}
            />
          }
        </Box>
        <Box className={classes.radioContainer}>
          <Box className={classes.radioTitle}>
            <CardMedia
              component="img"
              image={img3}
              style={{ width: "30px", height: "30px" }}
            />
            <p style={{ opacity: ".6", margin: "0 .5em" }}>
             Waiting for Confirmation
            </p>
          </Box>
          {loader2 ?
            <img src={loader} style={{ width: "20px", height: "20px" }} alt="loader" />
            :
            <Radio
              checked={!loader2&&!loader1}
              value={"Waiting for Confirmation"}
              name="radio-buttons"
              inputProps={{ "aria-label": "Waiting for Confirmation" }}
              style={{ border: ".5px solid white!important" }}
            />
          }
        </Box>
        <Box className={classes.btnContainer}>
          <button
            className="metablog_primary-filled-button"
            onClick={() => { setWalletOpen(false); playSound() }}
          >
            {/* {console.log("link",link)} */}
            <a href={link} target='blank' className={classes.anchor} style={{textDecoration:"none",color:"white"}}>
              <small>CHECK IN SCAN</small></a>
          </button>
          </Box>
      </Box>
  </Box>
</Modal>
</Box>
  );
}

export default ActionWallet;
