import "./AddressInformationCard.css";

import {

    useEffect,
    useMemo,
    useState

} from "react";

import {

    useTranslation

} from "react-i18next";

export default function AddressInformationCard({

    address,

    onSave

}) {

    const { t } = useTranslation();

    const [formData, setFormData] = useState({

        recipient_name: "",

        phone: "",

        country: "",

        city: "",

        region: "",

        district: "",

        street: "",

        building: "",

        apartment: "",

        postal_code: "",

        latitude: "",

        longitude: "",

        location_source: "manual"

    });

    const hasAddress = useMemo(() => !!address, [address]);

    useEffect(() => {

        if (!hasAddress) return;

        setFormData({

            recipient_name: address.recipient_name || "",

            phone: address.phone || "",

            country: address.country || "",

            city: address.city || "",

            region: address.region || "",

            district: address.district || "",

            street: address.street || "",

            building: address.building || "",

            apartment: address.apartment || "",

            postal_code: address.postal_code || "",

            latitude: address.latitude ? String(address.latitude) : "",

            longitude: address.longitude ? String(address.longitude) : "",

            location_source: address.location_source || "manual"

        });

    }, [address, hasAddress]);

    function handleChange(event) {

        const {

            name,

            value

        } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    }

    // On envoie tous les champs de l'adresse, y compris latitude/longitude/location_source
    // pour que le backend puisse les persister dans user_addresses.
    function sanitizeForBackend(data) {

        return {

            label: "Maison",

            recipient_name: data.recipient_name,

            phone: data.phone,

            country: data.country,

            region: data.region,

            city: data.city,

            district: data.district,

            street: data.street,

            building: data.building,

            apartment: data.apartment,

            postal_code: data.postal_code,

            latitude: data.latitude !== "" && data.latitude != null ? data.latitude : null,

            longitude: data.longitude !== "" && data.longitude != null ? data.longitude : null,

            location_source: data.location_source || "manual"

        };

    }




    async function handleUseGPS() {

        if (!navigator.geolocation) {

            alert("GPS n'est pas supporté par ce navigateur.");

            return;

        }

        navigator.geolocation.getCurrentPosition(

            async (pos) => {

                const lat = pos.coords.latitude;

                const lng = pos.coords.longitude;


                // OpenStreetMap Nominatim reverse geocoding

                // Note: c'est une simple intégration front. En prod, préférer une API backend pour éviter les CORS/ratelimits.

                try {

                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

                    const resp = await fetch(url, {

                        headers: {

                            "Accept": "application/json"

                        }

                    });

                    const data = await resp.json();

                    const a = data?.address || {};

                    setFormData((prev) => ({

                        ...prev,

                        country: a.country || prev.country,

                        region: a.state || a.region || prev.region,

                        city: a.city || a.town || a.village || prev.city,

                        district: a.suburb || a.neighbourhood || prev.district,

                        street: a.road || prev.street,

                        building: a.house_number || prev.building,

                        postal_code: a.postcode || prev.postal_code,

                        latitude: String(lat),

                        longitude: String(lng),

                        location_source: "gps"

                    }));

                } catch (e) {

                    // Si reverse geocoding échoue, au moins on remplit lat/lng.

                    setFormData((prev) => ({

                        ...prev,

                        latitude: String(lat),

                        longitude: String(lng),

                        location_source: "gps"

                    }));

                }

            },

            (err) => {

                console.error(err);

                alert("Impossible d'obtenir la position GPS.");

            },

            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }

        );

    }

    function handleSubmit(event) {

        event.preventDefault();

        onSave(sanitizeForBackend(formData));

    }


    return (

        <div className="profile-card address-information-card">

            <div className="profile-card-header">

                <h2>

                    {t("address_information")}

                </h2>

                <p>

                    {t("manage_your_shipping_address")}

                </p>

            </div>

            <form

                className="profile-form"

                onSubmit={handleSubmit}

            >

                {!address ? (

                    <div style={{ padding: 16, color: "#64748B" }}>

                        {t("loading")}...

                    </div>

                ) : null}

                <div className="profile-grid">


                    <div className="profile-input-group">

                        <label>

                            {t("full_name")}

                        </label>

                        <input

                            type="text"

                            name="recipient_name"

                            value={formData.recipient_name}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("phone")}

                        </label>

                        <input

                            type="text"

                            name="phone"

                            value={formData.phone}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("country")}

                        </label>

                        <input

                            type="text"

                            name="country"

                            value={formData.country}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("region")}

                        </label>

                        <input

                            type="text"

                            name="region"

                            value={formData.region}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("city")}

                        </label>

                        <input

                            type="text"

                            name="city"

                            value={formData.city}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            {t("postal_code")}

                        </label>

                        <input

                            type="text"

                            name="postal_code"

                            value={formData.postal_code}

                            onChange={handleChange}

                        />

                    </div>

                </div>

                <div className="profile-grid">

                    <div className="profile-input-group">

                        <label>

                            Quartier / district

                        </label>

                        <input

                            type="text"

                            name="district"

                            value={formData.district}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            Rue

                        </label>

                        <input

                            type="text"

                            name="street"

                            value={formData.street}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            Bâtiment

                        </label>

                        <input

                            type="text"

                            name="building"

                            value={formData.building}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="profile-input-group">

                        <label>

                            Appartement

                        </label>

                        <input

                            type="text"

                            name="apartment"

                            value={formData.apartment}

                            onChange={handleChange}

                        />

                    </div>

                </div>

                <div className="profile-input-group" style={{ marginTop: 6 }}>

                    <button

                        type="button"

                        className="profile-save-btn"

                        onClick={handleUseGPS}

                        style={{ background: "#0EA5E9" }}

                    >

                         {t("use_my_location") || "Utiliser ma position"}

                    </button>

                    {formData.latitude && formData.longitude ? (

                        <div style={{ marginTop: 10, color: "#64748B", fontSize: ".92rem" }}>

                            Position GPS: {formData.latitude}, {formData.longitude}

                        </div>

                    ) : null}

                </div>

                <div className="profile-input-group" style={{ marginTop: 6 }}>

                    <button

                        type="submit"

                        className="profile-save-btn"

                    >

                        {t("save_changes")}

                    </button>

                </div>

            </form>

        </div>

    );

}

