import prisma from "../config/prisma.js";

import cloudinary from "../config/cloudinary.js";

import {

    serializeBigInt

} from "../utils/serializeBigInt.js";

/*
==========================================================
GET PAYMENT METHODS
==========================================================
*/

export async function getPaymentMethodsService() {

    const paymentMethods =
        await prisma.payment_methods.findMany({

            orderBy: [

                {

                    display_order: "asc"

                },

                {

                    id: "asc"

                }

            ]

        });

    const data =
        paymentMethods.map((method) => ({

            id: method.id,

            name: method.name,

            type: method.type,

            account_name:
                method.account_name,

            bank_name:
                method.bank_name,

            rib:
                method.rib,

            iban:
                method.iban,

            swift_code:
                method.swift_code,

            account_number:
                method.account_number,

            payment_url:
                method.payment_url,

            qr_code_image_url:
                method.qr_code_image_url,

            qr_code_public_id:
                method.qr_code_public_id,

            instructions:
                method.instructions,

            display_order:
                method.display_order,

            is_active:
                method.is_active,

            created_at:
                method.created_at,

            updated_at:
                method.updated_at

        }));

    return serializeBigInt(data);

}
/*
==========================================================
CREATE PAYMENT METHOD
==========================================================
*/

export async function createPaymentMethodService(

    body,

    file

) {


    const {

        name,

        type,

        account_name,

        bank_name,

        rib,

        iban,

        swift_code,

        account_number,

        payment_url,

        instructions,

        display_order,

        is_active


    } = body;



    /*
    ======================================================
    VALIDATION
    ======================================================
    */


    if (!name || !type) {

        throw new Error(

            "Le nom et le type de paiement sont obligatoires."

        );

    }



    let qr_code_image_url = null;

    let qr_code_public_id = null;



    /*
    ======================================================
    CLOUDINARY UPLOAD QR CODE
    ======================================================
    */


    if (file) {


        const uploadResult =

            await new Promise(

                (resolve, reject) => {


                    const stream =

                        cloudinary.uploader.upload_stream(

                            {

                                folder:

                                    "kitabiswap/payment_methodes/",


                                resource_type:

                                    "image"


                            },


                            (error, result) => {


                                if (error) {


                                    reject(error);


                                }

                                else {


                                    resolve(result);


                                }


                            }

                        );


                    stream.end(file.buffer);


                }

            );



        qr_code_image_url =

            uploadResult.secure_url;



        qr_code_public_id =

            uploadResult.public_id;



    }



    /*
    ======================================================
    CREATE DATABASE
    ======================================================
    */


    const paymentMethod =

        await prisma.payment_methods.create({

            data: {


                name,


                type,


                account_name:

                    account_name || null,


                bank_name:

                    bank_name || null,


                rib:

                    rib || null,


                iban:

                    iban || null,


                swift_code:

                    swift_code || null,


                account_number:

                    account_number || null,


                payment_url:

                    payment_url || null,


                qr_code_image_url,


                qr_code_public_id,


                instructions:

                    instructions || null,


                display_order:

                    display_order

                        ? Number(display_order)

                        : 0,


                is_active:

                    is_active !== undefined

                        ? Boolean(is_active)

                        : true


            }


        });



    return serializeBigInt({

        message:

            "Méthode de paiement créée avec succès.",


        paymentMethod


    });


}
/*
==========================================================
UPDATE PAYMENT METHOD
==========================================================
*/

