import "./DeliveryFooter.css";

export default function DeliveryFooter() {

    return (

        <footer className="delivery-footer">

            <div className="delivery-footer-container">

                <div className="delivery-footer-left">

                    © {new Date().getFullYear()} KitabiSwap

                    <span>

                        Tous droits réservés.

                    </span>

                </div>

                <div className="delivery-footer-center">

                    Espace Livreur

                </div>

                <div className="delivery-footer-right">

                    Livraison • Gestion • Suivi

                </div>

            </div>

        </footer>

    );

}