import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

function apiBase() {

    if (API) return API;

    return "http://localhost:5000";

}

/*
==========================================================
AUTH HEADER
==========================================================
*/

function getConfig(isMultipart = false) {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`,

            ...(isMultipart
                ? {
                    "Content-Type": "multipart/form-data"
                }
                : {})

        }

    };

}

/*
==========================================================
GET PROFILE
==========================================================
*/

export async function getProfile() {

    const response = await axios.get(

        `${apiBase()}/api/profile`,

        getConfig()

    );

    return response.data;

}

/*
==========================================================
UPDATE PERSONAL INFORMATION
==========================================================
*/

export async function updatePersonalInformation(data) {

    const response = await axios.put(

        `${apiBase()}/api/profile/personal`,

        data,

        getConfig()

    );

    return response.data;

}

/*
==========================================================
UPDATE ADDRESS
==========================================================
*/

export async function updateAddress(data) {

    const response = await axios.put(

        `${apiBase()}/api/profile/address`,

        data,

        getConfig()

    );

    return response.data;

}

/*
==========================================================
UPLOAD AVATAR
==========================================================
*/

export async function uploadAvatar(file) {

    const formData = new FormData();

    formData.append(

        "avatar",

        file

    );

    const response = await axios.post(

        `${apiBase()}/api/profile/avatar`,

        formData,

        getConfig(true)

    );

    return response.data;

}

/*
==========================================================
CHANGE PASSWORD
==========================================================
*/

export async function changePassword({

    currentPassword,

    newPassword,

    confirmPassword

}) {

    const response = await axios.put(

        `${apiBase()}/api/profile/password`,

        {

            currentPassword,

            newPassword,

            confirmPassword

        },

        getConfig()

    );

    return response.data;

}

/*
==========================================================
DELETE ACCOUNT
==========================================================
*/

export async function deleteAccount(password) {

    const response = await axios.put(

        `${apiBase()}/api/profile/delete`,

        {

            password

        },

        getConfig()

    );

    return response.data;

}