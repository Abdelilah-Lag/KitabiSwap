import {

    getControllerExchangeBooksService,
    deleteControllerExchangeBookService

} from "../services/controllerBookExchange.service.js";





export async function getControllerExchangeBooksController(req,res){


    try{


        const data =
            await getControllerExchangeBooksService({

                page:req.query.page,

                limit:req.query.limit,

                search:req.query.search || ""

            });



        res.json(data);



    }
    catch(error){

        console.error(error);

        res.status(500).json({

            message:error.message

        });


    }

}







export async function deleteControllerExchangeBookController(req,res){


    try{


        const result =
            await deleteControllerExchangeBookService(

                req.params.id

            );



        res.json(result);



    }
    catch(error){


        console.error(error);


        res.status(500).json({

            message:error.message

        });


    }


}
