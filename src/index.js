import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider as Providers } from 'mobx-react';
import {Provider} from 'react-redux';
import store from './redux/store';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './fonts/poppins/Poppins-Regular.ttf';
import './fonts/lufga/LufgaRegular.ttf';
import './fonts/lufga/LufgaBold.ttf';
import './fonts/raleway/Raleway-Regular.ttf';
import './index.css'
import { ThemeProvider } from "@mui/material/styles";
import {theme} from '../src/theme'
import { BrowserRouter } from 'react-router-dom';

import AccountStore from './stores/AccountStore';
import CommonStore from './stores/CommonStore';
import CountriesStore from './stores/CountriesStore';
import CustomerStore from './stores/CustomerStore';
import IcoStore from './stores/IcoStore';
import IcoDocumentStore from './stores/IcoDocumentStore';
import Annex1Store from './stores/Annex1Store';
import Annex2Store from './stores/Annex2Store';
import SubscriptionStore from './stores/SubscriptionStore';
import PolStore from './stores/PolStore';
import ContributionStore from './stores/ContributionStore';
import VideoConferenceStore from './stores/VideoConferenceStore';

const stores = {
    AccountStore,
    CommonStore,
    CountriesStore,
    CustomerStore,
    IcoStore,
    IcoDocumentStore,
    Annex1Store,
    Annex2Store,
    SubscriptionStore,
    ContributionStore,
    VideoConferenceStore,
    PolStore,
  };
ReactDOM.render(
    <Providers {...stores}>
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
    </Providers>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
