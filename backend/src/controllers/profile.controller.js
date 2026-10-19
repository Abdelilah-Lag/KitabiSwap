import {
    getProfileService,
    updatePersonalInformationService,
    updateAddressService,
    updateAvatarService,
    changePasswordService,
    deleteAccountService
} from "../services/profile.service.js";

/*
==========================================================
JSON SAFE (BigInt + Decimal)
==========================================================
*/
function toJsonSafe(value) {
    return JSON.parse(
        JSON.stringify(value, (_, v) => {
            if (typeof v === "bigint") return v.toString();
            if (v && typeof v === "object" && v.constructor && v.constructor.name === "Decimal") {
                return v.toString();
            }
            return v;
        })
    );
}

/*
==========================================================
GET PROFILE
==========================================================
*/
export async function getProfile(req, res) {
    try {
        const profile = await getProfileService(req.user.id);
        return res.status(200).json(toJsonSafe(profile));
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}

/*
==========================================================
UPDATE PERSONAL INFORMATION
==========================================================
*/
export async function updatePersonalInformation(req, res) {
    try {
        const result = await updatePersonalInformationService(
            req.user.id,
            req.body
        );
        return res.status(200).json(toJsonSafe(result));
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}

/*
==========================================================
UPDATE ADDRESS
==========================================================
*/
export async function updateAddress(req, res) {
    try {
        const result = await updateAddressService(req.user.id, req.body);
        return res.status(200).json(toJsonSafe(result));
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}

/*
==========================================================
UPLOAD AVATAR
==========================================================
*/
export async function uploadAvatar(req, res) {
    try {
        const result = await updateAvatarService(req.user.id, req.file);
        return res.status(200).json(toJsonSafe(result));
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}

/*
==========================================================
CHANGE PASSWORD
==========================================================
*/
export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Mot de passe actuel et nouveau mot de passe requis."
            });
        }

        const result = await changePasswordService(
            req.user.id,
            currentPassword,
            newPassword
        );

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}

/*
==========================================================
DELETE ACCOUNT
==========================================================
*/
export async function deleteAccount(req, res) {
    try {
        const result = await deleteAccountService(req.user.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}
