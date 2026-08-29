import { refreshService } from "./refresh.service.js";
import { REFRESH_ERRORS } from "./refresh.errors.js";
import logger from '../../../logger/logger.js'

export const refreshController = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        console.log("refreshToken", refreshToken);

        if(!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        const response = await refreshService(refreshToken);

        return res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully',
            data: response,
        });
    } catch (error) {
        if(error?.message === REFRESH_ERRORS.INVALID_REFRESH_TOKEN) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
        }

        logger.error({ err: error }, 'Refresh token error');

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
};