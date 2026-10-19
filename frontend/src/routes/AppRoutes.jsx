import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import Explore from "../pages/Explore";
import Magazine from "../pages/Magazine";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import EmailVerification from "../pages/EmailVerification";

import ProtectedRoute from "./ProtectedRoute";

// ===============================
// Public Pages
// ===============================

import BookDetails from "../pages/BookDetails";

// ===============================
// Dashboards
// ===============================

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminCatalog from "../pages/admin/Catalog";
import AdminUserBooks from "../pages/admin/UserBooks";
import AdminInventory from "../pages/admin/Inventory";
import AdminOrders from "../pages/admin/Orders";
import AdminUserOrders from "../pages/admin/UserOrders";
import AdminExchanges from "../pages/admin/Exchanges";
import AdminDeliveries from "../pages/admin/Deliveries";
import AdminWallets from "../pages/admin/Wallets";
import AdminTransactions from "../pages/admin/Transactions";
import AdminPayments from "../pages/admin/Payments";
import AdminMessages from "../pages/admin/Messages";
import AdminStatistics from "../pages/admin/Statistics";
import AdminLogs from "../pages/admin/Logs";
import AdminSettings from "../pages/admin/Settings";
import AdminBackup from "../pages/admin/Backup";
import AdminGlobalSearch from "../pages/admin/GlobalSearch";
import UserDashboard from "../pages/user/Dashboard";
import ControllerDashboard from "../pages/controller/ControllerDashboard";
import ControllerCatalog from "../pages/controller/ControllerCatalog";
import ExchangeBookSubmissions from "../pages/controller/ExchangeBookSubmissions";
import ControllerExchangeRequests from "../pages/controller/ControllerExchangeRequests";
import ControllerBooksExchange from "../pages/controller/ControllerBooksExchange";



import WarehouseDashboard from "../pages/warehouse/Dashboard";
import Catalogue from "../pages/warehouse/Catalogue";
import AddBookCatalogue from "../pages/warehouse/AddBookCatalogue";
import Inventory from "../pages/warehouse/Inventory";
import SellBookSubmissions from "../pages/warehouse/SellBookSubmissions";
import WarehouseOrders from "../pages/warehouse/WarehouseOrders";
import WarehouseUserBooksToSell from "../pages/warehouse/WarehouseUserBooksToSell";


import PaymentDashboard from "../pages/paymentManager/PaymentDashboard";
import PaymentRechargeRequests from "../pages/paymentManager/PaymentRechargeRequests";
import PaymentMethods from "../pages/paymentManager/PaymentMethods";
import WalletTransactions from "../pages/paymentManager/WalletTransactions";
import UserWallets from "../pages/paymentManager/UserWallets";


import AddBookSubmission from "../pages/user/AddBookSubmission";



import DeliveryDashboard from "../pages/delivery/DeliveryDashboard";
import DeliveryMagazine from "../pages/delivery/DeliveryMagazine";
import DeliveryUserOrders from "../pages/delivery/DeliveryUserOrders";
import DeliveryExchange from "../pages/delivery/DeliveryExchange";
import DeliveryTracking from "../pages/delivery/DeliveryTracking";
// ===============================
// User Pages
// ===============================

import Exchange from "../pages/user/Exchange";
import ExchangeBookDetails from "../pages/user/ExchangeBookDetails";
import ExchangeRequest from "../pages/user/ExchangeRequest";
import ExchangeDeliveryChat from "../pages/user/ExchangeDeliveryChat";

import UserMagazine from "../pages/user/Magazine";
import UserBookDetails from "../pages/user/BookDetails";
import BuyBook from "../pages/user/BuyBook";
import MyBooks from "../pages/user/MyBooks";
import MyBookDetail from "../pages/user/mybook_detail";
import Wallet from "../pages/user/Wallet";
import Favorites from "../pages/user/Favorites";
import Profile from "../pages/user/Profile";
import UserCommande from "../pages/user/UserCommande";


