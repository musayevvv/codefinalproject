import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";

dotenv.config();

const authJwt = () => {
    const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;
    if (!secret) {
        throw new Error("❌ JWT_SECRET tapılmadı. .env faylına bax!");
    }
    return jwt({ secret, algorithms: ["HS256"] });
};

export default authJwt;
