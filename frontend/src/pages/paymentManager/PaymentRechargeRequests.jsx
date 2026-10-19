import "./PaymentRechargeRequests.css";

import {

    useEffect,
    useMemo,
    useState

} from "react";

import PaymentManagerLayout from "../../components/paymentManager/PaymentManagerLayout";

import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import {

    getRechargeRequests,
    approveRechargeRequest,
    rejectRechargeRequest

} from "../../services/paymentRechargeRequestService";

export default function PaymentRechargeRequests() {

    /*
    ==========================================================
    STATES
    ==========================================================
    */

    const [loading, setLoading] = useState(true);

    const [requests, setRequests] = useState([]);

    const [pagination, setPagination] = useState({

        page: 1,

        pageSize: 25,

        total: 0,

        totalPages: 1

    });

    const [filters, setFilters] = useState({

        search: "",

        status: ""

    });

    /*
    ==========================================================
    IMAGE MODAL
    ==========================================================
    */

    const [imageModalOpen, setImageModalOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState("");

    /*
    ==========================================================
    APPROVE MODAL
    ==========================================================
    */

    const [approveModalOpen, setApproveModalOpen] = useState(false);

    const [selectedApprove, setSelectedApprove] = useState(null);

    /*
    ==========================================================
    REJECT MODAL
    ==========================================================
    */

    const [rejectModalOpen, setRejectModalOpen] = useState(false);

    const [selectedReject, setSelectedReject] = useState(null);

    const [rejectReason, setRejectReason] = useState("");

    /*
    ==========================================================
    FILTERS
    ==========================================================
    */

    const effectiveFilters = useMemo(() => ({

        search: filters.search || undefined,

        status: filters.status || undefined

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

            const response = await getRechargeRequests({

                page,

                limit: pageSize,

                ...effectiveFilters

            });

            setRequests(

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

        catch (error) {

            console.error(

                "RECHARGE_REQUESTS_ERROR",

                error

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
    LOADING
    ==========================================================
    */

    if (loading) {

        return (

            <PaymentManagerLayout>

                <LoadingSpinner />

            </PaymentManagerLayout>

        );

    }

    return (

        <PaymentManagerLayout>

            <div className="payment-recharge-page">

                            {/* =======================================================
                    HEADER
                ======================================================= */}

                <div className="payment-recharge-header">

                    <h2>

                        Demandes de recharge

                    </h2>

                    <p>

                        Gérez les demandes de recharge des utilisateurs.

                    </p>

                </div>

                {/* =======================================================
                    SEARCH & FILTERS
                ======================================================= */}

                <div className="payment-recharge-toolbar">

                    <input

                        type="text"

                        placeholder="Rechercher un utilisateur..."

                        value={filters.search}

                        onChange={(e) =>

                            setFilters((prev) => ({

                                ...prev,

                                search: e.target.value

                            }))

                        }

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                loadData(

                                    1,

                                    pagination.pageSize

                                );

                            }

                        }}

                    />

                    <select

                        value={filters.status}

                        onChange={(e) =>

                            setFilters((prev) => ({

                                ...prev,

                                status: e.target.value

                            }))

                        }

                    >

                        <option value="">

                            Tous les statuts

                        </option>

                        <option value="pending">

                            En attente

                        </option>

                        <option value="approved">

                            Validée

                        </option>

                        <option value="rejected">

                            Refusée

                        </option>

                    </select>

                    <button

                        onClick={() =>

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

                <div className="payment-recharge-table-wrapper">

                    <table className="payment-recharge-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Preuve</th>

                                <th>Utilisateur</th>

                                <th>Email</th>

                                <th>Montant</th>

                                <th>Statut</th>

                                <th>Date</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>
                                                    {

                            requests.length === 0 && (

                                <tr>

                                    <td colSpan="8">

                                        Aucune demande trouvée.

                                    </td>

                                </tr>

                            )

                        }

                        {

                            requests.map((request) => (

                                <tr key={request.id}>

                                    <td>

                                        {request.id}

                                    </td>

                                    <td>

                                        {

                                            request.proof_image_url ? (

                                                <img

                                                    src={request.proof_image_url}

                                                    alt="Proof"

                                                    className="payment-proof-image"

                                                    onClick={() => {

                                                        setSelectedImage(

                                                            request.proof_image_url

                                                        );

                                                        setImageModalOpen(true);

                                                    }}

                                                />

                                            ) : (

                                                <span>

                                                    Aucune preuve

                                                </span>

                                            )

                                        }

                                    </td>

                                    <td>

                                        <strong>

                                            {request.user.first_name}{" "}

                                            {request.user.last_name}

                                        </strong>

                                    </td>

                                    <td>

                                        {request.user.email}

                                    </td>

                                    <td>

                                        <strong>

                                            {request.amount} DH

                                        </strong>

                                    </td>

                                    <td>

                                        <span

                                            className={`payment-status ${request.status}`}

                                        >

                                            {

                                                request.status === "pending"

                                                    ? "En attente"

                                                    : request.status === "approved"

                                                        ? "Validée"

                                                        : "Refusée"

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                request.created_at

                                            ).toLocaleDateString()

                                        }

                                    </td>

                                    <td>

                                        <div className="payment-actions">

                                            <button

                                                className="payment-view-btn"

                                                onClick={() => {

                                                    setSelectedImage(

                                                        request.proof_image_url

                                                    );

                                                    setImageModalOpen(true);

                                                }}

                                            >

                                                Voir

                                            </button>

                                            {

                                                request.status === "pending" && (

                                                    <>

                                                        <button

                                                            className="payment-approve-btn"

                                                            onClick={() => {

                                                                setSelectedApprove(

                                                                    request

                                                                );

                                                                setApproveModalOpen(

                                                                    true

                                                                );

                                                            }}

                                                        >

                                                            Confirmer

                                                        </button>

                                                        <button

                                                            className="payment-reject-btn"

                                                            onClick={() => {

                                                                setSelectedReject(

                                                                    request

                                                                );

                                                                setRejectReason("");

                                                                setRejectModalOpen(

                                                                    true

                                                                );

                                                            }}

                                                        >

                                                            Refuser

                                                        </button>

                                                    </>

                                                )

                                            }

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

                        onClick={() =>

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

                            pagination.page >=

                            pagination.totalPages

                        }

                        onClick={() =>

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

                        onChange={(e) => {

                            const size = Number(e.target.value);

                            loadData(

                                1,

                                size

                            );

                        }}

                    >

                        <option value={10}>10</option>

                        <option value={25}>25</option>

                        <option value={50}>50</option>

                        <option value={100}>100</option>

                    </select>

                </div>

                {/* =======================================================
                    IMAGE MODAL
                ======================================================= */}

                {

                    imageModalOpen && (

                        <div

                            className="payment-modal-overlay"

                            onClick={() =>

                                setImageModalOpen(false)

                            }

                        >

                            <div

                                className="payment-image-modal"

                                onClick={(e) =>

                                    e.stopPropagation()

                                }

                            >

                                <img

                                    src={selectedImage}

                                    alt="Proof"

                                />

                                <button

                                    className="payment-close-btn"

                                    onClick={() =>

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
                    APPROVE MODAL
                ======================================================= */}

                {

                    approveModalOpen && selectedApprove && (

                        <div className="payment-modal-overlay">

                            <div className="payment-modal">

                                <h3>

                                    Confirmer la recharge

                                </h3>

                                <p>

                                    Voulez-vous créditer

                                    <br />

                                    <strong>

                                        {selectedApprove.amount} DH

                                    </strong>

                                    <br />

                                    au portefeuille de

                                    <br />

                                    <strong>

                                        {selectedApprove.user.first_name}{" "}

                                        {selectedApprove.user.last_name}

                                    </strong>

                                    ?

                                </p>

                                <div className="payment-modal-actions">

                                    <button

                                        className="payment-confirm-btn"

                                        onClick={async () => {

                                            try {

                                                await approveRechargeRequest(

                                                    selectedApprove.id

                                                );

                                                setApproveModalOpen(false);

                                                setSelectedApprove(null);

                                                await loadData(

                                                    pagination.page,

                                                    pagination.pageSize

                                                );

                                            }

                                            catch (error) {

                                                console.error(error);

                                            }

                                        }}

                                    >

                                        Confirmer

                                    </button>

                                    <button

                                        className="payment-cancel-btn"

                                        onClick={() => {

                                            setApproveModalOpen(false);

                                            setSelectedApprove(null);

                                        }}

                                    >

                                        Annuler

                                    </button>

                                </div>

                            </div>

                        </div>

                    )

                }

                {/* =======================================================
                    REJECT MODAL
                ======================================================= */}

                {

                    rejectModalOpen && selectedReject && (

                        <div className="payment-modal-overlay">

                            <div className="payment-modal">

                                <h3>

                                    Refuser la recharge

                                </h3>

                                <textarea

                                    placeholder="Motif du refus..."

                                    value={rejectReason}

                                    onChange={(e) =>

                                        setRejectReason(

                                            e.target.value

                                        )

                                    }

                                />

                                <div className="payment-modal-actions">

                                    <button

                                        className="payment-reject-confirm-btn"

                                        onClick={async () => {

                                            try {

                                                await rejectRechargeRequest(

                                                    selectedReject.id,

                                                    rejectReason

                                                );

                                                setRejectModalOpen(false);

                                                setSelectedReject(null);

                                                setRejectReason("");

                                                await loadData(

                                                    pagination.page,

                                                    pagination.pageSize

                                                );

                                            }

                                            catch (error) {

                                                console.error(error);

                                            }

                                        }}

                                    >

                                        Refuser

                                    </button>

                                    <button

                                        className="payment-cancel-btn"

                                        onClick={() => {

                                            setRejectModalOpen(false);

                                            setSelectedReject(null);

                                            setRejectReason("");

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