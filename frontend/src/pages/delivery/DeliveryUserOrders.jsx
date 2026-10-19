import "./DeliveryMagazine.css";
import {
    useEffect,
    useState
} from "react";

import "./DeliveryUserOrders.css";

import DeliveryHeader
    from "../../components/delivery/DeliveryHeader";

import DeliverySidebar
    from "../../components/delivery/DeliverySidebar";

import DeliveryFooter
    from "../../components/delivery/DeliveryFooter";

import {

    getDeliveryUserOrders,

    takeDeliveryUserOrder

} from "../../services/deliveryUserOrdersService";

export default function DeliveryUserOrders() {

    const [

        orders,

        setOrders

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(true);

    const [

        taking,

        setTaking

    ] = useState(null);

    const [

        error,

        setError

    ] = useState("");

    async function loadOrders() {

        try {

            setLoading(true);

            const response =
                await getDeliveryUserOrders();

            setOrders(

                response.data || []

            );

        }

        catch (error) {

            console.error(error);

            setError(

                "Erreur chargement commandes."

            );

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadOrders();

    }, []);

    async function handleTakeOrder(order) {

        try {

            setTaking(order.id);

            await takeDeliveryUserOrder(

                order.id

            );

            await loadOrders();

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Erreur prise commande"

            );

        }

        finally {

            setTaking(null);

        }

    }

    if (loading) {

        return (

            <div className="delivery-magazine-loading">

                Chargement...

            </div>

        );

    }

    return (

        <div className="delivery-magazine">

            <DeliveryHeader />

            <div className="delivery-magazine-container">

                <DeliverySidebar />

                <main className="delivery-magazine-content">

                    <h1>

                        Livraison Utilisateur

                    </h1>

                    {

                        error &&

                        <p className="error">

                            {error}

                        </p>

                    }

                    {

                        orders.length === 0 ?

                            (

                                <p>

                                    Aucune commande disponible

                                </p>

                            )

                            :

                            (

                                orders.map(order => (

                                    <div

                                        className="delivery-order-card"

                                        key={order.id}

                                    >

                                        <div className="customer-info">

                                            <h3>

                                                Acheteur

                                            </h3>

                                            <p>

                                                Nom :

                                                {" "}

                                                {order.customer.first_name}

                                                {" "}

                                                {order.customer.last_name}

                                            </p>

                                            <p>

                                                Téléphone :

                                                {" "}

                                                {order.customer.phone}

                                            </p>

                                            <p>

                                                Adresse :

                                                {" "}

                                                {

                                                    order.customer.address ||

                                                    "Non disponible"

                                                }

                                            </p>

                                        </div>

                                        <div className="customer-info">

                                            <h3>

                                                Vendeur

                                            </h3>

                                            <p>

                                                Nom :

                                                {" "}

                                                {order.seller.first_name}

                                                {" "}

                                                {order.seller.last_name}

                                            </p>

                                            <p>

                                                Téléphone :

                                                {" "}

                                                {order.seller.phone}

                                            </p>

                                            <p>

                                                Adresse :

                                                {" "}

                                                {

                                                    order.seller.address ||

                                                    "Non disponible"

                                                }

                                            </p>

                                        </div>

                                        <div className="books-section">

                                            <h3>

                                                Livre

                                            </h3>

                                            <div className="book-item">

                                                {

                                                    order.book.image &&

                                                    <img

                                                        src={order.book.image}

                                                        alt={order.book.title}

                                                    />

                                                }

                                                <div>

                                                    <p>

                                                        {order.book.title}

                                                    </p>

                                                    <span>

                                                        {order.book.author}

                                                    </span>

                                                    <br />

                                                    <span>

                                                        Quantité :

                                                        {" "}

                                                        {order.quantity}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="order-info">

                                            <p>

                                                Prix :

                                                {" "}

                                                {order.price} DH

                                            </p>

                                            <p>

                                                Livraison :

                                                {" "}

                                                {order.delivery_price} DH

                                            </p>

                                            <p>

                                                Total :

                                                {" "}

                                                {order.total} DH

                                            </p>

                                            <p>

                                                Paiement :

                                                {" "}

                                                {order.payment}

                                            </p>

                                            <p>

                                                Date :

                                                {" "}

                                                {

                                                    new Date(

                                                        order.created_at

                                                    ).toLocaleDateString(

                                                        "fr-FR"

                                                    )

                                                }

                                            </p>

                                        </div>

                                        <button

                                            disabled={

                                                taking === order.id

                                            }

                                            onClick={() =>

                                                handleTakeOrder(order)

                                            }

                                        >

                                            {

                                                taking === order.id

                                                    ?

                                                    "Traitement..."

                                                    :

                                                    "Prendre commande"

                                            }

                                        </button>

                                    </div>

                                ))

                            )

                    }

                </main>

            </div>

            <DeliveryFooter />

        </div>

    );

}