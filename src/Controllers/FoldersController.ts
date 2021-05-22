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

router.post("/rename", async (req, res, next) => {
	try {
		const { uid, name } = req.body;

		const folder = await Folder.Rename(uid, name);

		return res.json({
			ok: true,
			status: 200,
			data: folder
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/move", async (req, res, next) => {
	try {
		const { uid, parent } = req.body;

		const folder = await Folder.Move(uid, parent);

		return res.json({
			ok: true,
			status: 200,
			data: folder
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/delete", async (req, res, next) => {
	try {
		const { uid } = req.body;

		await Folder.Delete(uid);

		return res.json({
			ok: true,
			status: 200,
			data: "success"
		});
	} catch (error) {
		return next(error);
	}
});

// router.get("/download/:uid?", async (req, res, next) => {
// 	try {
// 		const folder = await Folder.GetFolders(req.params.uid);


// 		return res.json({
// 			ok: true,
// 			status: 200,
// 			data: "success"
// 		});
// 	} catch (error) {
// 		return next(error);
// 	}
// });

export default router;