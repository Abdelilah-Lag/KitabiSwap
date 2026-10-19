import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import prisma from "../config/prisma.js";
import {
    uploadToCloudinary,
    deleteFromCloudinary
} from "../utils/cloudinaryUpload.js";

/*
==========================================================
GET PROFILE
==========================================================
*/

export async function getProfileService(userId) {

    const user = await prisma.users.findUnique({

        where: {
            id: BigInt(userId)
        },

        select: {

            id: true,
            uuid: true,

            first_name: true,
            last_name: true,

            email: true,
            phone: true,

            avatar_url: true,
            avatar_public_id: true,

            status: true,

            created_at: true,
            updated_at: true

        }

    });

    if (!user) {

        throw new Error("Utilisateur introuvable.");

    }

    const address = await prisma.user_addresses.findFirst({

        where: {

            user_id: BigInt(userId),

            is_active: true

        },

        orderBy: {

            is_default: "desc"

        },

        select: {

            id: true,
            uuid: true,

            label: true,

            recipient_name: true,

            phone: true,

            country: true,

            region: true,

            city: true,

            district: true,

            street: true,

            building: true,

            apartment: true,

            postal_code: true,

            latitude: true,

            longitude: true,

            is_default: true,

            created_at: true,
            updated_at: true

        }

    });

    // Stats
    const [booksCount, favoritesCount, exchangeCount, wallet] = await Promise.all([

        prisma.user_books.count({
            where: { user_id: BigInt(userId) }
        }),

        prisma.favorites.count({
            where: { user_id: BigInt(userId) }
        }),

        prisma.exchange_requests.count({
            where: {
                OR: [
                    { requester_id: BigInt(userId) },
                    { receiver_id: BigInt(userId) }
                ]
            }
        }),

        prisma.wallets.findUnique({
            where: { user_id: BigInt(userId) },
            select: { balance: true }
        })

    ]);

    return {

        success: true,

        profile: {

            ...user,

            address,

            wallet_balance: wallet?.balance ?? 0,

            books_count: booksCount,

            favorites_count: favoritesCount,

            exchange_count: exchangeCount

        }

    };


}
/*
==========================================================
UPDATE PERSONAL INFORMATION
==========================================================
*/

export async function updatePersonalInformationService(userId, data) {

    const {

        first_name,
        last_name,
        email,
        phone

    } = data;

    /*
    ==========================================
    CHECK EMAIL
    ==========================================
    */

    if (email) {

        const existingEmail = await prisma.users.findFirst({

            where: {

                email,

                NOT: {

                    id: BigInt(userId)

                }

            }

        });

        if (existingEmail) {

            throw new Error("Cette adresse email est déjà utilisée.");

        }

    }

    /*
    ==========================================
    CHECK PHONE
    ==========================================
    */

    if (phone) {

        const existingPhone = await prisma.users.findFirst({

            where: {

                phone,

                NOT: {

                    id: BigInt(userId)

                }

            }

        });

        if (existingPhone) {

            throw new Error("Ce numéro de téléphone est déjà utilisé.");

        }

    }

    /*
    ==========================================
    UPDATE USER
    ==========================================
    */

    const user = await prisma.users.update({

        where: {

            id: BigInt(userId)

        },

        data: {

            first_name,

            last_name,

            email,

            phone,

            updated_at: new Date()

        },

        select: {

            id: true,

            uuid: true,

            first_name: true,

            last_name: true,

            email: true,

            phone: true,

            avatar_url: true,

            avatar_public_id: true,

            status: true,

            created_at: true,

            updated_at: true

        }

    });

    return {

        success: true,

        message: "Informations personnelles mises à jour avec succès.",

        user

    };

}
/*
==========================================================
UPDATE ADDRESS
==========================================================
*/

