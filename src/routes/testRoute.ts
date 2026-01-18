import express from "express";
import { testController } from "../controllers/test.controller";

const router = express.Router();

router.route("/test-api").get(testController);

export default router;
