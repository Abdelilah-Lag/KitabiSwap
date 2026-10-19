import "./OrderBookCard.css";

import {
    FaBook,
    FaUser,
    FaTag,
    FaLayerGroup
} from "react-icons/fa";

export default function OrderBookCard({ book }) {

    if (!book) return null;


    return (

        <div className="order-book-card">


            <div className="order-book-image">

                <img
                    src={
                        book.cover ||
                        "/images/default-book.png"
                    }
                    alt={book.title}
                />

            </div>



            <div className="order-book-content">


                <h3 className="order-book-title">

                    <FaBook />

                    {book.title}

                </h3>



                <div className="order-book-grid">


                    <div className="order-book-item">

                        <span className="order-book-label">
                            Auteur
                        </span>

                        <span className="order-book-value">

                            <FaUser />

                            {book.author || "-"}

                        </span>

                    </div>



                    {
                        book.condition && (

                            <div className="order-book-item">

                                <span className="order-book-label">
                                    État
                                </span>

                                <span className="order-book-value">

                                    <FaLayerGroup />

                                    {book.condition}

                                </span>

                            </div>

                        )
                    }



                    <div className="order-book-item">

                        <span className="order-book-label">
                            Prix
                        </span>

                        <span className="order-book-value">

                            <FaTag />

                            {Number(book.price).toFixed(2)}
                            {" "}DH

                        </span>

                    </div>



                    {
                        book.quantity && (

                            <div className="order-book-item">

                                <span className="order-book-label">
                                    Quantité
                                </span>

                                <span className="order-book-value">

                                    {book.quantity}

                                </span>

                            </div>

                        )
                    }



                    {
                        book.delivery_price !== undefined && (

                            <div className="order-book-item">

                                <span className="order-book-label">
                                    Livraison
                                </span>

                                <span className="order-book-value">

                                    {Number(book.delivery_price).toFixed(2)}
                                    {" "}DH

                                </span>

                            </div>

                        )
                    }



                    {
                        book.total !== undefined && (

                            <div className="order-book-item order-book-total">

                                <span className="order-book-label">
                                    Total
                                </span>

                                <span className="order-book-value">

                                    {Number(book.total).toFixed(2)}
                                    {" "}DH

                                </span>

                            </div>

                        )
                    }


                </div>


            </div>


        </div>

    );

}