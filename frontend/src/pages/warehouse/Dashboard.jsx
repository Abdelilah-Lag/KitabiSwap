import "./Dashboard.css";

import {

    useEffect,
    useState

} from "react";

import WarehouseLayout from "../../components/warehouse/WarehouseLayout";

import DashboardStats from "../../components/warehouse/Dashboard/DashboardStats";

import DashboardLatestRequests from "../../components/warehouse/Dashboard/DashboardLatestRequests";

import DashboardLowStock from "../../components/warehouse/Dashboard/DashboardLowStock";

import DashboardCharts from "../../components/warehouse/Dashboard/DashboardCharts";

import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import {

    getDashboard

} from "../../services/warehouseDashboardService";

export default function Dashboard() {

    const [loading,setLoading]=useState(true);

    const [dashboard,setDashboard]=useState(null);

    useEffect(()=>{

        loadDashboard();

    },[]);

    async function loadDashboard(){

        try{

            const response = await getDashboard();

            console.log("[WarehouseDashboard] response:", response);

            setDashboard(response);

        }

        catch(error){

            console.error(error);

        }

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return(

            <WarehouseLayout>

                <LoadingSpinner/>

            </WarehouseLayout>

        );

    }

    const statistics = dashboard?.statistics ?? {

        catalog_books: 0,

        inventory_books: 0,

        sell_requests: 0,

        validated_sales: 0

    };

    return(

        <WarehouseLayout>

            <div className="warehouse-dashboard">

                <DashboardStats

                    statistics={statistics}

                />

                <DashboardCharts

                    statistics={statistics}

                />

                <div className="warehouse-dashboard-grid">

                    <DashboardLatestRequests

                        requests={dashboard?.latest_sell_requests ?? []}

                    />

                    <DashboardLowStock

                        books={dashboard?.low_stock_books ?? []}

                    />

                </div>

            </div>

        </WarehouseLayout>

    );

}