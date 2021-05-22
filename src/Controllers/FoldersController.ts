import { Router } from "express";

import { Folder } from "../Repositories/FolderRepository";

const router = Router();

router.get("/getFolders/:uid?", async (req, res, next) => {
	try {
		return res.json({
			ok: true,
			status: 200,
			data: await Folder.GetFolders(req.params.uid)
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/createRoot", async (req, res, next) => {
	try {
		const { name } = req.body;

		const folder = await Folder.InsertRoot(name);

		return res.json({
			ok: true,
			status: 200,
			data: folder
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/createSub", async (req, res, next) => {
	try {
		const { name, folderUID } = req.body;

		const folder = await Folder.InsertSub(folderUID, name);

		return res.json({
			ok: true,
			status: 200,
			data: folder
		});
	} catch (error) {
		return next(error);
	}
});

// router.post("/rename", (req, res) => {
// 	return res.json({
// 		ok: true,
// 		status: 200,
// 		data: "success"
// 	});
// });

// router.post("/move", (req, res) => {
// 	return res.json({
// 		ok: true,
// 		status: 200,
// 		data: "success"
// 	});
// });

// router.post("/delete", (req, res) => {
// 	return res.json({
// 		ok: true,
// 		status: 200,
// 		data: "success"
// 	});
// });

// router.post("/download", (req, res) => {
// 	return res.json({
// 		ok: true,
// 		status: 200,
// 		data: "success"
// 	});
// });

export default router;