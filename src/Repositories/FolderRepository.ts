import { Not } from "typeorm";

import { Folder as _Folder } from "../Models/Folder";

export class Folder {

	private static async IsUnique(folder: _Folder): Promise<boolean> {
		const exists = await _Folder.findOne({
			ParentFolderID: folder.ParentFolderID,
			FolderName: folder.FolderName,
			id: Not(folder.id)
		});
		return exists ? true : false;
	}

	public static async GetFolders(uid?: string): Promise<_Folder[]> {
		try {
			const parent = await _Folder.findOne({ uid });

			// console.log(t[0]?.subFolders);

			// return t;
			// console.log(a);
			console.log(uid);
			return await _Folder.find({
				where: { ParentFolderID: (parent?.id ?? null) },
				relations: [
					"subFolders",
				],
				select: [
					"FolderName",
					"uid"
				]
			});
		} catch (error) {
			throw new Error(error);
		}
	}


	public static async InsertRoot(name: string): Promise<boolean> {
		try {
			const newFolder = new _Folder();

			newFolder.FolderName = name;

			const exists = await Folder.IsUnique(newFolder);
			if (exists) throw "folder already exists";

			await newFolder.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async InsertSub(parentUID: string, name: string): Promise<boolean> {
		try {
			const parent = await _Folder.findOne({ uid: parentUID });
			if (!parent) throw "parent folder does not exist";

			const newFolder = new _Folder();

			newFolder.ParentFolderID = parent.id;
			newFolder.FolderName = name;

			const exists = await Folder.IsUnique(newFolder);
			if (exists) throw "folder already exists";

			await newFolder.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Rename(uid: string, name: string): Promise<boolean> {
		try {
			const folder = await _Folder.findOne({ uid });
			if (!folder) throw "folder not found";

			folder.FolderName = name;

			const exists = await Folder.IsUnique(folder);
			if (exists) throw "folder already exists";

			await folder.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Move(targetUID: string, parentUID?: string): Promise<boolean> {
		try {
			const target = await _Folder.findOne({ uid: targetUID });
			if (!target) throw "target folder not found";

			if (parentUID) {
				const parent = await _Folder.findOne({ uid: parentUID });
				if (!parent) throw "parent folder not found";

				target.ParentFolderID = parent.id;
			}
			else
				target.ParentFolderID = null;

			const exists = await Folder.IsUnique(target);
			if (exists) throw "folder already exists";

			await target.save();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Delete(uid: string): Promise<boolean> {
		try {
			const folder = await _Folder.findOne({ uid });
			if (!folder) throw "folder not found";

			await _Folder.delete(folder);

			await folder.remove();
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}
}