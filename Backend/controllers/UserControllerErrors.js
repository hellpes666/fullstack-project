export const errorStatusCodeMessage = (res, status, msg) => {
    return res.status(status).json({
        message: msg,
    });
};
