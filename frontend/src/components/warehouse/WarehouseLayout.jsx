import "./WarehouseLayout.css";

import WarehouseHeader from "./WarehouseHeader";
import WarehouseSidebar from "./WarehouseSidebar";
import WarehouseFooter from "./WarehouseFooter";

export default function WarehouseLayout({

    children

}) {

    return (

        <div className="warehouse-layout">

            <WarehouseHeader />

            <div className="warehouse-body">

                <WarehouseSidebar />

                <main className="warehouse-content">

                    {children}

                </main>

            </div>

            <WarehouseFooter />

        </div>

    );

}