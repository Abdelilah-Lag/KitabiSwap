import cloudinary from "../config/cloudinary.js";

/*
==========================================================
UPLOAD IMAGE TO CLOUDINARY
==========================================================
*/

export function uploadToCloudinary(buffer, folder) {

    return new Promise((resolve, reject) => {
        console.log("================================");
        console.log("UPLOAD TO CLOUDINARY");
        console.log("Folder :", folder);
        console.log("Is Buffer :", Buffer.isBuffer(buffer));
        console.log("Buffer Length :", buffer?.length);
        console.log("================================");

        const stream = cloudinary.uploader.upload_stream(

            {
                folder,
                resource_type: "image"
            },

            (error, result) => {

                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Cloudinary n'a retourné aucun résultat."));
                }

                return resolve({
                    url: result.secure_url,
                    public_id: result.public_id
                });

            }

        );

        stream.end(buffer);

    });

}

/*
==========================================================
DELETE IMAGE FROM CLOUDINARY
==========================================================
*/

export function deleteFromCloudinary(public_id) {

    return new Promise((resolve, reject) => {

        cloudinary.uploader.destroy(

            public_id,

            (error, result) => {

                if (error) {
                    return reject(error);
                }

                return resolve(result);

            }

        );

    });

}