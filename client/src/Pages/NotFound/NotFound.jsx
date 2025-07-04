import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <article className="notfound-container">
            < h1 className="notfound-code" > 404</h1 >
            <p className="notfound-message">Oops! Səhifə tapılmadı.</p>
            <button className="bg-red notfound-button" onClick={() => navigate("/")}>
                Ana səhifəyə qayıt
            </button>
        </article>
    );
};

export default NotFound;
