import express from "express";

import {
    getAllUsers,
    getSingleUser,
    blockUser,
    unblockUser,
} from "../../controllers/systemadmin/userController.js";

import { protect } from "../../middlewares/authMiddleware.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
    "/all",
    protect,
    authorizeRoles("system_owner", "system_owner"),
    getAllUsers
);

router.get(
    "/:id",
    protect,
    authorizeRoles("system_owner", "system_owner"),
    getSingleUser
);

router.put(
    "/block/:id",
    protect,
    authorizeRoles("system_owner", "system_owner"),
    blockUser
);

router.put(
    "/unblock/:id",
    protect,
    authorizeRoles("system_owner", "system_owner"),
    unblockUser
);

export default router;