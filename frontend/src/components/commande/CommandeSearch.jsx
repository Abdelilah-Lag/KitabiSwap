import "./CommandeSearch.css";

export default function CommandeSearch({

    value,

    onChange,

    loading = false

}) {

    return (

        <div className="commande-search">

            <input

                type="text"

                value={value}

                placeholder="Rechercher un livre par titre, auteur, ISBN..."

                onChange={(e) =>

                    onChange(e.target.value)

                }

            />

            {

                loading && (

                    <span className="commande-search-loading">

                        Recherche...

                    </span>

                )

            }

        </div>

    );

}