export async function updateAddressService(userId, data) {

    const {

        label,
        recipient_name,
        phone,
        country,
        region,
        city,
        district,
        street,
        building,
        apartment,
        postal_code,
        latitude,
        longitude,
        location_source

    } = data;

    // Normalisation des coordonnées GPS. Prisma Decimal accepte des strings numériques.
    const latValue =
        latitude === "" || latitude === null || latitude === undefined
            ? null
            : String(latitude);
    const lngValue =
        longitude === "" || longitude === null || longitude === undefined
            ? null
            : String(longitude);
    const sourceValue = location_source || "manual";

    /*
    ==========================================
    CHECK IF ADDRESS EXISTS
    ==========================================
    */

    const address = await prisma.user_addresses.findFirst({

        where: {

            user_id: BigInt(userId),

            is_active: true

        }

    });

    /*
    ==========================================
    CREATE ADDRESS
    ==========================================
    */

    if (!address) {

        const created = await prisma.user_addresses.create({

            data: {

                uuid: randomUUID(),

                user_id: BigInt(userId),

                label: label || "Maison",

                recipient_name,

                phone,

                country: country || "Maroc",

                region,

                city,

                district,

                street,

                building,

                apartment,

                postal_code,

                latitude: latValue,

                longitude: lngValue,

                location_source: sourceValue,

                is_default: true,

                is_active: true

            }

        });

        return {

            success: true,

            message: "Adresse créée avec succès.",

            address: created

        };

    }

    /*
    ==========================================
    UPDATE ADDRESS
    ==========================================
    */

    const updated = await prisma.user_addresses.update({

        where: {

            id: address.id

        },

        data: {

            label,

            recipient_name,

            phone,

            country,

            region,

            city,

            district,

            street,

            building,

            apartment,

            postal_code,

            latitude: latValue,

            longitude: lngValue,

            location_source: sourceValue,

            updated_at: new Date()

        }

    });

    return {

        success: true,

        message: "Adresse mise à jour avec succès.",

        address: updated

    };

}

/*
==========================================================
UPDATE AVATAR
==========================================================
*/

export async function updateAvatarService(userId, file) {

    if (!file) {

        throw new Error("Aucune image sélectionnée.");

    }


    const user = await prisma.users.findUnique({

        where: {

            id: BigInt(userId)

        }

    });


    if (!user) {

        throw new Error("Utilisateur introuvable.");

    }


    /*
    ==========================================
    DELETE OLD AVATAR
    ==========================================
    */

    if (user.avatar_public_id) {

        try {

            await deleteFromCloudinary(
                user.avatar_public_id
            );


        } catch (error) {

            console.log(
                "Ancien avatar introuvable sur Cloudinary."
            );

        }

    }



    /*
    ==========================================
    UPLOAD NEW AVATAR
    ==========================================
    */

    const uploaded = await uploadToCloudinary(

        file.buffer,

        "kitabiswap/avatars"

    );
    /*
    ==========================================
    UPDATE DATABASE
    ==========================================
    */

    const updated = await prisma.users.update({

        where: {

            id: BigInt(userId)

        },


        data: {

            avatar_url: uploaded.url,

            avatar_public_id: uploaded.public_id,

            updated_at: new Date()

        },


        select: {

            avatar_url: true,

            avatar_public_id: true

        }

    });



    return {

        success: true,

        message: "Avatar mis à jour avec succès.",

        avatar: updated

    };

}

/*
==========================================================
CHANGE PASSWORD
==========================================================
*/

export async function changePasswordService(
    userId,
    currentPassword,
    newPassword
) {

    const user = await prisma.users.findUnique({

        where: {

            id: BigInt(userId)

        }

    });

    if (!user) {

        throw new Error("Utilisateur introuvable.");

    }

    const validPassword = await bcrypt.compare(

        currentPassword,

        user.password_hash

    );

    if (!validPassword) {

        throw new Error("Mot de passe actuel incorrect.");

    }

    const hashedPassword = await bcrypt.hash(

        newPassword,

        12

    );

    await prisma.users.update({

        where: {

            id: BigInt(userId)

        },

        data: {

            password_hash: hashedPassword,

            updated_at: new Date()

        }

    });

    return {

        success: true,

        message: "Mot de passe modifié avec succès."

    };

}

/*
==========================================================
DELETE ACCOUNT
==========================================================
*/

export async function deleteAccountService(userId) {

    const user = await prisma.users.findUnique({

        where: {

            id: BigInt(userId)

        }

    });

    if (!user) {

        throw new Error("Utilisateur introuvable.");

    }

    /*
    ==========================================
    DELETE CLOUDINARY AVATAR
    ==========================================
    */

    if (user.avatar_public_id) {

        try {

            await deleteFromCloudinary(

                user.avatar_public_id

            );

        } catch (error) {

            console.log("Avatar déjà supprimé.");

        }

    }

    /*
    ==========================================
    DELETE USER
    ==========================================
    */

    await prisma.users.delete({

        where: {

            id: BigInt(userId)

        }

    });

    return {

        success: true,

        message: "Votre compte a été supprimé définitivement."

    };

}
