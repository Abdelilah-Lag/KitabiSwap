/* ==========================================================
   Validation création commande
========================================================== */

export function validateCreateCommande(req, res, next) {

    const {

        addressId,
        paymentType,
        items

    } = req.body;

    /* ==========================================
       Adresse
    ========================================== */

    if (!addressId) {

        return res.status(400).json({

            success: false,

            message: "Adresse de livraison obligatoire."

        });

    }

    /* ==========================================
       Paiement
    ========================================== */

    if (

        paymentType !== "wallet" &&
        paymentType !== "cash_on_delivery"

    ) {

        return res.status(400).json({

            success: false,

            message: "Mode de paiement invalide."

        });

    }

    /* ==========================================
       Livres
    ========================================== */

    if (

        !Array.isArray(items) ||
        items.length === 0

    ) {

        return res.status(400).json({

            success: false,

            message: "Aucun livre sélectionné."

        });

    }

    /* ==========================================
       Validation de chaque livre
    ========================================== */

    for (const item of items) {

        if (

            item.type !== "shop" &&
            item.type !== "user"

        ) {

            return res.status(400).json({

                success: false,

                message: "Type de livre invalide."

            });

        }

        if (

            item.id == null ||
            Number(item.id) <= 0

        ) {

            return res.status(400).json({

                success: false,

                message: "Livre invalide."

            });

        }

        if (

            item.quantity == null ||
            Number(item.quantity) <= 0

        ) {

            return res.status(400).json({

                success: false,

                message: "Quantité invalide."

            });

        }

    }

    next();

}