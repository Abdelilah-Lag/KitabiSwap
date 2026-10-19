import "./UserWallets.css";


import {

    useEffect,
    useMemo,
    useState

} from "react";


import PaymentManagerLayout from "../../components/paymentManager/PaymentManagerLayout";


import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";


import {

    getUserWallets,
    creditWallet,
    debitWallet

} from "../../services/paymentwalletService";





export default function UserWallets() {


    const [loading,setLoading] = useState(true);


    const [wallets,setWallets] = useState([]);


    const [error,setError] = useState(null);




    const [pagination,setPagination] = useState({

        page:1,

        pageSize:25,

        total:0,

        totalPages:1

    });





    const [filters,setFilters] = useState({

        search:""

    });





    const effectiveFilters = useMemo(()=>({

        search:

            filters.search || undefined


    }),[filters]);







    const [modalOpen,setModalOpen] = useState(false);


    const [actionType,setActionType] = useState("");


    const [selectedWallet,setSelectedWallet] = useState(null);


    const [amount,setAmount] = useState("");


    const [description,setDescription] = useState("");








    async function loadData(

        page = pagination.page,

        pageSize = pagination.pageSize

    ){


        setLoading(true);


        try{


            const response = await getUserWallets({

                page,

                limit:pageSize,

                ...effectiveFilters

            });



            setWallets(

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


        catch(error){


            console.error(

                "USER_WALLETS_ERROR",

                error

            );


            setError(

                error.message

            );


        }


        finally{


            setLoading(false);


        }


    }









    useEffect(()=>{


        loadData(

            1,

            pagination.pageSize

        );


    },[

        effectiveFilters.search

    ]);









    function openWalletAction(

        wallet,

        type

    ){


        setSelectedWallet(wallet);


        setActionType(type);


        setAmount("");


        setDescription("");


        setModalOpen(true);


    }









    async function handleWalletAction(e){


        e.preventDefault();



        try{


            const payload = {


                amount:Number(amount),


                description


            };





            if(actionType === "credit"){


                await creditWallet(

                    selectedWallet.id,

                    payload

                );


            }

            else{


                await debitWallet(

                    selectedWallet.id,

                    payload

                );


            }






            setModalOpen(false);


            setSelectedWallet(null);


            await loadData(

                pagination.page,

                pagination.pageSize

            );


        }


        catch(error){


            console.error(error);


            alert(error.message);


        }


    }








    if(loading){


        return (

            <PaymentManagerLayout>

                <LoadingSpinner />

            </PaymentManagerLayout>

        );

    }







    return (

        <PaymentManagerLayout>


            <div className="user-wallets-page">



                <div className="user-wallets-header">


                    <div>

                        <h2>

                            Portefeuilles utilisateurs

                        </h2>


                        <p>

                            Gestion des soldes utilisateurs.

                        </p>


                    </div>


                </div>







                <div className="user-wallets-toolbar">


                    <input

                        type="text"

                        placeholder="Rechercher utilisateur..."

                        value={filters.search}


                        onChange={(e)=>


                            setFilters({

                                search:e.target.value

                            })


                        }


                    />



                    <button

                        onClick={()=>


                            loadData(

                                1,

                                pagination.pageSize

                            )


                        }

                    >

                        Rechercher

                    </button>



                </div>








                <div className="user-wallets-table-wrapper">


                    <table className="user-wallets-table">


                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Utilisateur</th>

                                <th>Email</th>

                                <th>Solde</th>

                                <th>Actions</th>

                            </tr>


                        </thead>




                        <tbody>



                        {

                            wallets.length === 0 &&

                            <tr>

                                <td colSpan="5">

                                    Aucun wallet trouvé.

                                </td>

                            </tr>

                        }





                        {

                            wallets.map(wallet=>(


                                <tr key={wallet.id}>


                                    <td>

                                        {wallet.id}

                                    </td>


                                    <td>


                                        {

                                            wallet.user?.first_name

                                        }

                                        {" "}

                                        {

                                            wallet.user?.last_name

                                        }


                                    </td>



                                    <td>

                                        {

                                            wallet.user?.email

                                        }

                                    </td>




                                    <td>


                                        <strong>


                                            {Number(wallet.balance).toFixed(2)}

                                            {" DH"}


                                        </strong>


                                    </td>





                                    <td>


                                        <button

                                            className="wallet-credit-btn"

                                            onClick={()=>


                                                openWalletAction(

                                                    wallet,

                                                    "credit"

                                                )


                                            }

                                        >

                                            + Ajouter

                                        </button>





                                        <button

                                            className="wallet-debit-btn"

                                            onClick={()=>


                                                openWalletAction(

                                                    wallet,

                                                    "debit"

                                                )


                                            }

                                        >

                                            - Débiter

                                        </button>


                                    </td>



                                </tr>


                            ))

                        }


                        </tbody>


                    </table>


                </div>









                {

                    modalOpen && selectedWallet && (


                        <div className="wallet-modal-overlay">


                            <div className="wallet-modal">


                                <h3>


                                    {

                                        actionType==="credit"

                                        ?

                                        "Ajouter au wallet"

                                        :

                                        "Débiter le wallet"


                                    }


                                </h3>




                                <form onSubmit={handleWalletAction}>


                                    <input

                                        type="number"

                                        placeholder="Montant"

                                        value={amount}

                                        onChange={(e)=>

                                            setAmount(e.target.value)

                                        }

                                        required

                                    />



                                    <textarea

                                        placeholder="Description"

                                        value={description}

                                        onChange={(e)=>

                                            setDescription(e.target.value)

                                        }

                                    />





                                    <button>


                                        Confirmer

                                    </button>




                                    <button

                                        type="button"

                                        onClick={()=>setModalOpen(false)}

                                    >

                                        Annuler

                                    </button>


                                </form>



                            </div>


                        </div>


                    )

                }





            </div>



        </PaymentManagerLayout>


    );


}