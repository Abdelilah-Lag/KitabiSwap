import {

    useEffect,
    useState

} from "react";

import "./DeliveryExchange.css";

import DeliveryHeader
from "../../components/delivery/DeliveryHeader";

import DeliverySidebar
from "../../components/delivery/DeliverySidebar";

import DeliveryFooter
from "../../components/delivery/DeliveryFooter";

import {

    getDeliveryExchangeOrders,

    takeDeliveryExchangeOrder

} from "../../services/deliveryExchangeService";

export default function DeliveryExchange(){

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

    /*
    ==========================================
    LOAD ORDERS
    ==========================================
    */

    async function loadOrders(){

        try{

            setLoading(true);

            const data =

                await getDeliveryExchangeOrders();

            setOrders(

                data.data || []

            );

        }

        catch(error){

            console.error(error);

            setError(

                "Erreur chargement des échanges"

            );

        }

        finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        loadOrders();

    },[]);

    /*
    ==========================================
    TAKE DELIVERY
    ==========================================
    */

    async function handleTakeOrder(order){

        try{

            setTaking(order.id);

            await takeDeliveryExchangeOrder(

                order.id

            );

            await loadOrders();

        }

        catch(error){

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Erreur"

            );

        }

        finally{

            setTaking(null);

        }

    }

    /*
    ==========================================
    LOADING
    ==========================================
    */

    if(loading){

        return(

            <div className="delivery-exchange-loading">

                Chargement...

            </div>

        );

    }

    return(

        <div className="delivery-exchange">

            <DeliveryHeader/>

            <div className="delivery-exchange-container">

                <DeliverySidebar/>

                <main className="delivery-exchange-content">

                    <h1>

                        Livraison Échange

                    </h1>

                    {

                        error &&

                        <p className="error">

                            {error}

                        </p>

                    }

                    {

                        orders.length===0 ?

                        (

                            <p>

                                Aucun échange disponible

                            </p>

                        )

                        :

                        orders.map(order=>(

                            <div

                                className="delivery-order-card"

                                key={order.id}

                            >
                                                                {/* ===========================
                                   REQUESTER
                                =========================== */}

                                <div className="customer-info">

                                    <h3>

                                        Demandeur

                                    </h3>

                                    <p>

                                        Nom :

                                        {order.requester.first_name}

                                        {" "}

                                        {order.requester.last_name}

                                    </p>

                                    <p>

                                        Téléphone :

                                        {order.requester.phone}

                                    </p>

                                    <p>

                                        Adresse :

                                        {

                                            order.requester.address ||

                                            "Non disponible"

                                        }

                                    </p>

                                </div>

                                {/* ===========================
                                   LIVRES DEMANDEUR
                                =========================== */}

                                <div className="books-section">

                                    <h3>

                                        Livres du demandeur

                                    </h3>

                                    {

                                        order.requester_books.map(

                                            (book,index)=>(

                                                <div

                                                    className="book-item"

                                                    key={index}

                                                >

                                                    {

                                                        book.image &&

                                                        <img

                                                            src={book.image}

                                                            alt={book.title}

                                                        />

                                                    }

                                                    <div>

                                                        <p>

                                                            {book.title}

                                                        </p>

                                                        <span>

                                                            {book.author}

                                                        </span>

                                                    </div>

                                                </div>

                                            )

                                        )

                                    }

                                </div>

                                {/* ===========================
                                   RECEIVER
                                =========================== */}

                                <div className="customer-info">

                                    <h3>

                                        Receveur

                                    </h3>

                                    <p>

                                        Nom :

                                        {order.receiver.first_name}

                                        {" "}

                                        {order.receiver.last_name}

                                    </p>

                                    <p>

                                        Téléphone :

                                        {order.receiver.phone}

                                    </p>

                                    <p>

                                        Adresse :

                                        {

                                            order.receiver.address ||

                                            "Non disponible"

                                        }

                                    </p>

                                </div>

                                {/* ===========================
                                   LIVRES RECEVEUR
                                =========================== */}

                                <div className="books-section">

                                    <h3>

                                        Livres du receveur

                                    </h3>

                                    {

                                        order.receiver_books.map(

                                            (book,index)=>(

                                                <div

                                                    className="book-item"

                                                    key={index}

                                                >

                                                    {

                                                        book.image &&

                                                        <img

                                                            src={book.image}

                                                            alt={book.title}

                                                        />

                                                    }

                                                    <div>

                                                        <p>

                                                            {book.title}

                                                        </p>

                                                        <span>

                                                            {book.author}

                                                        </span>

                                                    </div>

                                                </div>

                                            )

                                        )

                                    }

                                </div>

                                {/* ===========================
                                   INFORMATIONS
                                =========================== */}

                                <div className="order-info">

                                    <p>

                                        Livres demandeur :

                                        {

                                            order.requester_books_count

                                        }

                                    </p>

                                    <p>

                                        Livres receveur :

                                        {

                                            order.receiver_books_count

                                        }

                                    </p>

                                    <p>

                                        Livraison :

                                        {

                                            order.delivery_price

                                        }

                                        {" "}DH

                                    </p>

                                    <p>

                                        Total :

                                        {

                                            order.total

                                        }

                                        {" "}DH

                                    </p>

                                    <p>

                                        Paiement demandeur :

                                        {

                                            order.requester_payment_method === "wallet"

                                            ? "Wallet"

                                            : "Paiement à la livraison"

                                        }

                                    </p>

                                    <p>

                                        Paiement receveur :

                                        {

                                            order.receiver_payment_method === "wallet"

                                            ? "Wallet"

                                            : "Paiement à la livraison"

                                        }

                                    </p>

                                    <p>

                                        Date :

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

                                    onClick={()=>

                                        handleTakeOrder(order)

                                    }

                                >

                                    {

                                        taking === order.id

                                        ?

                                        "Traitement..."

                                        :

                                        "Prendre la livraison"

                                    }

                                </button>

                            </div>

                        ))

                    }

                </main>

            </div>

            <DeliveryFooter/>

        </div>

    );

}