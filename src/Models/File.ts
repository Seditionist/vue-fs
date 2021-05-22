import { Column, Entity, ManyToOne, Index } from "typeorm";

import { Base } from "./Base";
import { Folder } from "./Folder";

@Entity("Files")
@Index(["FolderID", "FileName"], { unique: true })
export class File extends Base {

	@Index()
	@ManyToOne(() => Folder)
	@Column({ type: "int", name: "FolderID", nullable: false })
	FolderID: number

	@Column({ type: "nvarchar", name: "FileName", nullable: false, length: "50" })
	FileName: string

	@Column({ type: "nvarchar", name: "FileExtension", nullable: false, length: "50" })
	FileExtension: string

	@Column({ type: "nvarchar", name: "FileContentType", nullable: false, length: "50" })
	FileContentType: string

	@Column({ type: "text", name: "FileContents", nullable: false })
	FileContents: string
}