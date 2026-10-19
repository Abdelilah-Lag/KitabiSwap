import "./DashboardLatestRequests.css";

import {

    FaUser,
    FaBook,
    FaMoneyBillWave,
    FaCalendarAlt

} from "react-icons/fa";

export default function DashboardLatestRequests({

    requests = []

}) {

    return (

        <div className="dashboard-table-card">

            <div className="dashboard-table-header">

                <h2>

                    Latest Sell Requests

                </h2>

                <p>

                    Last books submitted by users.

                </p>

            </div>

            {

                requests.length === 0 ?

                (

                    <div className="dashboard-empty">

                        No sell requests found.

                    </div>

                )

                :

                (

                    <table className="dashboard-table">

                        <thead>

                            <tr>

                                <th>User</th>

                                <th>Book</th>

                                <th>Condition</th>

                                <th>Price</th>

                                <th>Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                requests.map((request)=>(

                                    <tr key={request.id}>

                                        <td>

                                            <div className="dashboard-user">

                                                <FaUser/>

                                                <span>

                                                    {request.users?.first_name} {request.users?.last_name}

                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="dashboard-book">

                                                <FaBook/>

                                                <span>

                                                    {request.title}

                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <span className="condition-badge">

                                                {request.book_condition}

                                            </span>

                                        </td>

                                        <td>

                                            <div className="dashboard-price">

                                                <FaMoneyBillWave/>

                                                {request.price} DH

                                            </div>

                                        </td>

                                        <td>

                                            <div className="dashboard-date">

                                                <FaCalendarAlt/>

                                                {

                                                    new Date(

                                                        request.created_at

                                                    ).toLocaleDateString()

                                                }

                                            </div>

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