import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import homeRoutes from "./routes/home.routes.js";
import exploreRoutes from "./routes/explore.routes.js";
import magazineRoutes from "./routes/magazine.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";

import userRoutes from "./routes/user.routes.js";
import exchangeRoutes from "./routes/exchange.routes.js";
import exchangeChatRoutes from "./routes/exchangeChat.routes.js";
import magazineUserRoutes from "./routes/magazine_user.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import addBookRoutes from "./routes/add_book.routes.js";
import myBooksRoutes from "./routes/my_books.routes.js";
import myBookDetailRoutes from "./routes/mybook_detail.route.js";
import walletRoutes from "./routes/wallet.routes.js";
import pageFavoriteRoutes from "./routes/page_favorite.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import warehouseDashboardRoutes from "./routes/warehouseDashboard.routes.js";
import warehouseCatalogRoutes from "./routes/warehouseCatalog.routes.js";
import controllerCatalogRoutes from "./routes/controllerCatalog.routes.js";

import warehouseInventoryRoutes from "./routes/warehouseInventory.routes.js";
import warehouseSellSubmissionsRoutes from "./routes/warehouseSellSubmission.routes.js";
import warehouseOrderRoutes from "./routes/warehouseOrder.routes.js";
import userCommandeRoutes from "./routes/userCommande.routes.js";
import controllerDashboardRoutes from "./routes/controllerDashboard.routes.js";
import controllerExchangeSubmissionRoutes from "./routes/controllerExchangeSubmission.routes.js";
import controllerExchangeRequestRoutes from "./routes/controllerExchangeRequest.routes.js";
import controllerBookExchangeRoutes from "./routes/controllerBookExchange.routes.js";
import warehouseUserBooksToSellRoutes from "./routes/warehouseUserBooksToSell.routes.js";
import paymentDashboardRoutes from "./routes/paymentDashboard.routes.js";
import paymentRechargeRequestRoutes from "./routes/paymentRechargeRequest.routes.js";
import paymentMethodRoutes from "./routes/paymentMethod.routes.js";
import paymentTransactionRoutes from "./routes/paymentTransaction.routes.js";
import paymentWalletRoutes from "./routes/paymentWallet.routes.js"
import deliveryDashboardRoutes from "./routes/deliveryDashboard.routes.js";
import deliveryMagazinRoutes from "./routes/deliveryMagazine.routes.js";
import deliveryuserordernRoutes from "./routes/deliveryUserOrders.routes.js";
import deliveryExchangeRoutes from "./routes/deliveryExchange.routes.js";
import deliveryTrackingRoutes from "./routes/deliveryTracking.routes.js";

import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import adminUserRoutes from "./routes/adminUser.routes.js";
import adminBookRoutes from "./routes/adminBook.routes.js";
import adminOrderRoutes from "./routes/adminOrder.routes.js";
import adminWalletRoutes from "./routes/adminWallet.routes.js";
import adminGlobalRoutes from "./routes/adminGlobal.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));
app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);

/* ===============================
   ROUTE TEST
================================ */

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "KitabiSwap Backend API"

    });

});

/* ===============================
   ROUTES API
================================ */

app.use("/api/home", homeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/explore",exploreRoutes);
app.use("/api/shop",magazineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/books/catalog", catalogRoutes);


app.use("/api/user", userRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/exchange-chat",exchangeChatRoutes);
app.use("/api/magazine-user",magazineUserRoutes);
app.use("/api/page-favorites",pageFavoriteRoutes);
app.use("/api/favorites",favoriteRoutes);
app.use("/api/book-submissions",addBookRoutes);
app.use("/api/my-books", myBooksRoutes);
app.use("/api/mybook-detail", myBookDetailRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/warehouse/dashboard",warehouseDashboardRoutes);
app.use("/api/warehouse/catalogue", warehouseCatalogRoutes);
app.use("/api/controller/catalogue", controllerCatalogRoutes);
app.use("/api/warehouse/inventory", warehouseInventoryRoutes);
app.use("/api/warehouse/sell-submissions", warehouseSellSubmissionsRoutes);
app.use("/api/warehouse/orders", warehouseOrderRoutes);
app.use("/api/controller/dashboard", controllerDashboardRoutes);
app.use("/api/controller/exchange-submissions", controllerExchangeSubmissionRoutes);
app.use("/api/controller/exchange-request", controllerExchangeRequestRoutes);
app.use("/api/user/commande",userCommandeRoutes);
app.use("/api/controller/books-exchange",controllerBookExchangeRoutes);
app.use("/api/warehouse/user-books-to-sell",warehouseUserBooksToSellRoutes);
app.use("/api/payment-manager", paymentDashboardRoutes);
app.use("/api/payment-manager/recharge-requests",paymentRechargeRequestRoutes);
app.use("/api/payment-manager/payment-methods",paymentMethodRoutes);
app.use( "/api/payment-manager/wallet-transactions", paymentTransactionRoutes);
app.use("/api/payment-manager/wallets",paymentWalletRoutes);
app.use("/api/delivery",deliveryDashboardRoutes);
app.use("/api/delivery-magazine",deliveryMagazinRoutes);
app.use("/api/delivery-user-orders",deliveryuserordernRoutes);
app.use("/api/delivery-exchange",deliveryExchangeRoutes);
app.use("/api/delivery-tracking",deliveryTrackingRoutes);

// ===============================
// ADMIN ROUTES
// ===============================

app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/books", adminBookRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/wallets", adminWalletRoutes);
app.use("/api/admin", adminGlobalRoutes);

export default app