// constants
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import store from "./store";
import CollectionJson from "../contracts/Collection.json";
import MarketplaceJson from "../contracts/Marketplace.json";
import LandRegistryJson from "../contracts/Land_Registry.json";
import EstateRegistryJson from "../contracts/Estate_Registry.json";
import XDCAirDropJson from "../contracts/XDC_AirDrop.json";
import TokenJson from "../contracts/Token.json";
import { postMethod } from "../helpers/API&Helpers";
const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

export const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

export const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};
const checkUserPresence = async (address) => {
  if (address != "") {
    let url = "signup";
    let params = {
      wallet: address,
    };
    let authtoken = "";
    let response = await postMethod({ url, params, authtoken });
  }
};
// const updateAccountRequest = (payload) => {
//   return {
//     type: "UPDATE_ADDRESS",
//     payload: payload,
//   };
// };

const getProviderOptions = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          51: "https://rpc.apothem.network",
          4: "https://rinkeby.infura.io/v3/",
        },
      },
    },
  };

  return providerOptions;
};

export const connectWallet = (walletname) => {
  return async (dispatch) => {
    dispatch(connectRequest());
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: getProviderOptions(), // required
      });

      // const provider = await web3Modal.connect();

      var provider = "";
      if (walletname === "coinbasewallet") {
        var provider = await web3Modal.connectTo("coinbasewallet");
      } else if (walletname === "walletconnect") {
        var provider = await web3Modal.connectTo("walletconnect");
      } else if (walletname === "fortmatic") {
        var provider = await web3Modal.connectTo("fortmatic");
      } else if (walletname === "metamask") {
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions: getProviderOptions().walletconnect, // required
        });
        var provider = await web3Modal.connect();
      } else {
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions: getProviderOptions().walletconnect, // required
        });
        var provider = await web3Modal.connect();
      }

      await subscribeProvider(provider);

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const Chain=process.env.REACT_APP_CHAIN_ID
      if (window.ethereum && window.ethereum.networkVersion !== String(Chain)) {
        await addNetwork(Number(Chain));
      }
      const Marketplace = new web3.eth.Contract(
        MarketplaceJson,
        process.env.REACT_APP_Marketplace_CONTRACT
      );

      const Collection = new web3.eth.Contract(
        CollectionJson,
        process.env.REACT_APP_COLLECTION_CONTRACT
      );

      const LandRegistry = new web3.eth.Contract(
        LandRegistryJson,
        process.env.REACT_APP_LAND_REGISTRY_CONTRACT
      );
      const EstateRegistry = new web3.eth.Contract(
        EstateRegistryJson,
        process.env.REACT_APP_ESTATE_REGISTRY_CONTRACT
      );
      const Token = new web3.eth.Contract(
        TokenJson,
        process.env.REACT_APP_TOKEN_CONTRACT
      );
      const XDC_AirDrop = new web3.eth.Contract(
        XDCAirDropJson,
        process.env.REACT_APP_XDCAIRDROP_CONTRACT
      );

      dispatch(
        connectSuccess({
          address,
          web3,
          provider,
          connected: true,
          web3Modal,
          Marketplace,
          Collection,
          LandRegistry,
          EstateRegistry,
          Token,
          XDC_AirDrop: XDC_AirDrop,
        })
      );
    } catch (e) {
      dispatch(connectFailed(e));
    }
  };
};

const subscribeProvider = async (provider) => {
  if (!provider.on) {
    return;
  }

  provider.on("connect", async (id) => {
    // console.log(id);
  });

  provider.on("networkChanged", async (networkId) => {
    if (networkId !== "4") {
      // console.log(networkId);
      store.dispatch(connectFailed("Please switch to Binance mainnet"));
    } else {
      store.dispatch(connectWallet());
    }
  });
};

export async function addNetwork(id) {
  let networkData;
  switch (id) {
    //bsctestnet
    case 4:
      networkData = [
        {
          chainId: "0x4",
        },
      ];
      break;
    case 51:
      networkData = [
        {
          chainId: "0x33",
          chainName: "XinFin Apothem Testnet",
          rpcUrls: ["https://rpc.apothem.network"],
          nativeCurrency: {
            name: "XinFin Apothem Testnet",
            symbol: "TXDC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://apothem.xinfinscan.com"],
        },
      ];

      break;

    default:
      break;
  }
  if (Number(id) != 4) {
    return window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: networkData,
    });
  } else {
    return window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: networkData,
    });
  }
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: networkData,
  });
}

(() => {
  if (window.ethereum) {
    window.ethereum.on("networkChanged", function (networkId) {
      if (networkId !== "56") {
        // console.log(networkId);
        store.dispatch(connectFailed("Please switch to Binance mainnet"));
      } else {
        store.dispatch(connectWallet());
      }
    });
  }
})();
