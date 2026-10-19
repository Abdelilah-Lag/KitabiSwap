import "./WarehouseUserBooksToSell.css";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import WarehouseLayout from "../../components/warehouse/WarehouseLayout";
import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import {
    getUserBooksToSell,
    deleteUserBookToSell
} from "../../services/warehouseUserBooksToSellService";

export default function WarehouseUserBooksToSell() {

    /*
    ==========================================================
    STATES
    ==========================================================
    */

    const [loading, setLoading] = useState(true);

    const [books, setBooks] = useState([]);

    const [pagination, setPagination] = useState({

        page: 1,

        pageSize: 25,

        total: 0,

        totalPages: 0

    });

    const [filters, setFilters] = useState({

        q: "",

        status: "",

        condition: ""

    });

    /*
    ==========================================================
    DELETE MODAL
    ==========================================================
    */

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedBook, setSelectedBook] = useState(null);

    /*
    ==========================================================
    FILTERS
    ==========================================================
    */

    const effectiveFilters = useMemo(() => ({

        q: filters.q || undefined,

        status: filters.status || undefined,

        condition: filters.condition || undefined

    }), [filters]);

    /*
    ==========================================================
    LOAD DATA
    ==========================================================
    */

    async function loadBooks(

        page = pagination.page,

        pageSize = pagination.pageSize

    ) {

        setLoading(true);

        try {

            const response = await getUserBooksToSell({

                page,

                pageSize,

                ...effectiveFilters

            });

            setBooks(response.data || []);

            setPagination(response.pagination || {

                page: 1,

                pageSize: 25,

                total: 0,

                totalPages: 1

            });

        }

        catch (error) {

            console.error(

                "USER_BOOKS_TO_SELL_ERROR:",

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

        loadBooks(

            1,

            pagination.pageSize

        );

    }, [

        effectiveFilters.status,

        effectiveFilters.condition

    ]);

    /*
    ==========================================================
    LOADING
    ==========================================================
    */

    if (loading) {

        return (

            <WarehouseLayout>

                <LoadingSpinner />

            </WarehouseLayout>

        );

    }
        return (

        <WarehouseLayout>

            <div className="warehouse-user-books">

                {/* =======================================================
                    HEADER
                ======================================================= */}

                <div className="warehouse-user-books-header">

                    <h2>

                        Livres utilisateurs à vendre

                    </h2>

                    <p>

                        Tous les livres actuellement proposés à la vente par les utilisateurs.

                    </p>

                </div>

                {/* =======================================================
                    SEARCH + FILTERS
                ======================================================= */}

                <div className="warehouse-user-books-toolbar">

                    <input

                        type="text"

                        placeholder="Rechercher un livre..."

                        value={filters.q}

                        onChange={(e) =>

                            setFilters(prev => ({

                                ...prev,

                                q: e.target.value

                            }))

                        }

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                loadBooks(

                                    1,

                                    pagination.pageSize

                                );

                            }

                        }}

                    />

                    <select

                        value={filters.status}

                        onChange={(e) =>

                            setFilters(prev => ({

                                ...prev,

                                status: e.target.value

                            }))

                        }

                    >

                        <option value="">

                            Tous les statuts

                        </option>

                        <option value="available">

                            Disponible

                        </option>

                        <option value="unavailable">

                            Indisponible

                        </option>

                    </select>

                    <select

                        value={filters.condition}

                        onChange={(e) =>

                            setFilters(prev => ({

                                ...prev,

                                condition: e.target.value

                            }))

                        }

                    >

                        <option value="">

                            Tous les états

                        </option>

                        <option value="like_new">

                            Comme neuf

                        </option>

                        <option value="very_good">

                            Très bon

                        </option>

                        <option value="good">

                            Bon

                        </option>

                        <option value="acceptable">

                            Acceptable

                        </option>

                        <option value="poor">

                            Mauvais

                        </option>

                    </select>

                    <button

                        onClick={() =>

                            loadBooks(

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

                <div className="warehouse-user-books-table-wrapper">

                    <table className="warehouse-user-books-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Image</th>

                                <th>Livre</th>

                                <th>Auteur</th>

                                <th>Utilisateur</th>

                                <th>Etat</th>

                                <th>Prix</th>

                                <th>Statut</th>

                                <th>Date</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {books.length === 0 && (

                                <tr>

                                    <td colSpan="10">

                                        Aucun livre trouvé.

                                    </td>

                                </tr>

                            )}

                            {books.map((row) => (

                                <tr key={row.id}>
                                                                    <td>

                                        {row.id}

                                    </td>

                                    <td>

                                        {row.book?.image ? (

                                            <img
                                                src={row.book.image}
                                                alt={row.book.title}
                                                className="warehouse-user-books-cover"
                                            />

                                        ) : (

                                            <div className="warehouse-user-books-no-image">

                                                Aucune image

                                            </div>

                                        )}

                                    </td>

                                    <td>

                                        <div className="warehouse-user-books-title">

                                            {row.book?.title}

                                        </div>

                                        <div className="warehouse-user-books-isbn">

                                            ISBN : {row.book?.isbn || "-"}

                                        </div>

                                    </td>

                                    <td>

                                        {row.book?.author || "-"}

                                    </td>

                                    <td>

                                        <div>

                                            {row.user?.first_name} {row.user?.last_name}

                                        </div>

                                        <small>

                                            {row.user?.email}

                                        </small>

                                    </td>

                                    <td>

                                        {row.book_condition}

                                    </td>

                                    <td>

                                        {row.price} DH

                                    </td>

                                    <td>

                                        <span
                                            className={`warehouse-user-books-status ${row.status}`}
                                        >

                                            {row.status}

                                        </span>

                                    </td>

                                    <td>

                                        {new Date(row.created_at).toLocaleDateString()}

                                    </td>

                                    <td>

                                        <button

                                            className="warehouse-user-books-delete"

                                            onClick={() => {

                                                setSelectedBook(row);

                                                setDeleteModalOpen(true);

                                            }}

                                        >

                                            Supprimer

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
                                {/* =======================================================
                    PAGINATION
                ======================================================= */}

                <div className="warehouse-user-books-pagination">

                    <button

                        disabled={pagination.page <= 1}

                        onClick={() => {

                            loadBooks(

                                pagination.page - 1,

                                pagination.pageSize

                            );

                        }}

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

                        onClick={() => {

                            loadBooks(

                                pagination.page + 1,

                                pagination.pageSize

                            );

                        }}

                    >

                        Suivant ▶

                    </button>

                    <select

                        value={pagination.pageSize}

                        onChange={(e) => {

                            const size = Number(e.target.value);

                            loadBooks(

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
                    DELETE MODAL
                ======================================================= */}

                {deleteModalOpen && selectedBook && (

                    <div className="warehouse-user-books-modal-overlay">

                        <div className="warehouse-user-books-modal">

                            <h3>

                                Supprimer ce livre ?

                            </h3>

                            <p>

                                Êtes-vous sûr de vouloir supprimer le livre

                                <br />

                                <strong>

                                    {selectedBook.book?.title}

                                </strong>

                                ?

                            </p>

                            <div className="warehouse-user-books-modal-actions">

                                <button

                                    className="warehouse-user-books-confirm"

                                    onClick={async () => {

                                        try {

                                            await deleteUserBookToSell(

                                                selectedBook.id

                                            );

                                            setDeleteModalOpen(false);

                                            setSelectedBook(null);

                                            await loadBooks(

                                                pagination.page,

                                                pagination.pageSize

                                            );

                                        }

                                        catch (error) {

                                            console.error(error);

                                        }

                                    }}

                                >

                                    Supprimer

                                </button>

                                <button

                                    className="warehouse-user-books-cancel"

                                    onClick={() => {

                                        setDeleteModalOpen(false);

                                        setSelectedBook(null);

                                    }}

                                >

                                    Annuler

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </WarehouseLayout>

    );

}