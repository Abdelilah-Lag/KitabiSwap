import {
    useEffect,
    useState
} from "react";


import "./DeliveryMagazine.css";


import DeliveryHeader
    from "../../components/delivery/DeliveryHeader";

import DeliverySidebar
    from "../../components/delivery/DeliverySidebar";

import DeliveryFooter
    from "../../components/delivery/DeliveryFooter";


import {

    getDeliveryMagazineOrders,

    getDeliveryMagazineUserCommandes,

    takeDeliveryMagazineOrder

} from "../../services/deliveryMagazineService";





export default function DeliveryMagazine(){


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








    async function loadOrders(){


        try {


            setLoading(true);



            const magazineOrders =
    await getDeliveryMagazineOrders();



const userOrders =
    await getDeliveryMagazineUserCommandes();



setOrders([

    ...(magazineOrders.data || []),

    ...(userOrders.data || [])

]);



        }


        catch(error){


            console.error(

                "Erreur magazine :",

                error

            );


            setError(

                "Erreur chargement commandes"

            );


        }


        finally{


            setLoading(false);


        }


    }







    useEffect(()=>{


        loadOrders();


    },[]);








    async function handleTakeOrder(order){


        try{


            setTaking(order.id);



            await takeDeliveryMagazineOrder({


                source:

                order.source,


                id:

                order.id


            });



            await loadOrders();


        }


        catch(error){


            console.error(error);



            alert(

                error.response?.data?.message ||

                "Erreur prise commande"

            );


        }


        finally{


            setTaking(null);


        }


    }








    if(loading){


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

                        Livraison Magazine

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

                        orders.map(order=>(



                            <div

                            className="delivery-order-card"

                            key={

                                `${order.source}-${order.id}`

                            }

                            >





                                <div className="customer-info">


                                    <h3>

                                        Client

                                    </h3>



                                    <p>

                                    Nom :
                                    {order.customer?.name}

                                    </p>



                                    <p>

                                    Téléphone :
                                    {order.customer?.phone}

                                    </p>



                                    <p>

                                    Adresse :
                                    {
                                    order.customer?.address ||

                                    "Non disponible"
                                    }

                                    </p>


                                </div>









                                <div className="books-section">


                                    <h3>

                                        Livres

                                    </h3>



                                    {

                                    order.books?.map(

                                        (book,index)=>(


                                            <div

                                            className="book-item"

                                            key={index}

                                            >



                                                {

                                                book.images?.length > 0 &&


                                                <img

                                                src={
                                                    book.images[0].image_url
                                                }

                                                alt={book.title}

                                                />

                                                }




                                                <div>


                                                    <p>

                                                    {book.title}

                                                    </p>


                                                    {

                                                    book.quantity &&

                                                    <span>

                                                    Quantité :
                                                    {book.quantity}

                                                    </span>

                                                    }



                                                </div>



                                            </div>


                                        )

                                    )

                                    }



                                </div>









                                <div className="order-info">


                                    <p>

                                    Nombre livres :
                                    {order.books_count}

                                    </p>



                                    <p>

                                    Total :
                                    {order.total} DH

                                    </p>



                                    <p>

                                    Livraison :
                                    {order.delivery_price} DH

                                    </p>



                                    <p>

                                    Paiement :
                                    {order.payment}

                                    </p>



                                </div>









                                <button

                                disabled={

                                    taking === order.id

                                }


                                onClick={()=>handleTakeOrder(order)}

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