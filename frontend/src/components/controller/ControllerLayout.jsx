import "./ControllerLayout.css";

import ControllerHeader from "./ControllerHeader";
import ControllerSidebar from "./ControllerSidebar";
import ControllerFooter from "./ControllerFooter";

export default function ControllerLayout({
    children
}) {
    return (
        <div className="controller-layout">
            <ControllerHeader />

            <div className="controller-body">
                <ControllerSidebar />

                <main className="controller-content">
                    {children}
                </main>
            </div>

            <ControllerFooter />
        </div>
    );
}

