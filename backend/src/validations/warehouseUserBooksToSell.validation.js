/*
==========================================================
BOOK CONDITION LABEL
==========================================================
*/

export function getBookConditionLabel(condition) {

    switch (condition) {

        case "like_new":
            return "Like New";

        case "very_good":
            return "Very Good";

        case "good":
            return "Good";

        case "acceptable":
            return "Acceptable";

        case "poor":
            return "Poor";

        default:
            return condition;

    }

}

/*
==========================================================
STATUS LABEL
==========================================================
*/

export function getStatusLabel(status) {

    switch (status) {

        case "available":
            return "Disponible";

        case "unavailable":
            return "Indisponible";

        default:
            return status;

    }

}