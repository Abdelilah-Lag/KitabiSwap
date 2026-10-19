import "./DashboardLowStock.css";

import {

    FaBook,
    FaExclamationTriangle

} from "react-icons/fa";

export default function DashboardLowStock({

    books = []

}) {

    return (

        <div className="dashboard-stock-card">

            <div className="dashboard-stock-header">

                <h2>

                    Low Stock Books

                </h2>

                <p>

                    Books that need restocking soon.

                </p>

            </div>

            {

                books.length === 0 ?

                (

                    <div className="dashboard-stock-empty">

                        No low stock books.

                    </div>

                )

                :

                (

                    <table className="dashboard-stock-table">

                        <thead>

                            <tr>

                                <th>Book</th>

                                <th>Stock</th>

                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                books.map((book)=>(

                                    <tr key={book.id}>

                                        <td>

                                            <div className="dashboard-stock-book">

                                                <img

                                                    src={

                                                        book.book_catalog?.book_images?.[0]?.image_url ||

                                                        "/images/book-placeholder.png"

                                                    }

                                                    alt={book.book_catalog?.title}

                                                />

                                                <div>

                                                    <strong>

                                                        {book.book_catalog?.title}

                                                    </strong>

                                                    <span>

                                                        {book.book_catalog?.author}

                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <span className="stock-number">

                                                {book.quantity}

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                book.quantity <= 2 ?

                                                (

                                                    <span className="stock-danger">

                                                        <FaExclamationTriangle />

                                                        Critical

                                                    </span>

                                                )

                                                :

                                                (

                                                    <span className="stock-warning">

                                                        <FaExclamationTriangle />

                                                        Low

                                                    </span>

                                                )

                                            }

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </div>

    );

}