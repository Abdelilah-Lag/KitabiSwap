import "./Profile.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import ProfileSidebar from "../../components/profile/ProfileSidebar";
import ProfileAvatarCard from "../../components/profile/ProfileAvatarCard";
import PersonalInformationCard from "../../components/profile/PersonalInformationCard";
import AddressInformationCard from "../../components/profile/AddressInformationCard";
import SecurityCard from "../../components/profile/SecurityCard";

import {
    getProfile,
    updatePersonalInformation,
    updateAddress,
    uploadAvatar,
    changePassword,
    deleteAccount
} from "../../services/profileService";


export default function Profile() {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            setLoading(true);
            const response = await getProfile();
            console.log("PROFILE =", response);
            // Backend returns: { success: true, profile: { ...userFields, address } }
            setUser(response.profile || null);
            setAddress(response.profile?.address || null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    /* ===================================== UPDATE PROFILE ===================================== */
    async function handleUpdateProfile(data) {
        try {
            await updatePersonalInformation(data);
            alert(t("profile_updated_successfully"));
            await loadProfile();
        } catch (error) {
            console.error(error);
        }
    }

    /* ===================================== UPDATE ADDRESS ===================================== */
    async function handleUpdateAddress(data) {
        try {
            await updateAddress(data);
            alert(t("address_updated_successfully"));
            await loadProfile();
        } catch (error) {
            console.error(error);
        }
    }

    /* ===================================== UPDATE AVATAR ===================================== */
    async function handleUpdateAvatar(file) {
        try {
            // ✅ FIX : c'est uploadAvatar (pas updateAvatar) — sinon ReferenceError silencieuse
            //         et loadProfile() ci-dessous n'était jamais appelé, d'où l'ancien avatar.
            const response = await uploadAvatar(file);

            // Mise à jour optimiste immédiate de l'UI avec la nouvelle URL Cloudinary
            if (response?.avatar_url) {
                setUser((prev) => (prev ? { ...prev, avatar_url: response.avatar_url } : prev));
            }

            alert(t("avatar_updated_successfully"));

            // Refetch pour être 100% sync avec la BDD
            await loadProfile();
        } catch (error) {
            console.error(error);
            alert(t("avatar_update_failed") || "Avatar update failed");
        }
    }

    /* ===================================== CHANGE PASSWORD ===================================== */
    async function handleChangePassword(data) {
        try {
            await changePassword(data);
            alert(t("password_changed_successfully"));
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <>
                <UserHeader />
                <div className="profile-loading">{t("loading")}...</div>
                <UserFooter />
            </>
        );
    }

    return (
        <>
            <UserHeader />

            <div className="profile-page">
                <div className="profile-container">

                    <div className="profile-page-header">
                        <h1>{t("my_profile")}</h1>
                        <p>{t("manage_your_account_information")}</p>
                    </div>

                    <div className="profile-layout">

                        <ProfileSidebar user={user} />

                        <div className="profile-content">

                            <ProfileAvatarCard
                                user={user}
                                onUpload={handleUpdateAvatar}
                            />

                            <PersonalInformationCard
                                user={user}
                                onSave={handleUpdateProfile}
                            />

                            <AddressInformationCard
                                address={address}
                                onSave={handleUpdateAddress}
                            />

                            <SecurityCard
                                onSave={handleChangePassword}
                            />

                        </div>

                    </div>

                </div>
            </div>

            <UserFooter />
        </>
    );
}
