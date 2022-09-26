import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { postMethod } from "../../helpers/API&Helpers/index";
import { useDispatch, useSelector } from "react-redux";
export default function CheckoutForm({ clientSecret,data,setPaymentStatus}) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const returnItems = useSelector((state) => state.WalletConnect);
    const { address, connected, XDC_AirDrop, web3, Token } = returnItems

    useEffect(() => {
        if (!stripe) {
            return;
        }
        if (!elements) {
            return;
        }

        console.log("ClientSecret", clientSecret)
        if (!clientSecret) {
            return;
        }
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            console.log("paymentIntent", paymentIntent)
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        })
    }, [stripe]);
    // const uploadpayment = async (result) =>{
    //     console.log("result",result)
    //     let url = "Buybloqs";
    //     let params = {
    //         wallet:address,
    //         amount:Number(data.amount)*100,
    //         userid:0,
    //         paymet_status:result.status,
    //         client_secret:clientSecret,
    //         payment_id:result.id,
    //         payment_currency:"USD",
    //         bloqs:data.bloqs
    //     };
    //     let authtoken = "";
    //     let response = await postMethod({ url, params, authtoken });
    //     console.log("response", response)
    //     setPaymentStatus(true)
    //     setConfirmmodal(false)
    // }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!address){
            alert("Connect Wallet")
            return;
        }
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setIsLoading(true);
        stripe.confirmPayment({
            elements,
            confirmParams: {
              // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
              return_url: window.location.href,
            }, 
            redirect:"if_required"
          })
          .then(function(result) {
           
            if (result.error) {
              // Inform the customer that there was an error.
            }
            if(result.paymentIntent){
                // uploadpayment(result.paymentIntent)
                setMessage(result.paymentIntent.status)
                setPaymentStatus(false)
            }
          });
        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}