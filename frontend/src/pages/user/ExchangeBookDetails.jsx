import "./ExchangeBookDetails.css";
import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

export default function ExchangeBookDetails() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const { id } = useParams();

    const [book, setBook] = useState(null);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {

        loadUser();
        loadBook();

    }, [id]);

    async function loadUser() {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                "http://localhost:5000/api/user/dashboard",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setUser(res.data.user || null);

        }

        catch (error) {

            console.error("Failed to load user profile", error);

            try {

                const storedUser = localStorage.getItem("user");

                if (storedUser) {

                    setUser(JSON.parse(storedUser));

                }

            }

            catch (parseError) {

                console.error("Failed to parse stored user", parseError);

            }

        }

    }

    async function loadBook() {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                `http://localhost:5000/api/exchange/book/${id}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const data = res.data;

            const normalizedImages = (data.images || []).map(image => ({

                id: image.id,

                image_url: image.image_url || image.url || "",

                cover: image.cover || false

            }));

            setBook({

                ...data,

                images: normalizedImages

            });

            setCurrentImage(

                normalizedImages.length

                    ? normalizedImages[0].image_url

                    : data.cover

            );

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <>

                <UserHeader user={user} />

                <div className="exchange-book-loading">

                    {t("loading")}

                </div>

                <UserFooter />

            </>

        );

    }

    return (

        <>

            <UserHeader user={user} />

            <section className="exchange-book-details">

                <div className="exchange-book-container">

                    <div className="exchange-gallery">

                        <img

                            src={currentImage}

                            alt={book.title}

                            className="exchange-cover"

                        />

                        <div className="exchange-thumbnails">

                            {

                                (book.images || []).map(image => (

                                    <img

                                        key={image.id}

                                        src={image.image_url}

                                        alt=""

                                        onClick={() =>

                                            setCurrentImage(

                                                image.image_url

                                            )

                                        }

                                    />

                                ))

                            }

                        </div>

                    </div>

                    <div className="exchange-book-info">

                        <span className="exchange-badge">

                            {t("available_for_exchange")}

                        </span>

                        <h1>

                            {book.title}

                        </h1>

                        <h2>

                            {book.author}

                        </h2>

                        <div className="exchange-information">

                            <div>

                                <span>

                                    {t("owner")}

                                </span>

                                <strong>

                                    {book.owner}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("condition")}

                                </span>

                                <strong>

                                    {t(book.condition)}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("estimated_price")}

                                </span>

                                <strong>

                                    {book.estimated_price} DH

                                </strong>

                            </div>

                            <div>

                                <span>

                                    ISBN

                                </span>

                                <strong>

                                    {book.isbn}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("publisher")}

                                </span>

                                <strong>

                                    {book.publisher}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("edition")}

                                </span>

                                <strong>

                                    {book.edition}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("publication_year")}

                                </span>

                                <strong>

                                    {book.publication_year}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("language")}

                                </span>

                                <strong>

                                    {book.language}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("category")}

                                </span>

                                <strong>

                                    {book.category}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    {t("pages")}

                                </span>

                                <strong>

                                    {book.pages}

                                </strong>

                            </div>

                        </div>

                        <div className="exchange-description">

                            <h3>

                                {t("description")}

                            </h3>

                            <p>

                                {book.description}

                            </p>

                        </div>

                        <div className="exchange-actions">

                            <button

                                className="btn-back"

                                onClick={() => navigate(-1)}

                            >

                                {t("back")}

                            </button>

                            <button

                                className="btn-request"

                                onClick={() =>

                                    navigate(

                                        `/user/exchange/request/${book.id}`

                                    )

                                }

                            >

                                {t("request_exchange")}

                            </button>

                        </div>

                    </div>

                </div>

            </section>

            <UserFooter />

        </>

    );

}