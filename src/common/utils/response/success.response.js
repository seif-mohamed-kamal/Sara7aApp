export const successResponse = ({ res, message = "DONE", status = 200, data }) => {
    return res.status(status).json({
        status,
        message,
        data
    });
};
