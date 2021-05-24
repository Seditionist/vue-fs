import path from "path";
import { Not } from "typeorm";
import sanitize from "sanitize-filename";

import { Folder as _Folder } from "../Models/Folder";
import { File as _File } from "../Models/File";
import { IFile } from "../Types/Abstracts";
import { Generic } from "../Utilities/Generic";

export class File {

	private static async IsUnique(file: _File, folder?: number | null): Promise<boolean> {
		const exists = await _File.findOne({
			FileName: file.FileName,
			FileExtension: file.FileExtension,
			FolderID: (folder ?? null),
			id: Not(file.id)
		});
		return exists ? true : false;
	}

	public static async GetFiles(uid?: string): Promise<_File[]> {
		try {
			const folder = await _Folder.findOne({ uid });
			if (!folder) throw "folder not found";

			return await _File.find({
				where: { FolderID: folder.id },
				select: [
					"FileName",
					"FileExtension",
					"createdAt"
				]
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async GetFile(uid: string): Promise<_File> {
		try {
			const file = await _File.findOne({ uid });
			if (!file) throw "file not found";

			return file;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async InsertRoot(file: IFile): Promise<boolean> {
		try {
			const sanitized = sanitize(file.filename);
			if (file.filename != sanitized) throw "invalid filename";

			const newFile = new _File();
			newFile.FileName = file.filename;
			newFile.FileExtension = file.extension;
			newFile.FileContentType = file.contentType;
			newFile.FileContents = Generic.BufferToBase64(file.contents);

			const exists = await File.IsUnique(newFile);
			if (exists) throw "file already exists";

			await newFile.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async InsertSub(folderUID: string, file: IFile): Promise<boolean> {
		try {
			const sanitized = sanitize(file.filename);
			if (file.filename != sanitized) throw "invalid filename";

			const folder = await _Folder.findOne({ uid: folderUID });
			if (!folder) throw "folder not found";

			const newFile = new _File();
			newFile.FolderID = folder.id;
			newFile.FileName = file.filename;
			newFile.FileExtension = file.extension;
			newFile.FileContentType = file.contentType;
			newFile.FileContents = Generic.BufferToBase64(file.contents);

			const exists = await File.IsUnique(newFile, folder.id);
			if (exists) throw "file already exists";

			await newFile.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Rename(uid: string, name: string): Promise<boolean> {
		try {
			const sanitized = sanitize(name);
			if (name != sanitized) throw "invalid filename";

			const file = await _File.findOne({ uid });
			if (!file) throw "file not found";

			const ext = path.extname(name);
			file.FileName = path.basename(name, ext);

			const exists = await File.IsUnique(file, file.FolderID);
			if (exists) throw "file already exists";

			await file.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Move(uid: string, folderUID: string): Promise<boolean> {
		try {
			const file = await _File.findOne({ uid });
			if (!file) throw "file not found";

			const folder = await _Folder.findOne({ uid: folderUID });
			if (!folder) throw "folder not found";

			file.FolderID = folder.id;

			const exists = await File.IsUnique(file, file.FolderID);
			if (exists) throw "file already exists";

			await file.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Delete(uid: string): Promise<boolean> {
		try {
			const file = await _File.findOne({ uid });
			if (!file) throw "file not found";

			await file.remove();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}
}