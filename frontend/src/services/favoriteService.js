import axios from "axios";



const API_URL = "http://localhost:5000/api/page-favorites";



/*
==========================================================
 GET USER FAVORITES
==========================================================
*/

export async function getFavorites(){

    try{

        const token = localStorage.getItem("token");


        const response = await axios.get(

            API_URL,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        return response.data;


    }catch(error){

        console.error(
            "GET FAVORITES ERROR:",
            error
        );

        throw error;

    }

}





/*
==========================================================
 ADD FAVORITE
==========================================================
*/

export async function addFavorite(bookId){


    try{


        const token = localStorage.getItem("token");



        const response = await axios.post(

            `${API_URL}/${bookId}`,

            {},

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        return response.data;



    }catch(error){


        console.error(
            "ADD FAVORITE ERROR:",
            error
        );


        throw error;


    }

}





/*
==========================================================
 REMOVE FAVORITE
==========================================================
*/

export async function removeFavorite(bookId){


    try{


        const token = localStorage.getItem("token");



        const response = await axios.delete(

            `${API_URL}/${bookId}`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        return response.data;



    }catch(error){


        console.error(
            "REMOVE FAVORITE ERROR:",
            error
        );


        throw error;


    }

}





/*
==========================================================
 CHECK FAVORITE
==========================================================
*/

export async function checkFavorite(bookId){


    try{


        const token = localStorage.getItem("token");



        const response = await axios.get(

            `${API_URL}/check/${bookId}`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        return response.data;



    }catch(error){


        console.error(
            "CHECK FAVORITE ERROR:",
            error
        );


        throw error;


    }

}