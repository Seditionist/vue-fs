import { Folder as _Folder } from "../Models/Folder";
import { File as _File } from "../Models/File";
import { IFile } from "../Types/Abstracts";
import { Generic } from "../Utilities/Generic";

export class File {

	public static async Insert(folderUID: string, file: IFile): Promise<_File> {
		const folder = await _Folder.findOne({ uid: folderUID });
		if (!folder) throw "folder not found";

		const newFile = new _File();
		newFile.FolderID = folder.id;
		newFile.FileName = file.filename;
		newFile.FileExtension = file.extension;
		newFile.FileContentType = file.contentType;
		newFile.FileContents = Generic.BufferToBase64(file.contents);

		return await newFile.save();
	}
}