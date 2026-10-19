import { getBookDetails } from "../services/book.service.js";

export async function getBook(req, res) {

    try {

        const { type, id } = req.params;

        if (

            type !== "exchange" &&

            type !== "magazine"

        ) {

            return res.status(400).json({

                message: "Invalid book type."

            });

        }

        const book = await getBookDetails(type, id);

        if (!book) {

            return res.status(404).json({

                message: "Book not found."

            });

        }

        return res.status(200).json(book);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Internal server error."

        });

    }

}