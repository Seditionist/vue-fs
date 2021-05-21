import fs from "fs";
import path from "path";
import mv from "mv";
import rimraf from "rimraf";
import archiver from "archiver";
import extract from "extract-zip";
import { Router } from "express";
import { UploadedFile } from "express-fileupload";

import { DateTime } from "../Utilities/DateTime";
import { Path } from "../Utilities/Path";
import { Logger } from "../Utilities/Logger";

export const router = Router();

let my_path: string;
let myZip2: string[];
let folder_path: string;
// const my_file1;

// Responds with the relative path of a selected directory or file
router.post("/sendPath", (req, res) => {
	my_path = req.body.sent_path;
	// my_file1 = req.body.sent_file;
	const isDir = path.dirname(my_path);
	res.send({ full_path: my_path, the_dir: isDir });
});

// Uploads files to the file directory
router.post("/upload", async (req, res) => {
	try {
		if (!req.files) throw "file not found";

		const myFile = req.files.file as UploadedFile;
		if (!myFile) throw "file not found";

		myFile.mv(`${folder_path}/${myFile.name}`, err => {
			if (err) throw new Error(err);
		});

		return res.send({ name: myFile.name, path: `/${myFile.name}` });
	} catch (error) {
		return res.status(500).send(error.toString());
	}
});

// List all sub-directories in the 'files' directory.
router.post("/getAllMainFolders", (_, res) => {
	const dirPath = "./files/";
	let result = [];
	fs.readdir(dirPath, (err, filesPath) => {
		if (err) throw err;
		result = filesPath.map((filePath) => {
			return `${dirPath}${filePath}`;
		});
		res.send(result);
	});
});

// List all files and directories from a selected directory
router.post("/getAllFilesFromSelectedFolder", (req, res) => {
	try {
		const { path_name } = req.body;
		folder_path = path_name;

		const filesPath = fs.readdirSync(path_name);

		const result = filesPath.map((filePath) => ({
			paths: `${path_name}/${filePath}`,
			names: filePath,
			the_time: DateTime.lastUpdatedDate(`${path_name}/${filePath}`),
			is_dir: Path.isDir(`${path_name}/${filePath}`),
			fileExt: path.extname(`${path_name}/${filePath}`),
		})).sort((a, b) => {
			return new Date(b.the_time).getTime() - new Date(a.the_time).getTime();
		});

		return res.send(result);
	} catch (error) {
		return res.status(500).send(error.toString());
	}
});

// Create new folder
router.post("/newFolder", (req, res) => {
	const dir = `${req.body.current_path}/${req.body.folder_name}`;
	if (!fs.existsSync(dir))
		fs.mkdirSync(dir);

	Logger.Event(`A new folder '${req.body.folder_name}' was created on ${DateTime.Now()}`);
	return res.sendStatus(200);
});

// Pass the user's selected paths for use with the zip function
router.post("/sendZips", (req, res) => {
	const myZip = req.body.sentZip;
	myZip2 = req.body.sentZip;
	res.send(myZip);
});

// Download a file
router.get("/download", (_req, res) => {
	const selectedPath = my_path;
	Logger.Event(`Download: ${my_path}`);
	const file = `${__dirname}${selectedPath.substring(1)}`;
	res.sendFile(file);
});

// View a file
router.get("/view", (_req, res) => {
	res.sendFile(my_path, { root: __dirname });
});

// Delete selected files and directories
router.post("/delete", (req, res) => {
	const thePath = req.body.sent_path as string[];

	thePath.forEach((filepath) => {
		rimraf(filepath, (err) => {
			if (err) return Logger.Error(err);

			Logger.Event("Delete successful");
		});
	});
	res.sendStatus(200);
});

// Move selected files and directories
router.post("/movefile", (req, res) => {
	const org = req.body.org_path;
	const dest = req.body.dest_path;

	for (let i = org.length - 1; i >= 0; i--) {
		const file = org[i];
		mv(file,
			`${dest}/${path.basename(file)}`,
			{ mkdirp: true, clobber: false },
			(err) => {
				if (err) throw err;
				Logger.Event("Move complete.");
			}
		);
	}
	Logger.Event(`${org} ...was moved to... ${dest}`);
	res.sendStatus(200);
});

// Zip selected files and directories
router.get("/zip", (_, res) => {
	const files = myZip2;
	const archive = archiver("zip");

	archive.on("error", (err) => {
		res.status(500).send({ error: err.message });
	});

	archive.on("end", () => {
		Logger.Event(`Zipped %d bytes ${archive.pointer()}`);
	});

	res.attachment("archive-name.zip");
	archive.pipe(res);

	files.forEach(file => {
		archive.file(file, { name: path.basename(file) });

		if (Path.isDir(file)) {
			archive.directory(file, path.basename(file));
		}
	});
	archive.finalize();
});

// Extract selected .zip file *Please note only .zip files are supported for now
router.post("/extract", async (req) => {
	const src = req.body.path_name;
	const dest = path.dirname(src);

	try {
		await extract(src, { dir: `${__dirname}/${dest}` });
		Logger.Event("Extraction complete");
	} catch (err) {
		Logger.Error(err);
	}
});
