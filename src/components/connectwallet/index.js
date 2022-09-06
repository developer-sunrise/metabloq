import React from "react";
import {
  Button,
  Box,
  CardMedia,
  Typography,
  Modal,
  Radio
} from "@mui/material";
// import Images from "../../assets/Images";
import useStyles from "./styles";
// import { useNavigate } from "react-router-dom";
import { useDispatch, 
  // useSelector
 } from "react-redux";
import { connectWallet } from "../../redux/WalletAction";
import {MdOutlineCancel} from 'react-icons/md';

function ConenctWallet({ openWallet, setOpenWallet }) {
  // const wallet = useSelector((state) => state.WalletConnect);
  const classes = useStyles();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = React.useState("Metamask");
  const [selectedwallet, setSelectedwallet] = React.useState("metamask");

  const handleChange = (event) => {
    setSelectedValue(event.title);
    setSelectedwallet(event.wallet)
  };

  const img1 = require('../../assets/connectwallet/metamask.png')
  const img2 = require('../../assets/connectwallet/coinbase.png')
  const img3 = require('../../assets/connectwallet/wallet.png')
  const img4 = require('../../assets/connectwallet/fortmatic.png')

  const walletData = [
    {
      title: "Metamask",
      icon: img1,
      wallet:'metamask'
    },
    {
      title: "Coinbase Wallet",
      icon: img2,
      wallet:'coinbasewallet'
    },
    {
      title: "WalletConnect",
      icon: img3,
      wallet:'walletconnect'
    },
    {
      title: "Fortmatic",
      icon: img4,
      wallet:'fortmatic'
    },
    // {
    //   title: "Portis",
    //   icon: Images.PortisIcon
    // }
  ];
  const connect= (walletname) =>{
    setOpenWallet(false)
    dispatch( connectWallet(walletname));
  } 
  return (
    <Box>
      <Modal open={openWallet} onClose={() => setOpenWallet(false)}>
        <Box className={classes.walletContainer}>
          <Box className={classes.modalHeader}>
              <Typography variant="h5" className={classes.walletTitle}>
                Connect your wallet
              </Typography>
              <MdOutlineCancel size={25} onClick={() => setOpenWallet(false)}/>
          </Box>
    

          <Box className={classes.divider} />
          <Box className={classes.itemContainer}>
            {walletData.map((item, index) =>
              <Box className={classes.radioContainer} key={index}>
                <Box className={classes.radioTitle}>
                <CardMedia
                  component="img"
                  image={item.icon}
                  className={classes.icon}
                />
                  <Typography variant="body1" className={classes.title}>
                    {item.title}
                  </Typography>
                </Box>
                <Radio
                    checked={selectedValue === item.title}
                    onChange={()=>handleChange(item)}
                    value={item.title}
                    name="radio-buttons"
                    inputProps={{ "aria-label": item.title }}
                  />
              </Box>
            )}
          </Box>
          <Box className={classes.btnContainer}>
            <Button
              className={classes.btnNext}
              onClick={() => connect(selectedwallet)
                // selectedValue && 
                // navigate(`/token?wallet=${selectedValue}`)
              }
            >
              Connect Wallet
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ConenctWallet;
