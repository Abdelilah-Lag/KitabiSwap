import {
    useEffect,
    useMemo,
    useState
} from "react";

import "./ControllerExchangeRequests.css";


import ControllerLayout from "../../components/controller/ControllerLayout";


import {
    getPendingExchangeRequests,
    startCollectingBooks,
    rejectExchangeRequest
} from "../../services/controllerExchangeRequestService";



export default function ControllerExchangeRequests() {


    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);


    const [search, setSearch] = useState("");

    const [rejectReason, setRejectReason] = useState("");


    const [showRejectModal, setShowRejectModal] = useState(false);

    const [selectedExchange, setSelectedExchange] = useState(null);



    const [exchanges, setExchanges] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [totalItems, setTotalItems] = useState(0);




    useEffect(() => {

        loadExchanges();

    }, [currentPage]);





    useEffect(() => {


        const timer = setTimeout(() => {


            setCurrentPage(1);

            loadExchanges(1);


        },400);



        return () => clearTimeout(timer);


    },[search]);







    async function loadExchanges(page=currentPage){


        try{


            setLoading(true);



            const response = await getPendingExchangeRequests({

                page,

                search

            });



            setExchanges(response.exchanges || []);


            setCurrentPage(response.currentPage || 1);


            setTotalPages(response.totalPages || 1);


            setTotalItems(response.totalItems || 0);



        }
        catch(error){


            console.error(error);


            alert(

                error.response?.data?.message ||

                "Erreur lors du chargement."

            );


        }
        finally{


            setLoading(false);


        }


    }







    const stats = useMemo(()=>{


        let totalBooks = 0;

        let deliveryAmount = 0;


        const users = new Set();




        exchanges.forEach(exchange=>{


            totalBooks +=

                exchange.requester.books.length +

                exchange.receiver.books.length;



            users.add(exchange.requester.id);

            users.add(exchange.receiver.id);



            deliveryAmount += exchange.delivery.fee;



        });





        return {


            exchanges: totalItems,


            books: totalBooks,


            users: users.size,


            delivery: deliveryAmount


        };


    },[

        exchanges,

        totalItems

    ]);








    async function handleCollect(deliveryId){


        if(!window.confirm(

            "Commencer la collecte des livres ?"

        ))

        return;



        try{


            setActionLoading(true);



            await startCollectingBooks(deliveryId);



            await loadExchanges();



        }
        catch(error){


            console.error(error);


            alert(

                error.response?.data?.message ||

                "Erreur."

            );


        }
        finally{


            setActionLoading(false);


        }


    }







    function openRejectModal(exchange){


        setSelectedExchange(exchange);


        setRejectReason("");


        setShowRejectModal(true);


    }







    async function handleReject(){


        if(!selectedExchange)

            return;




        try{


            setActionLoading(true);



            await rejectExchangeRequest(

                selectedExchange.id,

                rejectReason

            );



            setShowRejectModal(false);


            setSelectedExchange(null);



            await loadExchanges();



        }
        catch(error){


            console.error(error);



            alert(

                error.response?.data?.message ||

                "Erreur."

            );


        }
        finally{


            setActionLoading(false);


        }


    }






    if(loading){


        return (

            <ControllerLayout>


                <div className="loading-page">

                    Chargement des échanges...

                </div>


            </ControllerLayout>

        );


    }






    return (

        <ControllerLayout>


            <div className="controller-page">



                <div className="page-header">


                    <div>


                        <h2>

                            Gestion des échanges

                        </h2>


                        <p>

                            Validation des échanges entre utilisateurs avant la collecte.

                        </p>


                    </div>


                </div>




                <div className="stats-grid">


                    <div className="stat-card">

                        <span>

                            Demandes en attente

                        </span>

                        <h3>

                            {stats.exchanges}

                        </h3>

                    </div>



                    <div className="stat-card">

                        <span>

                            Livres à échanger

                        </span>

                        <h3>

                            {stats.books}

                        </h3>

                    </div>




                    <div className="stat-card">

                        <span>

                            Utilisateurs

                        </span>

                        <h3>

                            {stats.users}

                        </h3>

                    </div>



                    <div className="stat-card">

                        <span>

                            Livraison

                        </span>

                        <h3>

                            {stats.delivery.toFixed(2)} DH

                        </h3>

                    </div>


                </div>





                <div className="search-box">


                    <input

                        type="text"

                        placeholder="Rechercher un utilisateur..."

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                    />


                </div>
                                {
                    exchanges.length === 0 && (

                        <div className="empty-page">

                            Aucune demande d'échange en attente.

                        </div>

                    )
                }





                {
                    exchanges.map(exchange => (


                        <div

                            key={exchange.id}

                            className="exchange-card"

                        >



                            {/* HEADER ECHANGE */}

                            <div className="exchange-header">


                                <div>


                                    <h3>

                                        Échange #{exchange.id}

                                    </h3>


                                    <span className="date">


                                        {

                                            new Date(

                                                exchange.createdAt

                                            ).toLocaleString()

                                        }


                                    </span>


                                </div>




                                <div className="status-badge pending">

                                    En attente

                                </div>


                            </div>








                            {/* USERS */}

                            <div className="users-section">


                                <div className="user-card">


                                    <div className="user-info">


                                        <h4>

                                            {exchange.requester.fullName}

                                        </h4>


                                        <p>

                                            {exchange.requester.email}

                                        </p>


                                        <p>

                                            {exchange.requester.phone}

                                        </p>



                                        <div className="address-box">


                                            <strong>

                                                Adresse

                                            </strong>


                                            <p>

                                                {
                                                    exchange.requester.address?.address
                                                }

                                            </p>


                                            <p>

                                                {
                                                    exchange.requester.address?.city
                                                },

                                                {
                                                    exchange.requester.address?.region
                                                }

                                            </p>


                                        </div>



                                    </div>


                                </div>








                                <div className="user-card">


                                    <div className="user-info">


                                        <h4>

                                            {exchange.receiver.fullName}

                                        </h4>


                                        <p>

                                            {exchange.receiver.email}

                                        </p>


                                        <p>

                                            {exchange.receiver.phone}

                                        </p>




                                        <div className="address-box">


                                            <strong>

                                                Adresse

                                            </strong>


                                            <p>

                                                {
                                                    exchange.receiver.address?.address
                                                }

                                            </p>


                                            <p>

                                                {
                                                    exchange.receiver.address?.city
                                                },

                                                {
                                                    exchange.receiver.address?.region
                                                }

                                            </p>


                                        </div>


                                    </div>


                                </div>



                            </div>









                            {/* BOOKS */}

                            <div className="books-section">



                                <div className="books-column">


                                    <h4>

                                        📚 Demandeur

                                        (

                                        {
                                            exchange.requester.books.length
                                        }

                                        )

                                    </h4>




                                    {

                                        exchange.requester.books.length === 0 && (

                                            <div className="empty-books">

                                                Aucun livre

                                            </div>

                                        )

                                    }




                                    {

                                        exchange.requester.books.map(book=>(


                                            <div

                                                key={book.id}

                                                className="book-card"

                                            >


                                                <img

                                                    src={

                                                        book.image ||

                                                        "/book-placeholder.png"

                                                    }

                                                    alt={book.title}

                                                />



                                                <div className="book-info">


                                                    <h5 title={book.title}>

                                                        {book.title}

                                                    </h5>



                                                    <p>

                                                        {book.author}

                                                        {" · "}

                                                        {book.condition}

                                                    </p>


                                                    <p>

                                                        {book.publicationYear}

                                                        {" · "}

                                                        {book.language}

                                                    </p>


                                                </div>


                                            </div>


                                        ))

                                    }



                                </div>








                                <div className="books-column">


                                    <h4>

                                        📚 Destinataire

                                        (

                                        {
                                            exchange.receiver.books.length
                                        }

                                        )

                                    </h4>





                                    {

                                        exchange.receiver.books.length === 0 && (

                                            <div className="empty-books">

                                                Aucun livre

                                            </div>

                                        )

                                    }






                                    {

                                        exchange.receiver.books.map(book=>(


                                            <div

                                                key={book.id}

                                                className="book-card"

                                            >


                                                <img

                                                    src={

                                                        book.image ||

                                                        "/book-placeholder.png"

                                                    }

                                                    alt={book.title}

                                                />



                                                <div className="book-info">


                                                    <h5 title={book.title}>

                                                        {book.title}

                                                    </h5>



                                                    <p>

                                                        {book.author}

                                                        {" · "}

                                                        {book.condition}

                                                    </p>


                                                    <p>

                                                        {book.publicationYear}

                                                        {" · "}

                                                        {book.language}

                                                    </p>


                                                </div>


                                            </div>


                                        ))

                                    }



                                </div>



                            </div>









                            {/* DELIVERY */}


                            <div className="delivery-section">


                                <div className="delivery-card">


                                    <h4>

                                        Livraison

                                    </h4>


                                    <p>

                                        <strong>

                                            Frais :

                                        </strong>

                                        {" "}

                                        {
                                            exchange.delivery.fee.toFixed(2)
                                        }

                                        {" DH"}

                                    </p>



                                    <p>

                                        <strong>

                                            Demandeur :

                                        </strong>

                                        {" "}

                                        {
                                            exchange.delivery.requesterShare.toFixed(2)
                                        }

                                        {" DH"}

                                    </p>




                                    <p>

                                        <strong>

                                            Destinataire :

                                        </strong>

                                        {" "}

                                        {
                                            exchange.delivery.receiverShare.toFixed(2)
                                        }

                                        {" DH"}

                                    </p>



                                </div>






                                <div className="delivery-card">


                                    <h4>

                                        Paiement

                                    </h4>


                                    <p>

                                        <strong>

                                            Demandeur :

                                        </strong>

                                        {" "}

                                        {
                                            exchange.delivery.requesterPaymentMethod
                                        }


                                    </p>


                                    <p>

                                        <strong>

                                            Payé :

                                        </strong>

                                        {" "}

                                        {
                                            exchange.delivery.requesterPaid
                                        }

                                    </p>



                                    <hr />



                                    <p>

                                        <strong>

                                            Destinataire :

                                        </strong>

                                        {" "}

                                        {
                                            exchange.delivery.receiverPaymentMethod
                                        }


                                    </p>



                                    <p>

                                        <strong>

                                            Payé :

                                        </strong>

                                        {" "}

                                        {
                                            exchange.delivery.receiverPaid
                                        }


                                    </p>



                                </div>



                            </div>









                            {/* ACTIONS */}


                            <div className="exchange-actions">


                                <button


                                    className="collect-btn"


                                    disabled={actionLoading}


                                    onClick={() => handleCollect(exchange.id)}


                                >

                                    Commencer la collecte


                                </button>





                                <button


                                    className="reject-btn"


                                    disabled={actionLoading}


                                    onClick={() => openRejectModal(exchange)}


                                >

                                    Refuser


                                </button>


                            </div>



                        </div>


                    ))

                }









                {
                    totalPages > 1 && (


                        <div className="pagination">


                            <button


                                disabled={currentPage === 1}


                                onClick={() => setCurrentPage(currentPage - 1)}


                            >

                                ← Précédent


                            </button>





                            <span>


                                Page {currentPage} / {totalPages}


                            </span>






                            <button


                                disabled={currentPage === totalPages}


                                onClick={() => setCurrentPage(currentPage + 1)}


                            >

                                Suivant →


                            </button>


                        </div>


                    )

                }





                {
                    showRejectModal && (


                        <div className="modal-overlay">


                            <div className="reject-modal">


                                <h3>

                                    Refuser cette demande

                                </h3>



                                <p>

                                    Indiquez la raison du refus.

                                </p>




                                <textarea


                                    rows="4"


                                    placeholder="Raison du refus..."


                                    value={rejectReason}


                                    onChange={(e)=>setRejectReason(e.target.value)}


                                />





                                <div className="modal-actions">


                                    <button


                                        className="cancel-btn"


                                        onClick={() => {


                                            setShowRejectModal(false);

                                            setSelectedExchange(null);


                                        }}


                                    >

                                        Annuler


                                    </button>






                                    <button


                                        className="confirm-reject-btn"


                                        disabled={actionLoading}


                                        onClick={handleReject}


                                    >

                                        Confirmer


                                    </button>



                                </div>



                            </div>


                        </div>


                    )

                }



            </div>


        </ControllerLayout>

    );

}