import "./PaymentManagerLayout.css";

import PaymentManagerHeader from "./PaymentManagerHeader";
import PaymentManagerSidebar from "./PaymentManagerSidebar";
import PaymentManagerFooter from "./PaymentManagerFooter";

export default function PaymentManagerLayout({

    children

}) {

    return (

        <div className="payment-layout">

            <PaymentManagerSidebar />

            <div className="payment-layout-content">

                <PaymentManagerHeader />

                <main className="payment-layout-main">

                    {children}

                </main>

                <PaymentManagerFooter />

            </div>

        </div>

    );

}