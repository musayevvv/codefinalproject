export const sellerOnly = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Only sellers allowed' });
    }
    next();
};

export const adminOnly = (req, res, next) => {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Admins only' });
    }
    next();
};