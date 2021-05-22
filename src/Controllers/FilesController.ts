import { Router } from "express";

import { File } from "../Repositories/FileRepository";

const router = Router();

router.get("/getFiles/:uid?", async (req, res, next) => {
	try {
		return res.json({
			ok: true,
			status: 200,
			data: await File.GetFiles(req.params.uid)
		});
	} catch (error) {
		return next(error);
	}
});
router.post("/uploadRoot", async (req, res, next) => {
	try {
		return res.json({
			ok: true,
			status: 200,
			data: await File.InsertRoot(req.body.file)
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/uploadSub", async (req, res, next) => {
	try {
		const { folder, file } = req.body;

		return res.json({
			ok: true,
			status: 200,
			data: await File.InsertSub(folder, file)
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/rename", async (req, res, next) => {
	try {
		const { uid, name } = req.body;

		return res.json({
			ok: true,
			status: 200,
			data: await File.Rename(uid, name)
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/move", async (req, res, next) => {
	try {
		const { uid, folder } = req.body;

		return res.json({
			ok: true,
			status: 200,
			data: await File.Move(uid, folder)
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/delete", async (req, res, next) => {
	try {
		return res.json({
			ok: true,
			status: 200,
			data: await File.Delete(req.body.uid)
		});
	} catch (error) {
		return next(error);
	}
});

// router.get("/download/:uid?", async (_req, res, next) => {
// 	try {

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