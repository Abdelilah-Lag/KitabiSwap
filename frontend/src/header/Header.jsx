import "./Header.css";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import logo from "../images/logo_kitabiswap.png";

export default function Header(){

const {t,i18n}=useTranslation();

const changeLanguage=(e)=>{

i18n.changeLanguage(e.target.value);

};

return(

<header className="header">

<div className="header-container">

<Link
to="/"
className="logo"
>

<img
src={logo}
alt="KitabiSwap"
/>

<span>KitabiSwap</span>

</Link>

<nav className="navbar">

<Link to="/">
{t("home")}
</Link>

<Link to="/explore">
{t("explore")}
</Link>

<Link to="/shop">
{t("shop")}
</Link>

<Link to="/about">
{t("about")}
</Link>

</nav>

<div className="header-actions">

<select

className="language-select"

value={i18n.language.substring(0,2)}

onChange={changeLanguage}

>

<option value="fr">

🇫🇷 Français

</option>

<option value="en">

🇬🇧 English

</option>

</select>

<Link

to="/login"

className="login-btn"

>

{t("login")}

</Link>

<Link

to="/register"

className="register-btn"

>

{t("register")}

</Link>

</div>

</div>

</header>

);

}