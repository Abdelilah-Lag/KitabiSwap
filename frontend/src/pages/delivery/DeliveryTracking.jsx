import {

    useEffect,
    useState

} from "react";

import "./DeliveryTracking.css";

import DeliveryHeader
from "../../components/delivery/DeliveryHeader";

import DeliverySidebar
from "../../components/delivery/DeliverySidebar";

import DeliveryFooter
from "../../components/delivery/DeliveryFooter";

import {

    getMyDeliveries,

    completeDelivery

} from "../../services/deliveryTrackingService";

export default function DeliveryTracking(){

    const [

        deliveries,

        setDeliveries

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(true);

    const [

        finishing,

        setFinishing

    ] = useState(null);

    const [

        error,

        setError

    ] = useState("");

    async function loadDeliveries(){

        try{

            setLoading(true);

            const data =

                await getMyDeliveries();

            setDeliveries(

                data.data || []

            );

        }

        catch(error){

            console.error(error);

            setError(

                "Erreur chargement livraisons."

            );

        }

        finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        loadDeliveries();

    },[]);

    async function handleComplete(

        delivery

    ){

        try{

            setFinishing(

                delivery.delivery_id

            );

            await completeDelivery(

                delivery.delivery_id

            );

            await loadDeliveries();

        }

        catch(error){

            alert(

                error.response?.data?.message ||

                "Erreur."

            );

        }

        finally{

            setFinishing(null);

        }

    }

    if(loading){

        return(

            <div className="delivery-tracking-loading">

                Chargement...

            </div>

        );

    }

    return(

        <div className="delivery-tracking">

            <DeliveryHeader/>

            <div className="delivery-tracking-container">

                <DeliverySidebar/>

                <main className="delivery-tracking-content">

                    <h1>

                        Mes livraisons

                    </h1>

                    {

                        error &&

                        <p className="error">

                            {error}

                        </p>

                    }

                    {

                        deliveries.length===0 ?

                        (

                            <p>

                                Aucune livraison.

                            </p>

                        )

                        :

                        deliveries.map(delivery=>(

                            <div

                                key={delivery.delivery_id}

                                className="delivery-order-card"

                            >
                        <div className="delivery-order-header">

                            <span className="delivery-type">

                                {

                                    delivery.type === "magazine"

                                    ? "📚 Magazine"

                                    : delivery.type === "user"

                                    ? "👤 Utilisateur"

                                    : "🔄 Échange"

                                }

                            </span>

                            {

                                delivery.type === "exchange" ?

                                <span>

                                    Paiement demandeur :

                                    <b>

                                        {

                                            delivery.requester_payment_method === "wallet"

                                            ? "Wallet"

                                            : "À la livraison"

                                        }

                                    </b>

                                    | Paiement receveur :

                                    <b>

                                        {

                                            delivery.receiver_payment_method === "wallet"

                                            ? "Wallet"

                                            : "À la livraison"

                                        }

                                    </b>

                                </span>

                                :

                                <span>

                                    Paiement :

                                    <b>

                                        {delivery.payment}

                                    </b>

                                </span>

                            }

                        </div>

                            {

                                delivery.customer &&

                                <div className="delivery-person">

                                    <h3>

                                        Client

                                    </h3>

                                    <p>

                                        {

                                            delivery.customer.first_name

                                        } {

                                            delivery.customer.last_name

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.customer.phone

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.customer.address ||

                                            "Adresse non disponible"

                                        }

                                    </p>

                                </div>

                            }

                            {

                                delivery.seller &&

                                <div className="delivery-person">

                                    <h3>

                                        Vendeur

                                    </h3>

                                    <p>

                                        {

                                            delivery.seller.first_name

                                        } {

                                            delivery.seller.last_name

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.seller.phone

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.seller.address ||

                                            "Adresse non disponible"

                                        }

                                    </p>

                                </div>

                            }

                            {

                                delivery.requester &&

                                <div className="delivery-person">

                                    <h3>

                                        Demandeur

                                    </h3>

                                    <p>

                                        {

                                            delivery.requester.first_name

                                        } {

                                            delivery.requester.last_name

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.requester.phone

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.requester.address

                                        }

                                    </p>

                                </div>

                            }

                            {

                                delivery.receiver &&

                                <div className="delivery-person">

                                    <h3>

                                        Receveur

                                    </h3>

                                    <p>

                                        {

                                            delivery.receiver.first_name

                                        } {

                                            delivery.receiver.last_name

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.receiver.phone

                                        }

                                    </p>

                                    <p>

                                        {

                                            delivery.receiver.address

                                        }

                                    </p>

                                </div>

                            }

                            {

                                delivery.books &&

                                <div className="delivery-books">

                                    {

                                        Array.isArray(delivery.books)

                                        ?

                                        <>

                                            <h3>Livres</h3>

                                            {delivery.books.map(

                                                (book,index)=>(

                                                    <div

                                                        key={index}

                                                        className="delivery-book"

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

                                                                {

                                                                    book.title

                                                                }

                                                            </p>

                                                            <small>

                                                                {

                                                                    book.author

                                                                }

                                                            </small>

                                                            <br/>

                                                            <small>

                                                                Quantité :

                                                                {

                                                                    book.quantity

                                                                }

                                                            </small>

                                                        </div>

                                                    </div>

                                                )

                                            )}

                                        </>

                                        :

                                        <>

                                            <h3>Livres de l'échange</h3>

                                            {

                                                delivery.books.requester &&

                                                delivery.books.requester.length > 0 &&

                                                <div className="delivery-exchange-books">

                                                    <h4>Livres demandés</h4>

                                                    {delivery.books.requester.map(

                                                        (book,index)=>(

                                                            <div

                                                                key={`req-${index}`}

                                                                className="delivery-book"

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

                                                                        {

                                                                            book.title

                                                                        }

                                                                    </p>

                                                                    <small>

                                                                        {

                                                                            book.author

                                                                        }

                                                                    </small>

                                                                </div>

                                                            </div>

                                                        )

                                                    )}

                                                </div>

                                            }

                                            {

                                                delivery.books.receiver &&

                                                delivery.books.receiver.length > 0 &&

                                                <div className="delivery-exchange-books">

                                                    <h4>Livres reçus</h4>

                                                    {delivery.books.receiver.map(

                                                        (book,index)=>(

                                                            <div

                                                                key={`rec-${index}`}

                                                                className="delivery-book"

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

                                                                        {

                                                                            book.title

                                                                        }

                                                                    </p>

                                                                    <small>

                                                                        {

                                                                            book.author

                                                                        }

                                                                    </small>

                                                                </div>

                                                            </div>

                                                        )

                                                    )}

                                                </div>

                                            }

                                        </>

                                    }

                                </div>

                            }
                                                        <div className="delivery-summary">

                                <p>

                                    <strong>

                                        Prix livraison :

                                    </strong>

                                    {

                                        Number(

                                            delivery.delivery_price || 0

                                        ).toFixed(2)

                                    } DH

                                </p>

                                <p>

                                    <strong>

                                        Total :

                                    </strong>

                                    {

                                        Number(

                                            delivery.total || 0

                                        ).toFixed(2)

                                    } DH

                                </p>

                                <p>

                                    <strong>

                                        Date :

                                    </strong>

                                    {

                                        new Date(

                                            delivery.created_at

                                        ).toLocaleDateString(

                                            "fr-FR"

                                        )

                                    }

                                </p>

                            </div>

                            <button

                                className="delivery-complete-btn"

                                disabled={

                                    finishing===

                                    delivery.delivery_id

                                }

                                onClick={()=>

                                    handleComplete(

                                        delivery

                                    )

                                }

                            >

                                {

                                    finishing===

                                    delivery.delivery_id

                                    ?

                                    "Validation..."

                                    :

                                    "Livraison terminée"

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