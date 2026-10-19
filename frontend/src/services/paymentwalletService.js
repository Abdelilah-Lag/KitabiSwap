import axios from "axios";


const API_URL =

    "http://localhost:5000/api/payment-manager/wallets";





/*
==========================================================
GET USER WALLETS
==========================================================
*/


export async function getUserWallets({


    page = 1,


    limit = 25,


    search = ""


}) {


    const token = localStorage.getItem("token");



    const response = await axios.get(


        API_URL,


        {


            headers:{


                Authorization:

                    `Bearer ${token}`


            },


            params:{


                page,


                limit,


                search


            }


        }


    );



    return response.data;



}








/*
==========================================================
CREDIT WALLET
==========================================================
*/


export async function creditWallet(


    walletId,


    data


) {



    const token = localStorage.getItem("token");




    const response = await axios.patch(



        `${API_URL}/${walletId}/credit`,



        data,



        {


            headers:{



                Authorization:

                    `Bearer ${token}`



            }



        }



    );




    return response.data;



}








/*
==========================================================
DEBIT WALLET
==========================================================
*/


export async function debitWallet(


    walletId,


    data


) {



    const token = localStorage.getItem("token");




    const response = await axios.patch(



        `${API_URL}/${walletId}/debit`,



        data,



        {


            headers:{



                Authorization:

                    `Bearer ${token}`



            }



        }



    );




    return response.data;



}