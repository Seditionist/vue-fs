import { Folder as _Folder } from "../Models/Folder";
import { File as _File } from "../Models/File";
import { IFile } from "../Types/Abstracts";
import { Generic } from "../Utilities/Generic";

export class File {

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

	public static async InsertRoot(file: IFile): Promise<_File> {
		try {
			const newFile = new _File();
			newFile.FileName = file.filename;
			newFile.FileExtension = file.extension;
			newFile.FileContentType = file.contentType;
			newFile.FileContents = Generic.BufferToBase64(file.contents);

			return await newFile.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async InsertSub(folderUID: string, file: IFile): Promise<_File> {
		try {
			const folder = await _Folder.findOne({ uid: folderUID });
			if (!folder) throw "folder not found";

			const newFile = new _File();
			newFile.FolderID = folder.id;
			newFile.FileName = file.filename;
			newFile.FileExtension = file.extension;
			newFile.FileContentType = file.contentType;
			newFile.FileContents = Generic.BufferToBase64(file.contents);

			return await newFile.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Rename(uid: string, name: string): Promise<_File> {
		try {
			const file = await _File.findOne({ uid });
			if (!file) throw "file not found";

			file.FileName = name;

			return await file.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Move(uid: string, folderUID: string): Promise<_File> {
		try {
			const file = await _File.findOne({ uid });
			if (!file) throw "file not found";

			const folder = await _Folder.findOne({ uid: folderUID });
			if (!folder) throw "folder not found";

			file.FolderID = folder.id;

			return await file.save();
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Delete(uid: string): Promise<void> {
		try {
			const file = await _File.findOne({ uid });
			if (!file) throw "file not found";

			await file.remove();
		} catch (error) {
			throw new Error(error);
		}
	}
}