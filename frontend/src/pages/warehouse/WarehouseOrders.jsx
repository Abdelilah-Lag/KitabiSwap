import "./WarehouseOrders.css";

import { useEffect, useState } from "react";

import WarehouseLayout from "../../components/warehouse/WarehouseLayout";
import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import WarehouseOrderCard from "../../components/warehouse/Sales/WarehouseOrderCard";

import {
    listWarehouseOrders,
    approveWarehouseOrder,
    rejectWarehouseOrder
} from "../../services/warehouseOrderService";


export default function WarehouseOrders() {

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState(null);

    const [orders, setOrders] = useState([]);



    async function loadOrders() {

        try {

            setLoading(true);

            setError(null);


            const response = await listWarehouseOrders();


            // Debug structure API
            console.log("loadOrders response.data =", response?.data);

            // Afficher un exemple d'objet (selon structure)
            const first =
                response?.data?.data?.[0] ??
                response?.data?.[0] ??
                null;
            console.log("loadOrders first item =", first);

            setOrders(response.data?.data || response.data || response);



        } catch (error) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                error.message ||
                "Erreur chargement commandes"
            );

        } finally {

            setLoading(false);

        }

    }



    async function handleApprove(order) {

        console.log("handleApprove", order);

        try {

            setActionLoading(true);

            await approveWarehouseOrder({
                orderId: order.id,
                source: order.source
            });

            await loadOrders();

        } catch(error){

            console.log(error);
            console.log(error.response);
            console.log(error.message);

            alert(error.message);

        } finally {

            setActionLoading(false);

        }

    }





    async function handleReject(order) {

        try {

            setActionLoading(true);

            await rejectWarehouseOrder({
                orderId: order.id,
                source: order.source
            });

            await loadOrders();

        } catch(error){

            console.error(error);
            console.log(error.response);
            console.log(error.message);

            alert(error.message);

        } finally {

            setActionLoading(false);

        }

    }




    useEffect(()=>{

        loadOrders();

    },[]);



    return (

        <WarehouseLayout>


            <div className="warehouse-orders-page">


                <div className="warehouse-orders-header">


                    <div>

                        <h1>
                            Commandes
                        </h1>


                        <p className="muted">

                            Validation des commandes avant livraison.

                        </p>

                    </div>


                    <div className="warehouse-orders-count">

                        {orders.length} commande(s)

                    </div>


                </div>



                {
                    loading ?


                    <LoadingSpinner />


                    : error ?


                    <div className="warehouse-orders-error">

                        {error}

                    </div>


                    :

                    orders.length === 0 ?


                    <div className="warehouse-orders-empty">

                        Aucune commande.

                    </div>


                    :


                    <div className="warehouse-orders-grid">


                        {
                            orders.map(order=>(

                                <WarehouseOrderCard

                                    key={order.id}

                                    order={order}


                                    onApprove={handleApprove}


                                    onRefuse={handleReject}


                                    loading={actionLoading}


                                />

                            ))
                        }


                    </div>

                }



            </div>


        </WarehouseLayout>

    );

}