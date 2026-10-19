import "./FavoritesEmpty.css";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


export default function FavoritesEmpty() {


    const { t } = useTranslation();


    return (

        <div className="favorites-empty">


            <div className="favorites-empty-icon">

                ❤️

            </div>



            <h2>

                {t("favorites.empty_title") || "Aucun favori pour le moment"}

            </h2>



            <p>

                {
                    t("favorites.empty_description") ||
                    "Vous n'avez pas encore ajouté de livres à vos favoris. Explorez notre catalogue et trouvez vos prochains livres."
                }

            </p>



            <Link

                to="/user/explore"

                className="favorites-empty-button"

            >

                {t("favorites.explore_button") || "Explorer les livres"}

            </Link>


        </div>

    );

}