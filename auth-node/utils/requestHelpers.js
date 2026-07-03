export const extractUserId = (req) => {
    return req.user?.uid ||
           req.user?.id ||
           req.usuario?.uid ||
           req.usuario?.id ||
           req.cliente?.id ||
           req.cliente?._id?.toString() ||
           null;
};