export default function AppRoutes() {

    return (

        <Routes>

            {/* ==========================================
                PUBLIC ROUTES
            ========================================== */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/about"
                element={<About />}
            />

            <Route
                path="/about-us"
                element={<AboutUs />}
            />

            <Route
                path="/contact"
                element={<Contact />}
            />

            <Route
                path="/faq"
                element={<FAQ />}
            />

            <Route
                path="/privacy-policy"
                element={<PrivacyPolicy />}
            />

            <Route
                path="/terms"
                element={<TermsOfService />}
            />

            <Route
                path="/explore"
                element={<Explore />}
            />

            {/* Magazine public */}
            <Route
                path="/shop"
                element={<Magazine />}
            />

            {/* Détail livre public */}
            <Route
                path="/book/:type/:id"
                element={<BookDetails />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/verify-email"
                element={<EmailVerification />}
            />

            {/* ==========================================
                ADMIN
            ========================================== */}

            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/catalog" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCatalog /></ProtectedRoute>} />
            <Route path="/admin/user-books" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUserBooks /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute allowedRoles={["admin"]}><AdminInventory /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/user-orders" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUserOrders /></ProtectedRoute>} />
            <Route path="/admin/exchanges" element={<ProtectedRoute allowedRoles={["admin"]}><AdminExchanges /></ProtectedRoute>} />
            <Route path="/admin/deliveries" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDeliveries /></ProtectedRoute>} />
            <Route path="/admin/wallets" element={<ProtectedRoute allowedRoles={["admin"]}><AdminWallets /></ProtectedRoute>} />
            <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTransactions /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPayments /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={["admin"]}><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/statistics" element={<ProtectedRoute allowedRoles={["admin"]}><AdminStatistics /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLogs /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/backup" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBackup /></ProtectedRoute>} />
            <Route path="/admin/search" element={<ProtectedRoute allowedRoles={["admin"]}><AdminGlobalSearch /></ProtectedRoute>} />

            {/* ==========================================
                USER
            ========================================== */}

            <Route
                path="/user"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/exchange"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <Exchange />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/exchange/book/:id"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <ExchangeBookDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/exchange/request/:id"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <ExchangeRequest />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/exchange/chat-delivery/:exchangeRequestId"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <ExchangeDeliveryChat />
                    </ProtectedRoute>
                }
            />

            {/* ==========================================
                USER MAGAZINE (Protégé)
            ========================================== */}

            <Route
                path="/user/magazine"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserMagazine />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/magazine/book/:type/:id"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserBookDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user/magazine/checkout/:type/:id"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                         <BuyBook />
                    </ProtectedRoute>
            }
            />
            {/* ==========================================
                     BOOK SUBMISSION
                ========================================== */}

            <Route
                path="/user/book-submission/add"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <AddBookSubmission />
                    </ProtectedRoute>
             }
            />
             {/* ==========================================
                    User MY BOOK
                ========================================== */}
            <Route
                 path="/user/my-books"
                 element={
                    <ProtectedRoute roles={["user"]}>
                         <MyBooks />
                    </ProtectedRoute>
            }
            />

            <Route
                path="/user/my-book/:type/:id"
                element={
                    <ProtectedRoute roles={["user"]}>
                        <MyBookDetail />
                    </ProtectedRoute>
                }
            />
             {/* ==========================================
                    User wallet
                ========================================== */}
            <Route
                path="/user/wallet"
                 element={
                     <ProtectedRoute roles={["user"]}>
                         <Wallet />
                     </ProtectedRoute>
                }
            />
            {/* ==========================================
                    User profile
                ========================================== */}
            <Route
                path="/user/profile"
                 element={
                     <ProtectedRoute roles={["user"]}>
                         <Profile />
                     </ProtectedRoute>
                }
            />
            {/* ==========================================
                    User favorites
                ========================================== */}
            <Route
                path="/user/favorites"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <Favorites />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user/commande"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserCommande />
                    </ProtectedRoute>
                }
            />

            {/* ==========================================
                CONTROLLER
            ========================================== */}

            <Route
                path="/controller"
                element={
                    <ProtectedRoute allowedRoles={["controller"]}>
                        <ControllerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/controller/catalog"
                element={
                    <ProtectedRoute allowedRoles={["controller"]}>
                        <ControllerCatalog />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/controller/book-submissions"
                element={
                    <ProtectedRoute allowedRoles={["controller"]}>
                        <ExchangeBookSubmissions />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/controller/exchange-requests"
                element={
                    <ProtectedRoute allowedRoles={["controller"]}>
                        <ControllerExchangeRequests />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/controller/exchange-books"
                element={
                    <ProtectedRoute allowedRoles={["controller"]}>
                        <ControllerBooksExchange />
                    </ProtectedRoute>
                }
            />

            {/* ==========================================
                WAREHOUSE
            ========================================== */}


            <Route
                path="/warehouse"
                element={
                    <ProtectedRoute allowedRoles={["warehouse_manager"]}>
                        <WarehouseDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/warehouse/catalog"
                element={
                    <ProtectedRoute allowedRoles={["warehouse_manager"]}>
                        <Catalogue />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/warehouse/catalog/add"
                element={
                    <ProtectedRoute allowedRoles={["warehouse_manager"]}>
                        <AddBookCatalogue />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/warehouse/inventory"
                element={
                    <ProtectedRoute allowedRoles={["warehouse_manager"]}>
                        <Inventory />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/warehouse/sell-submissions"
                element={
                    <ProtectedRoute allowedRoles={["warehouse_manager"]}>
                        <SellBookSubmissions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/warehouse/user-books-to-sell"
                element={
                    <ProtectedRoute allowedRoles={["warehouse_manager"]}>
                        <WarehouseUserBooksToSell />
                    </ProtectedRoute>
                }
            />
               {/* =========================
                WAREHOUSE MANAGER
            ========================= */}
            <Route
                path="/warehouse/sales"
                element={
                    <ProtectedRoute allowedRoles={["warehouse_manager"]}>
                        <WarehouseOrders />
                    </ProtectedRoute>
                }
            />
            {/* ==========================================
                PAYMENT MANAGER
            ========================================== */}




            <Route
                path="/payment"
                element={
                    <ProtectedRoute roles={["payment_manager"]}>
                         <PaymentDashboard />
                    </ProtectedRoute>
                    }
            />
            <Route
                path="/payment/recharge-requests"
                element={
                    <ProtectedRoute roles={["payment_manager"]}>
                        <PaymentRechargeRequests />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payment/payment-methods"
                element={
                    <ProtectedRoute roles={["payment_manager"]}>
                        <PaymentMethods />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payment/transactions"
                element={
                    <ProtectedRoute roles={["payment_manager"]}>
                        <WalletTransactions />
                    </ProtectedRoute >
                }
            />
            <Route
                path="/payment/user-wallets"
                element={
                <ProtectedRoute roles={["payment_manager"]}>
                    <UserWallets />
                </ProtectedRoute>
            }
            />

            {/* ==========================================
                DELIVERY
            ========================================== */}

            <Route
                path="/delivery"
                element={
                    <ProtectedRoute allowedRoles={["delivery"]}>
                        <DeliveryDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/delivery/magazine-orders"
                element={
                    <ProtectedRoute allowedRoles={["delivery"]}>
                        <DeliveryMagazine />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/delivery/user-orders"
                element={
                    <ProtectedRoute allowedRoles={["delivery"]}>
                        <DeliveryUserOrders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/delivery/exchanges"
                element={
                    <ProtectedRoute allowedRoles={["delivery"]}>
                        <DeliveryExchange />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/delivery/my-deliveries"
                element={
                    <ProtectedRoute allowedRoles={["delivery"]}>
                        <DeliveryTracking />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}