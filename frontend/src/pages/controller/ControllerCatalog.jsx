import "./ControllerCatalog.css";

import {
    useEffect,
    useMemo,
    useState
} from "react";


import ControllerLayout from "../../components/controller/ControllerLayout";

import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";


import CatalogueSearch from "../../components/warehouse/catalogue/CatalogueSearch";
import CatalogueFilters from "../../components/warehouse/catalogue/CatalogueFilters";
import CatalogueTable from "../../components/warehouse/catalogue/CatalogueTable";
import CataloguePagination from "../../components/warehouse/catalogue/CataloguePagination";
import AddCatalogueBookModal from "../../components/warehouse/catalogue/AddCatalogueBookModal";


import {
    listCatalogue
} from "../../services/controllerCatalogService";



export default function ControllerCatalog() {


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);



    const [items, setItems] = useState([]);



    const [pagination, setPagination] = useState({

        page: 1,

        pageSize: 25,

        total: 0,

        totalPages: 0

    });



    const [filters, setFilters] = useState({

        q: "",

        category: "",

        language: "",

        audience: "",

        book_type: "",

        publisher: "",

        publication_year: "",

        is_active: "true"

    });



    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(25);



    const [isModalOpen, setIsModalOpen] = useState(false);




    const params = useMemo(() => ({

        page,

        pageSize,

        ...filters

    }), [

        page,

        pageSize,

        filters

    ]);





    async function loadCatalogue(nextParams = params) {


        try {


            setLoading(true);

            setError(null);



            const response = await listCatalogue(nextParams);



            const data = response?.data ?? [];



            const pag = response?.pagination ?? {

                page: nextParams.page,

                pageSize: nextParams.pageSize,

                total: data.length,

                totalPages: 1

            };



            setItems(data);

            setPagination(pag);



        }

        catch (e) {


            console.error(e);


            setError(

                e?.message ||

                "Erreur lors du chargement du catalogue"

            );


        }

        finally {


            setLoading(false);


        }


    }





    useEffect(() => {


        loadCatalogue();


        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [

        page,

        pageSize,

        filters

    ]);






    return (

        <ControllerLayout>


            <main className="controller-catalogue-page">



                <section className="controller-catalogue-header">


                    <div className="controller-catalogue-title">


                        <h1>

                            Catalogue

                        </h1>


                        <p>

                            Gérer les livres du catalogue :

                            recherche, filtres et pagination.

                        </p>


                    </div>




                    <button

                        className="controller-catalogue-add-btn"

                        onClick={() => setIsModalOpen(true)}

                    >

                        Ajouter un livre

                    </button>



                </section>





                <section className="controller-catalogue-tools">


                    <CatalogueSearch

                        value={filters.q}

                        onChange={(value) =>

                            setFilters((f) => ({

                                ...f,

                                q: value

                            }))

                        }

                    />




                    <CatalogueFilters

                        filters={filters}

                        onChange={(next) => setFilters(next)}

                    />


                </section>







                <section className="controller-catalogue-content">



                    {

                        loading ? (


                            <div className="controller-catalogue-loading">

                                <LoadingSpinner />

                            </div>



                        ) : error ? (


                            <div className="controller-catalogue-error">

                                {error}

                            </div>



                        ) : (


                            <>


                                <CatalogueTable

                                    items={items}

                                    onRefresh={() => loadCatalogue()}

                                />




                                <CataloguePagination


                                    page={pagination.page}


                                    totalPages={pagination.totalPages}


                                    pageSize={pageSize}



                                    onPageChange={(p) => setPage(p)}



                                    onPageSizeChange={(s) => {


                                        setPageSize(s);

                                        setPage(1);


                                    }}


                                />


                            </>


                        )

                    }



                </section>







                <AddCatalogueBookModal


                    isOpen={isModalOpen}



                    onClose={() => setIsModalOpen(false)}



                    onCreated={() => {


                        setIsModalOpen(false);


                        loadCatalogue({

                            ...params,

                            page: 1

                        });


                    }}


                />




            </main>


        </ControllerLayout>

    );


}