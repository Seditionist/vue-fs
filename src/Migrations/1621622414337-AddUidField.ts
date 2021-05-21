import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUidField1621622414337 implements MigrationInterface {
    name = 'AddUidField1621622414337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderName" nvarchar(50) NOT NULL, "ParentFolderID" integer, "parentFolderIDId" integer, "uid" varchar NOT NULL, CONSTRAINT "UQ_0950e0dabc17e998e9571c53507" UNIQUE ("uid"), CONSTRAINT "FK_1e8150819dab45cd54881f8e1bc" FOREIGN KEY ("parentFolderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Folders"("id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId") SELECT "id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId" FROM "Folders"`);
        await queryRunner.query(`DROP TABLE "Folders"`);
        await queryRunner.query(`ALTER TABLE "temporary_Folders" RENAME TO "Folders"`);
        await queryRunner.query(`CREATE TABLE "temporary_Files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FileName" nvarchar(50) NOT NULL, "FileExtension" nvarchar(50) NOT NULL, "FileContentType" nvarchar(50) NOT NULL, "FileContents" text NOT NULL, "FolderID" integer NOT NULL, "folderIDId" integer, "uid" varchar NOT NULL, CONSTRAINT "UQ_aa5362c5b056793120df85267f2" UNIQUE ("uid"), CONSTRAINT "FK_74c2da0c390a37b6cbe7bfd430c" FOREIGN KEY ("folderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Files"("id", "createdAt", "FileName", "FileExtension", "FileContentType", "FileContents", "FolderID", "folderIDId") SELECT "id", "createdAt", "FileName", "FileExtension", "FileContentType", "FileContents", "FolderID", "folderIDId" FROM "Files"`);
        await queryRunner.query(`DROP TABLE "Files"`);
        await queryRunner.query(`ALTER TABLE "temporary_Files" RENAME TO "Files"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Files" RENAME TO "temporary_Files"`);
        await queryRunner.query(`CREATE TABLE "Files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FileName" nvarchar(50) NOT NULL, "FileExtension" nvarchar(50) NOT NULL, "FileContentType" nvarchar(50) NOT NULL, "FileContents" text NOT NULL, "FolderID" integer NOT NULL, "folderIDId" integer, CONSTRAINT "FK_74c2da0c390a37b6cbe7bfd430c" FOREIGN KEY ("folderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Files"("id", "createdAt", "FileName", "FileExtension", "FileContentType", "FileContents", "FolderID", "folderIDId") SELECT "id", "createdAt", "FileName", "FileExtension", "FileContentType", "FileContents", "FolderID", "folderIDId" FROM "temporary_Files"`);
        await queryRunner.query(`DROP TABLE "temporary_Files"`);
        await queryRunner.query(`ALTER TABLE "Folders" RENAME TO "temporary_Folders"`);
        await queryRunner.query(`CREATE TABLE "Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderName" nvarchar(50) NOT NULL, "ParentFolderID" integer, "parentFolderIDId" integer, CONSTRAINT "FK_1e8150819dab45cd54881f8e1bc" FOREIGN KEY ("parentFolderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Folders"("id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId") SELECT "id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId" FROM "temporary_Folders"`);
        await queryRunner.query(`DROP TABLE "temporary_Folders"`);
    }

}
