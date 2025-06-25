import { expressjwt as jwt } from 'express-jwt';

const authJwt = () => {
    const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;
    return jwt({ secret, algorithms: ['HS256'] });
};

export default authJwt;
