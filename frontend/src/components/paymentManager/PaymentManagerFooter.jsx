import "./PaymentManagerFooter.css";

export default function PaymentManagerFooter() {

    return (

        <footer className="payment-footer">

            <div className="payment-footer-left">

                © {new Date().getFullYear()} KitabiSwap

            </div>

            <div className="payment-footer-right">

                Payment Manager Panel

            </div>

        </footer>

    );

}