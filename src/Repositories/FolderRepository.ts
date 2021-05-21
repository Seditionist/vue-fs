import { Folder as _Folder } from "../Models/Folder";

export class Folder {

	public static async InsertRoot(name: string): Promise<_Folder> {
		const newFolder = new _Folder();

		newFolder.FolderName = name;

		return await newFolder.save();
	}

	public static async InsertSub(parentUID: string, name: string): Promise<_Folder> {

		const exists = await _Folder.findOne({ uid: parentUID });
		if (!exists) throw "parent folder does not exist";

		const newFolder = new _Folder();

		newFolder.ParentFolderID = exists.id;
		newFolder.FolderName = name;

		return await newFolder.save();
	}
}