import "./Favorites.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import FavoriteBookCard from "../../components/favorites/FavoriteBookCard";
import FavoriteBookDetails from "../../components/favorites/FavoriteBookDetails";
import FavoritesEmpty from "../../components/favorites/FavoritesEmpty";

import {
    getFavorites,
    removeFavorite
} from "../../services/favoriteService";

export default function Favorites() {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState([]);

    const [selectedBook, setSelectedBook] = useState(null);

    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {

        loadFavorites();

    }, []);

    async function loadFavorites() {

        try {

            setLoading(true);

            const response = await getFavorites();

            console.log("Favorites :", response);

            if (Array.isArray(response)) {

                setFavorites(response);

            }

            else if (Array.isArray(response.favorites)) {

                setFavorites(response.favorites);

            }

            else {

                setFavorites([]);

            }

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    function handleViewDetails(book) {

        setSelectedBook(book);

        setShowDetails(true);

    }

    function closeDetails() {

        setSelectedBook(null);

        setShowDetails(false);

    }

 async function handleRemoveFavorite(book) {

    const confirmDelete = window.confirm(

        t("remove_favorite_confirmation")

    );

    if (!confirmDelete) return;

    try {

        await removeFavorite(book.favorite_id);

        alert(t("favorite_removed_successfully"));

        setFavorites((previous) =>

            previous.filter(

                (item) => item.favorite_id !== book.favorite_id

            )

        );

    }

    catch (error) {

        console.error(error);

        alert(t("something_went_wrong"));

    }

}

    return (

        <>

            <UserHeader />

            <div className="favorites-page">

                <div className="favorites-container">

                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="favorites-header">

                        <h1>

                            {t("favorites")}

                        </h1>

                        <p>

                            {t("favorites_description")}

                        </p>

                    </div>

                    {/* ==========================================
                        LOADING
                    ========================================== */}

                    {

                        loading &&

                        <div className="favorites-loading">

                            {t("loading")}...

                        </div>

                    }

                    {/* ==========================================
                        EMPTY
                    ========================================== */}

                    {

                        !loading &&

                        favorites.length === 0 &&

                        <FavoritesEmpty />

                    }

                    {/* ==========================================
                        GRID
                    ========================================== */}

                    {

                        !loading &&

                        favorites.length > 0 &&

                        <div className="favorites-grid">

                            {

                                favorites.map((book) => (

                                    <FavoriteBookCard

                                        key={book.favorite_id}

                                        book={book}

                                        onViewDetails={handleViewDetails}

                                        onRemove={handleRemoveFavorite}

                                    />

                                ))

                            }

                        </div>

                    }

                </div>

            </div>

            {

                showDetails &&

                selectedBook &&

                <FavoriteBookDetails

                    book={selectedBook}

                    onClose={closeDetails}

                />

            }

            <UserFooter />

        </>

    );

}