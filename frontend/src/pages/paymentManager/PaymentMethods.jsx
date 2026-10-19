import "./PaymentMethods.css";


import {

    useEffect,
    useState,
    useMemo

} from "react";


import PaymentManagerLayout from "../../components/paymentManager/PaymentManagerLayout";


import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";


import {

    getPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod

} from "../../services/paymentMethodService";



export default function PaymentMethods() {


    /*
    ==========================================================
    STATES
    ==========================================================
    */


    const [loading, setLoading] = useState(true);


    const [methods, setMethods] = useState([]);



    const [error, setError] = useState(null);



    /*
    ==========================================================
    PAGINATION (READY FOR FUTURE)
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

        status: ""

    });



    const effectiveFilters = useMemo(() => ({


        search:

            filters.search || undefined,


        status:

            filters.status || undefined


    }), [filters]);




    /*
    ==========================================================
    FORM MODAL
    ==========================================================
    */


    const [formModalOpen, setFormModalOpen] = useState(false);



    const [editId, setEditId] = useState(null);



    const [formData, setFormData] = useState({

        name: "",

        type: "bank_transfer",

        account_name: "",

        bank_name: "",

        rib: "",

        iban: "",

        swift_code: "",

        account_number: "",

        payment_url: "",

        instructions: "",

        display_order: 0,

        is_active: true,

        qr_code: null

    });




    /*
    ==========================================================
    DELETE MODAL
    ==========================================================
    */


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);



    const [selectedDelete, setSelectedDelete] = useState(null);




    /*
    ==========================================================
    IMAGE MODAL
    ==========================================================
    */


    const [imageModalOpen, setImageModalOpen] = useState(false);



    const [selectedImage, setSelectedImage] = useState("");





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

                await getPaymentMethods({

                    page,

                    limit: pageSize,

                    ...effectiveFilters

                });



            /*
            compatible avec plusieurs formats backend
            */


            if (Array.isArray(response)) {


                setMethods(response);


                setPagination({

                    page: 1,

                    pageSize: response.length,

                    total: response.length,

                    totalPages: 1

                });


            }

            else {


                setMethods(

                    response.data || []

                );


                setPagination(

                    response.pagination || {

                        page: 1,

                        pageSize: 25,

                        total: 0,

                        totalPages: 1

                    }

                );


            }


        }


        catch(error) {


            console.error(

                "PAYMENT_METHODS_ERROR",

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


    useEffect(() => {


        loadData(

            1,

            pagination.pageSize

        );


    }, [

        effectiveFilters.status

    ]);







    /*
    ==========================================================
    HANDLE INPUT
    ==========================================================
    */


    function handleChange(e) {


        const {

            name,

            value,

            type,

            checked


        } = e.target;



        setFormData((prev) => ({


            ...prev,


            [name]:

                type === "checkbox"

                    ? checked

                    : value


        }));


    }






    /*
    ==========================================================
    HANDLE FILE
    ==========================================================
    */


    function handleFile(e) {


        setFormData((prev) => ({


            ...prev,


            qr_code:

                e.target.files[0]


        }));


    }






    /*
    ==========================================================
    RESET FORM
    ==========================================================
    */


    function resetForm() {


        setFormData({

            name: "",

            type: "bank_transfer",

            account_name: "",

            bank_name: "",

            rib: "",

            iban: "",

            swift_code: "",

            account_number: "",

            payment_url: "",

            instructions: "",

            display_order: 0,

            is_active: true,

            qr_code: null

        });


        setEditId(null);


        setFormModalOpen(false);


    }






    /*
    ==========================================================
    OPEN EDIT
    ==========================================================
    */


    function openEdit(method) {


        setEditId(

            method.id

        );


        setFormData({

            ...method,

            qr_code: null

        });


        setFormModalOpen(true);


    }






    /*
    ==========================================================
    SUBMIT FORM
    ==========================================================
    */


    async function handleSubmit(e) {


        e.preventDefault();



        const data = new FormData();



        Object.keys(formData).forEach((key) => {


            if(formData[key] !== null) {


                data.append(

                    key,

                    formData[key]

                );


            }


        });




        try {


            if(editId) {


                await updatePaymentMethod(

                    editId,

                    data

                );


            }

            else {


                await createPaymentMethod(

                    data

                );


            }



            resetForm();



            await loadData(

                pagination.page,

                pagination.pageSize

            );


        }


        catch(error) {


            console.error(error);


            alert(

                error.message

            );


        }


    }
        return (

        <PaymentManagerLayout>


            <div className="payment-methods-page">



                {/* =======================================================
                    HEADER
                ======================================================= */}


                <div className="payment-methods-header">


                    <div>


                        <h2>

                            Méthodes de paiement

                        </h2>


                        <p>

                            Gérez les moyens de paiement disponibles
                            pour les utilisateurs.

                        </p>


                    </div>



                    <button

                        className="payment-add-btn"

                        onClick={() => {

                            resetForm();

                            setFormModalOpen(true);

                        }}

                    >

                        + Ajouter une méthode

                    </button>


                </div>





                {/* =======================================================
                    SEARCH & FILTERS
                ======================================================= */}


                <div className="payment-methods-toolbar">


                    <input


                        type="text"


                        placeholder="Rechercher une méthode..."


                        value={filters.search}


                        onChange={(e) =>

                            setFilters((prev) => ({


                                ...prev,


                                search:

                                    e.target.value


                            }))


                        }


                        onKeyDown={(e)=>{


                            if(e.key === "Enter"){


                                loadData(

                                    1,

                                    pagination.pageSize

                                );


                            }


                        }}


                    />





                    <select


                        value={filters.status}


                        onChange={(e)=>


                            setFilters((prev)=>({


                                ...prev,


                                status:

                                    e.target.value


                            }))


                        }


                    >


                        <option value="">


                            Tous les statuts


                        </option>



                        <option value="active">


                            Active


                        </option>



                        <option value="inactive">


                            Désactivée


                        </option>


                    </select>






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






                {/* =======================================================
                    TABLE
                ======================================================= */}


                <div className="payment-methods-table-wrapper">



                    <table className="payment-methods-table">


                        <thead>


                            <tr>


                                <th>

                                    ID

                                </th>



                                <th>

                                    QR Code

                                </th>



                                <th>

                                    Nom

                                </th>



                                <th>

                                    Type

                                </th>



                                <th>

                                    Banque

                                </th>



                                <th>

                                    RIB

                                </th>



                                <th>

                                    Statut

                                </th>



                                <th>

                                    Ordre

                                </th>



                                <th>

                                    Actions

                                </th>


                            </tr>


                        </thead>




                        <tbody>



                        {


                            methods.length === 0 && (


                                <tr>


                                    <td colSpan="9">


                                        Aucune méthode trouvée.


                                    </td>


                                </tr>


                            )


                        }




                        {


                            methods.map((method)=>(


                                <tr key={method.id}>


                                    <td>


                                        {method.id}


                                    </td>




                                    <td>


                                    {


                                        method.qr_code_image_url ? (


                                            <img


                                                src={

                                                    method.qr_code_image_url

                                                }


                                                alt="QR Code"


                                                className="payment-qr-image"



                                                onClick={()=>{


                                                    setSelectedImage(

                                                        method.qr_code_image_url

                                                    );


                                                    setImageModalOpen(true);


                                                }}


                                            />


                                        )


                                        :


                                        (


                                            <span>


                                                Aucun


                                            </span>


                                        )


                                    }



                                    </td>





                                    <td>


                                        <strong>


                                            {method.name}


                                        </strong>


                                    </td>





                                    <td>


                                        {method.type}


                                    </td>





                                    <td>


                                        {method.bank_name || "-"}


                                    </td>





                                    <td>


                                        {method.rib || "-"}


                                    </td>





                                    <td>


                                        <span


                                            className={

                                                `payment-status ${
                                                    method.is_active

                                                    ?

                                                    "active"

                                                    :

                                                    "inactive"

                                                }`

                                            }


                                        >


                                            {


                                                method.is_active

                                                ?

                                                "Active"

                                                :

                                                "Inactive"


                                            }


                                        </span>


                                    </td>






                                    <td>


                                        {method.display_order}


                                    </td>






                                    <td>


                                        <div className="payment-actions">



                                            <button


                                                className="payment-edit-btn"


                                                onClick={()=>


                                                    openEdit(method)


                                                }


                                            >


                                                Modifier


                                            </button>






                                            <button


                                                className="payment-delete-btn"


                                                onClick={()=>{


                                                    setSelectedDelete(

                                                        method

                                                    );


                                                    setDeleteModalOpen(

                                                        true

                                                    );


                                                }}


                                            >


                                                Supprimer


                                            </button>



                                        </div>


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


                <div className="payment-pagination">


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






                {/* =======================================================
                    IMAGE MODAL
                ======================================================= */}


                {


                    imageModalOpen && (


                        <div


                            className="payment-modal-overlay"


                            onClick={()=>


                                setImageModalOpen(false)

                            }


                        >


                            <div


                                className="payment-image-modal"


                                onClick={(e)=>

                                    e.stopPropagation()

                                }


                            >


                                <img


                                    src={selectedImage}


                                    alt="QR Code"


                                />



                                <button


                                    className="payment-close-btn"


                                    onClick={()=>


                                        setImageModalOpen(false)

                                    }


                                >


                                    Fermer


                                </button>


                            </div>


                        </div>


                    )


                }







                {/* =======================================================
                    CREATE / UPDATE MODAL
                ======================================================= */}



                {


                    formModalOpen && (



                        <div className="payment-modal-overlay">



                            <div className="payment-modal payment-form-modal">



                                <h3>


                                    {


                                        editId

                                        ?

                                        "Modifier la méthode"

                                        :

                                        "Ajouter une méthode"


                                    }



                                </h3>





                                <form


                                    onSubmit={handleSubmit}


                                >



                                    <input


                                        name="name"


                                        placeholder="Nom"


                                        value={formData.name}


                                        onChange={handleChange}


                                        required


                                    />





                                    <select

    name="type"

    value={formData.type}

    onChange={handleChange}

>


    <option value="bank_transfer">

        Virement bancaire

    </option>



    <option value="CIH_bank">

        CIH Bank

    </option>



    <option value="barid_bank">

        Barid Bank

    </option>



    <option value="stripe">

        Stripe

    </option>



    <option value="paypal">

        PayPal

    </option>



    <option value="payoneer">

        Payoneer

    </option>



    <option value="other">

        Autre

    </option>


</select>
                                    <input


                                        name="account_name"


                                        placeholder="Nom du compte"


                                        value={formData.account_name}


                                        onChange={handleChange}


                                    />






                                    <input


                                        name="bank_name"


                                        placeholder="Banque"


                                        value={formData.bank_name}


                                        onChange={handleChange}


                                    />






                                    <input


                                        name="rib"


                                        placeholder="RIB"


                                        value={formData.rib}


                                        onChange={handleChange}


                                    />






                                    <input


                                        name="iban"


                                        placeholder="IBAN"


                                        value={formData.iban}


                                        onChange={handleChange}


                                    />







                                    <input


                                        name="account_number"


                                        placeholder="Numéro compte"


                                        value={formData.account_number}


                                        onChange={handleChange}


                                    />







                                    <textarea


                                        name="instructions"


                                        placeholder="Instructions"


                                        value={formData.instructions}


                                        onChange={handleChange}


                                    />







                                    <input


                                        type="number"


                                        name="display_order"


                                        placeholder="Ordre"


                                        value={formData.display_order}


                                        onChange={handleChange}


                                    />








                                    <label>


                                        <input


                                            type="checkbox"


                                            name="is_active"


                                            checked={formData.is_active}


                                            onChange={handleChange}


                                        />


                                        Active



                                    </label>







                                    <input


                                        type="file"


                                        accept="image/*"


                                        onChange={handleFile}


                                    />








                                    <div className="payment-modal-actions">





                                        <button


                                            className="payment-confirm-btn"


                                        >


                                            {


                                                editId

                                                ?

                                                "Modifier"

                                                :

                                                "Créer"


                                            }


                                        </button>







                                        <button


                                            type="button"


                                            className="payment-cancel-btn"


                                            onClick={resetForm}


                                        >


                                            Annuler


                                        </button>





                                    </div>





                                </form>




                            </div>



                        </div>




                    )


                }









                {/* =======================================================
                    DELETE MODAL
                ======================================================= */}



                {


                    deleteModalOpen && selectedDelete && (



                        <div className="payment-modal-overlay">



                            <div className="payment-modal">



                                <h3>


                                    Supprimer la méthode


                                </h3>





                                <p>


                                    Voulez-vous supprimer :


                                    <br />



                                    <strong>


                                        {selectedDelete.name}


                                    </strong>



                                    ?



                                </p>






                                <div className="payment-modal-actions">





                                    <button


                                        className="payment-delete-confirm-btn"


                                        onClick={async()=>{



                                            try {


                                                await deletePaymentMethod(

                                                    selectedDelete.id

                                                );



                                                setDeleteModalOpen(false);


                                                setSelectedDelete(null);



                                                await loadData(

                                                    pagination.page,

                                                    pagination.pageSize

                                                );



                                            }


                                            catch(error){



                                                console.error(error);



                                            }



                                        }}



                                    >



                                        Supprimer



                                    </button>







                                    <button


                                        className="payment-cancel-btn"


                                        onClick={()=>{


                                            setDeleteModalOpen(false);


                                            setSelectedDelete(null);



                                        }}


                                    >



                                        Annuler



                                    </button>






                                </div>



                            </div>




                        </div>



                    )


                }



            </div>


        </PaymentManagerLayout>


    );


}