export async function updatePaymentMethodService(

    id,

    body,

    file

) {


    const paymentMethodId =

        Number(id);



    /*
    ======================================================
    CHECK EXISTING PAYMENT METHOD
    ======================================================
    */


    const existingMethod =

        await prisma.payment_methods.findUnique({

            where: {

                id: paymentMethodId

            }

        });



    if (!existingMethod) {


        throw new Error(

            "Méthode de paiement introuvable."

        );


    }



    const {

        name,

        type,

        account_name,

        bank_name,

        rib,

        iban,

        swift_code,

        account_number,

        payment_url,

        instructions,

        display_order,

        is_active


    } = body;



    let qr_code_image_url =

        existingMethod.qr_code_image_url;



    let qr_code_public_id =

        existingMethod.qr_code_public_id;



    /*
    ======================================================
    REPLACE QR CODE
    ======================================================
    */


    if (file) {


        /*
        ----------------------------------------------
        DELETE OLD CLOUDINARY IMAGE
        ----------------------------------------------
        */


        if (existingMethod.qr_code_public_id) {


            await cloudinary.uploader.destroy(

                existingMethod.qr_code_public_id

            );


        }



        /*
        ----------------------------------------------
        UPLOAD NEW QR CODE
        ----------------------------------------------
        */


        const uploadResult =

            await new Promise(

                (resolve, reject) => {


                    const stream =

                        cloudinary.uploader.upload_stream(

                            {

                                folder:

                                    "kitabiswap/payment_methodes/",


                                resource_type:

                                    "image"


                            },


                            (error, result) => {


                                if (error) {


                                    reject(error);


                                }

                                else {


                                    resolve(result);


                                }


                            }


                        );



                    stream.end(file.buffer);



                }


            );



        qr_code_image_url =

            uploadResult.secure_url;



        qr_code_public_id =

            uploadResult.public_id;



    }



    /*
    ======================================================
    UPDATE DATABASE
    ======================================================
    */


    const updatedMethod =

        await prisma.payment_methods.update({

            where: {


                id: paymentMethodId


            },


            data: {


                name:

                    name || existingMethod.name,


                type:

                    type || existingMethod.type,


                account_name:

                    account_name !== undefined

                        ? account_name

                        : existingMethod.account_name,


                bank_name:

                    bank_name !== undefined

                        ? bank_name

                        : existingMethod.bank_name,


                rib:

                    rib !== undefined

                        ? rib

                        : existingMethod.rib,


                iban:

                    iban !== undefined

                        ? iban

                        : existingMethod.iban,


                swift_code:

                    swift_code !== undefined

                        ? swift_code

                        : existingMethod.swift_code,


                account_number:

                    account_number !== undefined

                        ? account_number

                        : existingMethod.account_number,


                payment_url:

                    payment_url !== undefined

                        ? payment_url

                        : existingMethod.payment_url,


                qr_code_image_url,


                qr_code_public_id,



                instructions:

                    instructions !== undefined

                        ? instructions

                        : existingMethod.instructions,



                display_order:

                    display_order !== undefined

                        ? Number(display_order)

                        : existingMethod.display_order,



                is_active:

                    is_active !== undefined

                        ? Boolean(is_active)

                        : existingMethod.is_active


            }


        });



    return serializeBigInt({

        message:

            "Méthode de paiement modifiée avec succès.",


        paymentMethod:

            updatedMethod


    });


}
/*
==========================================================
DELETE PAYMENT METHOD
==========================================================
*/

export async function deletePaymentMethodService(

    id

) {


    const paymentMethodId =

        Number(id);



    /*
    ======================================================
    CHECK EXISTING PAYMENT METHOD
    ======================================================
    */


    const existingMethod =

        await prisma.payment_methods.findUnique({

            where: {

                id: paymentMethodId

            }

        });



    if (!existingMethod) {


        throw new Error(

            "Méthode de paiement introuvable."

        );


    }



    /*
    ======================================================
    DELETE CLOUDINARY QR CODE
    ======================================================
    */


    if (existingMethod.qr_code_public_id) {


        await cloudinary.uploader.destroy(

            existingMethod.qr_code_public_id

        );


    }



    /*
    ======================================================
    DELETE DATABASE RECORD
    ======================================================
    */


    const deletedMethod =

        await prisma.payment_methods.delete({

            where: {

                id: paymentMethodId

            }

        });



    return serializeBigInt({

        message:

            "Méthode de paiement supprimée avec succès.",


        paymentMethod:

            deletedMethod


    });


}