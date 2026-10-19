import { useEffect, useMemo, useState } from "react";

import "./UserCommande.css";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import {
    getCommandeInit,
    searchBooks,
    createCommande
} from "../../services/userCommandeService";

import {
    getDeliveryInfoByParams
} from "../../services/userCommandeDeliveryService";

/* ==========================================================
   USER COMMANDE
========================================================== */

export default function UserCommande() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);

    const [favorites, setFavorites] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [selectedBooks, setSelectedBooks] = useState([]);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");

    const [paymentType, setPaymentType] = useState("wallet");
    const [search, setSearch] = useState("");

    const [deliveryPrice, setDeliveryPrice] = useState(0);

    const [error, setError] = useState("");

    useEffect(() => {
        loadPage();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleSearch();
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    async function loadPage() {
        try {
            setLoading(true);

            const commande = await getCommandeInit();

            setWallet(commande.wallet);
            setFavorites(commande.favorites || []);
            setAddresses(commande.addresses || []);

            setDeliveryPrice(Number(commande.deliveryPrice || 0));

            const defaultAddress = commande.addresses?.find(
                address => address.is_default
            );

            if (defaultAddress) {
                setSelectedAddress(defaultAddress.id);
            }
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch() {
        try {
            if (search.trim() === "") {
                setSearchResults([]);
                return;
            }

            const response = await searchBooks(search);
            setSearchResults(response.books || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadDeliveryPrice();
    }, [selectedAddress]);

    async function loadDeliveryPrice() {
        try {
            if (!selectedAddress) return;

            const response = await getDeliveryInfoByParams({
                // Le backend calcule à partir de l'adresse par défaut.
                type: "shop",
                id: selectedAddress
            });

            // API: { success: true, delivery: { deliveryPrice, ... } }
            const nextPrice = response?.delivery?.deliveryPrice;
            setDeliveryPrice(Number(nextPrice || 0));
        } catch (err) {
            console.error("Erreur calcul livraison:", err);
            // On évite de masquer le problème: la UI doit savoir pourquoi c'est à 0.
            setError(
                err?.response?.data?.message ||
                "Erreur lors du calcul de la livraison."
            );
        }
    }



    const productsTotal = useMemo(() => {
        return selectedBooks.reduce(
            (total, book) => total + (Number(book.price) * Number(book.quantity)),
            0
        );
    }, [selectedBooks]);

    const total = useMemo(() => {
        return Number(productsTotal) + Number(deliveryPrice);
    }, [productsTotal, deliveryPrice]);

    function addBook(book) {
        setSelectedBooks(current => {
            const exists = current.find(
                item => item.type === book.type && item.id === book.id
            );

            if (exists) return current;

            return [
                ...current,
                {
                    ...book,
                    quantity: 1
                }
            ];
        });
    }

    function removeBook(type, id) {
        setSelectedBooks(current =>
            current.filter(item => !(item.type === type && item.id === id))
        );
    }

    function increaseQuantity(type, id) {
        setSelectedBooks(current =>
            current.map(item => {
                if (item.type !== type || item.id !== id) return item;

                // Livre utilisateur : un seul exemplaire
                if (item.type === "user") return item;

                if (item.quantity >= item.stock) return item;

                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            })
        );
    }

    function decreaseQuantity(type, id) {
        setSelectedBooks(current =>
            current.map(item => {
                if (item.type !== type || item.id !== id) return item;

                if (item.quantity <= 1) return item;

                return {
                    ...item,
                    quantity: item.quantity - 1
                };
            })
        );
    }

    async function submitCommande() {
        try {
            setSaving(true);
            setError("");

            if (selectedBooks.length === 0) {
                setError("Veuillez sélectionner au moins un livre.");
                return;
            }

            if (!selectedAddress) {
                setError("Veuillez sélectionner une adresse.");
                return;
            }

            const payload = {
                addressId: selectedAddress,
                paymentType,
                items: selectedBooks.map(book => ({
                    type: book.type,
                    id: book.id,
                    quantity: book.quantity
                }))
            };

            const response = await createCommande(payload);
            alert(response.message || "Commande créée avec succès.");

            setSelectedBooks([]);
            await loadPage();
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                "Erreur lors de la création de la commande."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <>
                <UserHeader user={user} />
                <div className="commande-loading">Chargement...</div>
                <UserFooter />
            </>
        );
    }

    return (
        <>
            <UserHeader user={user} />

            <div className="user-commande-page">
                <div className="user-commande-container">

                    <div className="commande-header">
                        <h1>Créer une commande</h1>
                        <p>
                            Recherchez des livres, ajoutez-les à votre commande puis choisissez votre mode de paiement.
                        </p>
                    </div>

                    {error && <div className="commande-error">{error}</div>}

                    <div className="commande-search">
                        <input
                            type="text"
                            placeholder="Rechercher un livre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {search.trim() !== "" && (
                        <>
                            <h2>Résultats de recherche</h2>
                            <div className="commande-books-grid">
                                {searchResults.length === 0 && (
                                    <div className="commande-empty">Aucun livre trouvé.</div>
                                )}

                                {searchResults.map(book => (
                                    <div
                                        key={`${book.type}-${book.id}`}
                                        className="commande-book-card"
                                    >
                                        <img src={book.image} alt={book.title} />
                                        <h3>{book.title}</h3>
                                        <p>{book.author}</p>
                                        <span>{Number(book.price).toFixed(2)} DH</span>

                                        {book.type === "shop" && <small>Stock : {book.stock}</small>}
                                        {book.type === "user" && <small>Livre utilisateur</small>}

                                        <button onClick={() => addBook(book)}>Ajouter</button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <h2>Mes favoris</h2>
                    <div className="commande-books-grid">
                        {favorites.length === 0 && (
                            <div className="commande-empty">Aucun favori.</div>
                        )}

                        {favorites.map(book => (
                            <div
                                key={`${book.type}-${book.id}`}
                                className="commande-book-card"
                            >
                                <img src={book.image} alt={book.title} />
                                <h3>{book.title}</h3>
                                <p>{book.author}</p>
                                <span>{Number(book.price).toFixed(2)} DH</span>

                                {book.type === "shop" && <small>Stock : {book.stock}</small>}
                                {book.type === "user" && <small>Livre utilisateur</small>}

                                <button onClick={() => addBook(book)}>Ajouter</button>
                            </div>
                        ))}
                    </div>

                    <h2>Livres sélectionnés</h2>
                    <div className="selected-books">
                        {selectedBooks.length === 0 && (
                            <div className="commande-empty">Aucun livre sélectionné.</div>
                        )}

                        {selectedBooks.map(book => (
                            <div
                                key={`${book.type}-${book.id}`}
                                className="selected-book-card"
                            >
                                <img src={book.image} alt={book.title} />

                                <div className="selected-book-info">
                                    <h3>{book.title}</h3>
                                    <p>{book.author}</p>
                                    <span>{Number(book.price).toFixed(2)} DH</span>
                                </div>

                                <div className="selected-book-quantity">
                                    <button onClick={() => decreaseQuantity(book.type, book.id)}>-</button>
                                    <span>{book.quantity}</span>
                                    <button
                                        disabled={book.type === "user"}
                                        onClick={() => increaseQuantity(book.type, book.id)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="selected-book-total">
                                    {(Number(book.price) * Number(book.quantity)).toFixed(2)} DH
                                </div>

                                <button
                                    className="remove-book-btn"
                                    onClick={() => removeBook(book.type, book.id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        ))}
                    </div>

                    <h2>Adresse de livraison</h2>
                    <select
                        className="commande-address"
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                    >
                        <option value="">Choisir une adresse</option>
                        {addresses.map(address => (
                            <option key={address.id} value={address.id}>
                                {`${address.label} - ${address.city}`}
                            </option>
                        ))}
                    </select>

                    <h2>Mode de paiement</h2>
                    <div className="payment-methods">
                        <label>
                            <input
                                type="radio"
                                value="wallet"
                                checked={paymentType === "wallet"}
                                onChange={(e) => setPaymentType(e.target.value)}
                            />
                            Wallet
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="cash_on_delivery"
                                checked={paymentType === "cash_on_delivery"}
                                onChange={(e) => setPaymentType(e.target.value)}
                            />
                            Paiement à la livraison
                        </label>
                    </div>

                    {wallet && (
                        <div className="wallet-info">
                            Solde disponible :
                            <strong>{Number(wallet.balance).toFixed(2)} DH</strong>
                        </div>
                    )}

                    <div className="commande-summary">
                        <div>
                            <span>Produits</span>
                            <strong>{productsTotal.toFixed(2)} DH</strong>
                        </div>
                        <div>
                            <span>Livraison</span>
                            <strong>{deliveryPrice.toFixed(2)} DH</strong>
                        </div>
                        <div className="commande-total">
                            <span>Total</span>
                            <strong>{total.toFixed(2)} DH</strong>
                        </div>
                    </div>

                    <div className="commande-actions-left">
                        <button
                            className="create-commande-btn"
                            disabled={saving}
                            onClick={submitCommande}
                        >
                            {saving ? "Création..." : "Valider la commande"}
                        </button>
                    </div>

                </div>
            </div>

            <UserFooter />
        </>
    );
}

