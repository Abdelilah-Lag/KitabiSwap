import "./WalletTransactions.css";


import {

    useEffect,
    useMemo,
    useState

} from "react";


import PaymentManagerLayout from "../../components/paymentManager/PaymentManagerLayout";


import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";


import {

    getWalletTransactions

} from "../../services/walletTransactionService";





export default function WalletTransactions() {



    /*
    ==========================================================
    STATES
    ==========================================================
    */


    const [loading, setLoading] = useState(true);



    const [transactions, setTransactions] = useState([]);



    const [error, setError] = useState(null);





    /*
    ==========================================================
    PAGINATION
    ==========================================================
    */


    const [pagination, setPagination] = useState({

        page: 1,

        pageSize: 25,

        total: 0,

        totalPages: 1

    });





    /*
    ==========================================================
    FILTERS
    ==========================================================
    */


    const [filters, setFilters] = useState({

        search: "",

        type: "",

        date: ""

    });





    const effectiveFilters = useMemo(() => ({


        search:

            filters.search || undefined,


        type:

            filters.type || undefined,


        date:

            filters.date || undefined



    }), [filters]);







    /*
    ==========================================================
    LOAD DATA
    ==========================================================
    */


    async function loadData(

        page = pagination.page,

        pageSize = pagination.pageSize

    ) {


        setLoading(true);



        try {



            const response =

                await getWalletTransactions({


                    page,


                    limit: pageSize,


                    ...effectiveFilters



                });





            if(Array.isArray(response)) {



                setTransactions(response);



                setPagination({


                    page:1,


                    pageSize:response.length,


                    total:response.length,


                    totalPages:1



                });



            }


            else {



                setTransactions(

                    response.data || []

                );



                setPagination(

                    response.pagination || {


                        page:1,


                        pageSize:25,


                        total:0,


                        totalPages:1


                    }

                );



            }



        }


        catch(error) {



            console.error(

                "WALLET_TRANSACTIONS_ERROR",

                error

            );



            setError(

                error.message

            );



        }


        finally {



            setLoading(false);



        }



    }







    /*
    ==========================================================
    FIRST LOAD
    ==========================================================
    */


    useEffect(()=>{


        loadData(

            1,

            pagination.pageSize

        );



    },[

        effectiveFilters.type,

        effectiveFilters.date

    ]);
    /*
    ==========================================================
    SEARCH
    ==========================================================
    */


    function handleSearch() {


        loadData(

            1,

            pagination.pageSize

        );


    }






    /*
    ==========================================================
    LOADING
    ==========================================================
    */


    if(loading) {


        return (


            <PaymentManagerLayout>


                <LoadingSpinner />


            </PaymentManagerLayout>


        );


    }







    return (



        <PaymentManagerLayout>



            <div className="wallet-transactions-page">





                {/* =======================================================
                    HEADER
                ======================================================= */}



                <div className="wallet-transactions-header">



                    <div>



                        <h2>


                            Transactions Wallet


                        </h2>




                        <p>


                            Consultez toutes les opérations financières
                            des utilisateurs.


                        </p>



                    </div>



                </div>







                {/* =======================================================
                    SEARCH & FILTERS
                ======================================================= */}



                <div className="wallet-transactions-toolbar">





                    <input



                        type="text"



                        placeholder="Rechercher un utilisateur..."



                        value={filters.search}



                        onChange={(e)=>



                            setFilters((prev)=>({



                                ...prev,



                                search:e.target.value



                            }))



                        }



                        onKeyDown={(e)=>{



                            if(e.key==="Enter"){



                                handleSearch();



                            }



                        }}



                    />







                    <select



                        value={filters.type}



                        onChange={(e)=>



                            setFilters((prev)=>({



                                ...prev,



                                type:e.target.value



                            }))



                        }



                    >





                        <option value="">



                            Tous les types



                        </option>







                        <option value="recharge">



                            Recharge



                        </option>






                        <option value="purchase">



                            Achat



                        </option>






                        <option value="exchange">



                            Échange



                        </option>






                        <option value="withdrawal">



                            Retrait



                        </option>





                        <option value="fee">



                            Frais



                        </option>





                    </select>







                    <input



                        type="date"



                        value={filters.date}



                        onChange={(e)=>



                            setFilters((prev)=>({



                                ...prev,



                                date:e.target.value



                            }))



                        }



                    />







                    <button



                        onClick={handleSearch}



                    >



                        Rechercher



                    </button>





                </div>









                {/* =======================================================
                    TABLE
                ======================================================= */}





                <div className="wallet-transactions-table-wrapper">






                    <table className="wallet-transactions-table">





                        <thead>



                            <tr>




                                <th>



                                    ID



                                </th>





                                <th>



                                    Utilisateur



                                </th>





                                <th>



                                    Type



                                </th>





                                <th>



                                    Montant



                                </th>





                                <th>



                                    Solde avant



                                </th>





                                <th>



                                    Solde après



                                </th>





                                <th>



                                    Description



                                </th>





                                <th>



                                    Date



                                </th>





                            </tr>




                        </thead>







                        <tbody>



                            {


                                transactions.length === 0 && (



                                    <tr>



                                        <td colSpan="8">



                                            Aucune transaction trouvée.



                                        </td>



                                    </tr>



                                )


                            }






                            {


                                transactions.map((transaction)=>(




                                    <tr key={transaction.id}>





                                        <td>



                                            {transaction.id}



                                        </td>







                                        <td>



                                            {


                                                transaction.user

                                                ?

                                                <>


                                                    <strong>


                                                        {transaction.user.first_name}

                                                        {" "}

                                                        {transaction.user.last_name}



                                                    </strong>


                                                    <br />



                                                    <small>


                                                        {transaction.user.email}



                                                    </small>



                                                </>


                                                :

                                                "-"



                                            }



                                        </td>







                                        <td>



                                            <span



                                                className={

                                                    `transaction-type ${transaction.type}`

                                                }



                                            >



                                                {transaction.type}



                                            </span>



                                        </td>








                                        <td>



                                            <strong>



                                                {

                                                    transaction.amount > 0

                                                    ?

                                                    "+"

                                                    :

                                                    ""

                                                }



                                                {transaction.amount}

                                                {" DH"}



                                            </strong>



                                        </td>







                                        <td>



                                            {transaction.balance_before}

                                            {" DH"}



                                        </td>








                                        <td>



                                            {transaction.balance_after}

                                            {" DH"}



                                        </td>







                                        <td>



                                            {transaction.description || "-"}



                                        </td>








                                        <td>



                                            {


                                                new Date(

                                                    transaction.created_at

                                                ).toLocaleString()



                                            }



                                        </td>






                                    </tr>





                                ))



                            }



                        </tbody>





                    </table>





                </div>
                                {/* =======================================================
                    PAGINATION
                ======================================================= */}


                <div className="wallet-transactions-pagination">



                    <button



                        disabled={pagination.page <= 1}



                        onClick={()=>



                            loadData(



                                pagination.page - 1,



                                pagination.pageSize



                            )



                        }



                    >



                        ◀ Précédent



                    </button>








                    <span>



                        Page {pagination.page} / {pagination.totalPages || 1}



                    </span>








                    <button



                        disabled={

                            pagination.page >= pagination.totalPages

                        }



                        onClick={()=>



                            loadData(



                                pagination.page + 1,



                                pagination.pageSize



                            )



                        }



                    >



                        Suivant ▶



                    </button>








                    <select



                        value={pagination.pageSize}



                        onChange={(e)=>{



                            const size = Number(e.target.value);



                            loadData(



                                1,



                                size



                            );



                        }}



                    >



                        <option value={10}>



                            10



                        </option>





                        <option value={25}>



                            25



                        </option>





                        <option value={50}>



                            50



                        </option>





                        <option value={100}>



                            100



                        </option>



                    </select>





                </div>






            </div>



        </PaymentManagerLayout>



    );



}