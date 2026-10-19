import axios from "axios";


const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");



function apiBase(){

    return API || "http://localhost:5000";

}



function authConfig(){

    return {

        headers:{

            Authorization:
            `Bearer ${localStorage.getItem("token")}`

        }

    };

}



/*
====================================================
GET BOOKS AVAILABLE FOR EXCHANGE
====================================================
*/

export async function getControllerExchangeBooks({

    page = 1,

    search = ""

}){


    const response = await axios.get(

        `${apiBase()}/api/controller/books-exchange`,

        {

            params:{

                page,

                search,

                limit:10

            },


            ...authConfig()


        }

    );


    return response.data;


}




/*
====================================================
DELETE BOOK
====================================================
*/

export async function deleteControllerExchangeBook(id){


    const response = await axios.delete(

        `${apiBase()}/api/controller/books-exchange/${id}`,

        authConfig()

    );


    return response.data;


}