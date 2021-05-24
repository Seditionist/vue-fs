import { Router } from "express";
import path from "path";
import { UploadedFile } from "express-fileupload";

import { File } from "../Repositories/FileRepository";
import { Generic } from "../Utilities/Generic";

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

		if (!req.files) throw "no files uploaded";
		const file = req.files.file as UploadedFile;

		if (!file) throw "file not found";

		const extension = path.extname(file.name);
		const filename = path.basename(file.name, extension);

		return res.json({
			ok: true,
			status: 200,
			data: await File.InsertRoot({
				filename,
				extension,
				contentType: file.mimetype,
				contents: file.data
			})
		});
	} catch (error) {
		return next(error);
	}
});

router.post("/uploadSub", async (req, res, next) => {
	try {
		const { folder } = req.body;
		if (!req.files) throw "no files uploaded";
		const file = req.files.file as UploadedFile;

		if (!file) throw "file not found";

		const extension = path.extname(file.name);
		const filename = path.basename(file.name, extension);

		const upload = {
			filename,
			extension,
			contentType: file.mimetype,
			contents: file.data
		} as IFile;

		return res.json({
			ok: true,
			status: 200,
			data: await File.InsertSub(folder, upload)
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

router.get("/download/:uid", async (req, res, next) => {
	try {
		const { uid } = req.params;
		if (!uid) throw "no uid specified";

		const file = await File.GetFile(uid);

		const buffer = Generic.Base64ToBuffer(file.FileContents);

		res.setHeader("Content-Disposition", `attachment; filename=${file.FileName}${file.FileExtension}`);
		res.contentType(file.FileContentType);
		return res.send(buffer);
	} catch (error) {
		return next(error);
	}
});

export default router;