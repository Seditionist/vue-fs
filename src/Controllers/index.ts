import { Router } from "express";

import Legacy from "./LegacyController";
import Files from "./FilesController";
import Folders from "./FoldersController";

export const router = Router();

router.use("/", Legacy);

router.use("/files", Files);
router.use("/folders", Folders);