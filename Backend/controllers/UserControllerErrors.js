export const errorStatusCodeMessage = (res, status, message) => {
    return res.status(status).message({
        message: message,
    });
};
