import "./BookGallery.css";

import { useState, useEffect } from "react";

export default function BookGallery({

    cover,

    images = []

}) {

    const allImages = [

        cover,

        ...images.filter(image => image !== cover)

    ].filter(Boolean);

    const [selectedImage, setSelectedImage] = useState(

        allImages[0]

    );

    useEffect(() => {

        setSelectedImage(allImages[0]);

    }, [cover]);

    return (

        <div className="book-gallery">

            <div className="gallery-main">

                <img

                    src={selectedImage}

                    alt="Book"

                />

            </div>

            {

                allImages.length > 1 &&

                <div className="gallery-thumbnails">

                    {

                        allImages.map((image, index) => (

                            <div

                                key={index}

                                className={

                                    selectedImage === image

                                        ? "thumbnail active"

                                        : "thumbnail"

                                }

                                onClick={() =>

                                    setSelectedImage(image)

                                }

                            >

                                <img

                                    src={image}

                                    alt={`Book ${index + 1}`}

                                />

                            </div>

                        ))

                    }

                </div>

            }

        </div>

    );

}