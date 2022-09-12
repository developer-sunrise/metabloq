import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const getProviderOptions = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        //infuraId: process.env.REACT_APP_INFURA_ID
        rpc: {
          56: "https://bsc-dataseed.binance.org",
          97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
      },
    },
  };

  return providerOptions;
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: getProviderOptions(), // required
});

const initialState = {
  loading: false,
  address: "",
  connected: false,
  web3: null,
  provider: null,
  token: null,
  errorMsg: null,
  reward: null,
  web3Modal,
  // contracts instance
  Marketplace: null,
  Collection: null,
  LandRegistry: null,
  EstateRegistry: null,
  Token: null,
  XDC_AirDrop: null,
  // application data
  allCollection: [],
  adjcent: [],
  User:null,
  USD:0
};

const walletConnectReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        address: action.payload.address,
        token: action.payload.token,
        reward: action.payload.reward,
        web3: action.payload.web3,
        provider: action.payload.provider,
        connected: action.payload.connected,
        Marketplace: action.payload.Marketplace,
        Collection: action.payload.Collection,
        LandRegistry: action.payload.LandRegistry,
        EstateRegistry: action.payload.EstateRegistry,
        Token: action.payload.Token,
        XDC_AirDrop: action.payload.XDC_AirDrop,
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "UPDATE_ADDRESS":
      return {
        ...state,
        address: action.payload.address,
      };
    case "UPDATE_USER":
      return {
        ...state,
        User: action.payload,
      };
    case "GETALLCOLLECTION":
      return {
        ...state,
        allCollection: action.payload,
      };
      case "ADJCENT":
        return {
          ...state,
          adjcent: action.payload,
        };
      case "USDDATA":
        return {
          ...state,
          USD: action.payload,
        };
    default:
      return state;
  }
};

export default walletConnectReducer;
