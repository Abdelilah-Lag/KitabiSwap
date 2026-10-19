import { Link, useNavigate } from "react-router-dom";

import "./DeliveryHeader.css";

export default function DeliveryHeader() {

    const navigate = useNavigate();

    const user = JSON.parse(

        localStorage.getItem("user") || "{}"

    );

    function logout() {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    }

    return (

        <header className="delivery-header">

            <div className="delivery-header-left">

                <Link
                    to="/delivery"
                    className="delivery-logo"
                >

                    <img
                        src="/src/images/Logo_kitabiswap.png"
                        alt="KitabiSwap"
                    />

                    <div>

                        <h2>

                            KitabiSwap

                        </h2>

                        <span>

                            Espace Livreur

                        </span>

                    </div>

                </Link>

            </div>

            <div className="delivery-header-right">

                <div className="delivery-user">

                    <div className="delivery-avatar">

                        {

                            user.avatar_url

                                ? (

                                    <img

                                        src={user.avatar_url}

                                        alt="avatar"

                                    />

                                )

                                : (

                                    <span>

                                        {

                                            user.first_name

                                                ?.charAt(0)

                                                ?.toUpperCase() ||

                                            "L"

                                        }

                                    </span>

                                )

                        }

                    </div>

                    <div>

                        <h4>

                            {

                                user.first_name

                            } {

                                user.last_name

                            }

                        </h4>

                        <small>

                            Livreur

                        </small>

                    </div>

                </div>

                <button

                    className="delivery-logout-btn"

                    onClick={logout}

                >

                    Déconnexion

                </button>

            </div>

        </header>

    );

}