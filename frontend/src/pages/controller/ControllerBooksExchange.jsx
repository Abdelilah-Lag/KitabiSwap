import {
    useEffect,
    useState
} from "react";


import "./ControllerBooksExchange.css";


import ControllerLayout from "../../components/controller/ControllerLayout";


import {
    getControllerExchangeBooks,
    deleteControllerExchangeBook
} from "../../services/controllerBookExchangeService";



export default function ControllerBooksExchange() {


    const [books,setBooks] = useState([]);

    const [loading,setLoading] = useState(true);

    const [search,setSearch] = useState("");

    const [page,setPage] = useState(1);

    const [totalPages,setTotalPages] = useState(1);

    const [totalItems,setTotalItems] = useState(0);





    useEffect(()=>{

        loadBooks();

    },[page]);





    useEffect(()=>{


        const timer = setTimeout(()=>{


            setPage(1);

            loadBooks(1);


        },400);



        return ()=>clearTimeout(timer);


    },[search]);








    async function loadBooks(currentPage = page){


        try{


            setLoading(true);



            const response = await getControllerExchangeBooks({

                page:currentPage,

                search

            });





            setBooks(response.books || []);

            setPage(response.currentPage || 1);

            setTotalPages(response.totalPages || 1);

            setTotalItems(response.totalItems || 0);



        }
        catch(error){


            console.error(error);


            alert(
                "Erreur chargement livres"
            );


        }
        finally{


            setLoading(false);


        }


    }









    async function handleDelete(id){


        const confirmDelete = window.confirm(

            "Supprimer ce livre ?"

        );



        if(!confirmDelete)

            return;





        try{


            await deleteControllerExchangeBook(id);



            loadBooks();



        }
        catch(error){


            alert(

                error.response?.data?.message

                ||

                "Erreur suppression"

            );


        }


    }









    return (


        <ControllerLayout>



            <div className="controller-books-page">





                <section className="books-header">


                    <div>


                        <h1>

                            Livres proposés pour échange

                        </h1>


                        <p>

                            Gestion des livres disponibles dans user_books.

                        </p>


                    </div>




                    <div className="books-count">


                        {totalItems} livres


                    </div>



                </section>









                <section className="books-toolbar">


                    <input


                        type="text"


                        placeholder="Rechercher un livre ou utilisateur..."


                        value={search}


                        onChange={(e)=>setSearch(e.target.value)}


                    />


                </section>









                <section className="books-content">


                    {


                        loading ? (



                            <div className="loading">


                                Chargement...


                            </div>




                        ) : books.length === 0 ? (



                            <div className="empty-state">


                                Aucun livre trouvé.


                            </div>




                        ) : (



                            <div className="table-container">


                                <table>


                                    <thead>


                                        <tr>


                                            <th>

                                                Livre

                                            </th>


                                            <th>

                                                Informations

                                            </th>


                                            <th>

                                                Propriétaire

                                            </th>


                                            <th>

                                                Etat

                                            </th>


                                            <th>

                                                Date

                                            </th>


                                            <th>

                                                Actions

                                            </th>


                                        </tr>


                                    </thead>





                                    <tbody>


                                        {


                                            books.map(book=>(



                                                <tr key={book.id}>



                                                    <td>



                                                        <div className="book-cell">



                                                            <img


                                                                src={

                                                                    book.image ||

                                                                    "/book-placeholder.png"

                                                                }


                                                                alt={book.title}


                                                            />





                                                            <div>


                                                                <strong>

                                                                    {book.title}

                                                                </strong>



                                                                <span>

                                                                    {book.author}

                                                                </span>



                                                            </div>



                                                        </div>



                                                    </td>









                                                    <td>


                                                        <p>

                                                            ISBN : {book.isbn || "-"}

                                                        </p>


                                                        <p>

                                                            Langue : {book.language || "-"}

                                                        </p>


                                                        <p>

                                                            Catégorie : {book.category || "-"}

                                                        </p>


                                                    </td>









                                                    <td>



                                                        <div className="user-cell">



                                                            <img


                                                                src={

                                                                    book.owner?.avatar ||

                                                                    "/default-avatar.png"

                                                                }


                                                                alt="avatar"



                                                            />





                                                            <div>


                                                                <strong>

                                                                    {book.owner?.name}

                                                                </strong>



                                                                <span>

                                                                    {book.owner?.email}

                                                                </span>



                                                                <span>

                                                                    {book.owner?.phone}

                                                                </span>



                                                            </div>



                                                        </div>



                                                    </td>









                                                    <td>


                                                        <span className="condition">


                                                            {book.condition}


                                                        </span>



                                                    </td>









                                                    <td>


                                                        {

                                                            new Date(

                                                                book.createdAt

                                                            ).toLocaleDateString()


                                                        }



                                                    </td>









                                                    <td>


                                                        <div className="actions">


                                                            <button

                                                                className="edit-btn"

                                                            >

                                                                Modifier

                                                            </button>





                                                            <button

                                                                className="delete-btn"

                                                                onClick={()=>handleDelete(book.id)}

                                                            >

                                                                Supprimer

                                                            </button>



                                                        </div>



                                                    </td>



                                                </tr>



                                            ))


                                        }



                                    </tbody>



                                </table>



                            </div>



                        )


                    }



                </section>









                {


                    totalPages > 1 && (



                        <div className="pagination">


                            <button


                                disabled={page === 1}


                                onClick={()=>setPage(page-1)}


                            >

                                ←

                            </button>





                            <span>


                                Page {page} / {totalPages}


                            </span>





                            <button


                                disabled={page === totalPages}


                                onClick={()=>setPage(page+1)}


                            >

                                →

                            </button>



                        </div>



                    )


                }





            </div>




        </ControllerLayout>


    );


}