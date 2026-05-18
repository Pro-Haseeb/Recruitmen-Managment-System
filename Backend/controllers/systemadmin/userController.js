import User from "../../models/User.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// GET SINGLE USER
export const getSingleUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// BLOCK USER
export const blockUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.isBlocked = true;
        user.blockedAt = new Date();

        await user.save();

        res.json({
            message: "User blocked successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// UNBLOCK USER
export const unblockUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.isBlocked = false;
        user.blockedAt = null;

        await user.save();

        res.json({
            message: "User unblocked successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};