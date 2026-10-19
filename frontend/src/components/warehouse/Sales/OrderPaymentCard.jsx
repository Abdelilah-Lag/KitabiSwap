import "./OrderPaymentCard.css";

import {
    FaWallet,
    FaMoneyBillWave,
    FaCreditCard
} from "react-icons/fa";


export default function OrderPaymentCard({ paymentMethod }) {


    function getPaymentInfo() {

        switch(paymentMethod) {

            case "wallet":

                return {

                    label: "Wallet",

                    icon: <FaWallet />,

                    className: "wallet"

                };


            case "cash_on_delivery":

                return {

                    label: "Paiement à la livraison",

                    icon: <FaMoneyBillWave />,

                    className: "cash"

                };


            default:

                return {

                    label: paymentMethod || "Inconnu",

                    icon: <FaCreditCard />,

                    className: "default"

                };

        }

    }


    const payment = getPaymentInfo();



    return (

        <div className="order-payment-card">


            <h3 className="order-payment-title">

                <FaCreditCard />

                Méthode de paiement

            </h3>



            <div
                className={
                    `order-payment-method ${payment.className}`
                }
            >

                <span className="order-payment-icon">

                    {payment.icon}

                </span>


                <span className="order-payment-label">

                    {payment.label}

                </span>

            </div>


        </div>

    );

}