import axios from "axios";


const API_URL =

    "http://localhost:5000/api/payment-manager/wallet-transactions";



/*
==========================================================
GET WALLET TRANSACTIONS
==========================================================
*/

export async function getWalletTransactions({

    page = 1,

    limit = 25,

    search = "",

    type = "",

    date = ""

} = {}) {



    const token = localStorage.getItem("token");



    const response = await axios.get(


        API_URL,


        {


            headers: {


                Authorization:

                    `Bearer ${token}`


            },



            params: {


                page,


                limit,


                search,


                type,


                date



            }



        }


    );



    return response.data;



}