import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1621894553408 implements MigrationInterface {
    name = 'Init1621894553408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "ParentFolderID" integer, "FolderName" nvarchar(50) NOT NULL, "parentFolderIDId" integer, CONSTRAINT "UQ_622aae39fd3df3d49ca0d0a2306" UNIQUE ("uid"))`);
        await queryRunner.query(`CREATE INDEX "IX_FolderName" ON "Folders" ("ParentFolderID") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Parent_Child" ON "Folders" ("ParentFolderID", "FolderName") `);
        await queryRunner.query(`CREATE TABLE "Files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderID" integer, "FileName" nvarchar(50) NOT NULL, "FileExtension" nvarchar(50) NOT NULL, "FileContentType" nvarchar(50) NOT NULL, "FileContents" text NOT NULL, "folderIDId" integer, CONSTRAINT "UQ_08159903c9a4c5305fb65f312b8" UNIQUE ("uid"))`);
        await queryRunner.query(`CREATE INDEX "IX_FolderID" ON "Files" ("FolderID") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Folder_File" ON "Files" ("FolderID", "FileName") `);
        await queryRunner.query(`DROP INDEX "IX_FolderName"`);
        await queryRunner.query(`DROP INDEX "IX_Parent_Child"`);
        await queryRunner.query(`CREATE TABLE "temporary_Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "ParentFolderID" integer, "FolderName" nvarchar(50) NOT NULL, "parentFolderIDId" integer, CONSTRAINT "UQ_622aae39fd3df3d49ca0d0a2306" UNIQUE ("uid"), CONSTRAINT "FK_1e8150819dab45cd54881f8e1bc" FOREIGN KEY ("parentFolderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Folders"("id", "uid", "createdAt", "ParentFolderID", "FolderName", "parentFolderIDId") SELECT "id", "uid", "createdAt", "ParentFolderID", "FolderName", "parentFolderIDId" FROM "Folders"`);
        await queryRunner.query(`DROP TABLE "Folders"`);
        await queryRunner.query(`ALTER TABLE "temporary_Folders" RENAME TO "Folders"`);
        await queryRunner.query(`CREATE INDEX "IX_FolderName" ON "Folders" ("ParentFolderID") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Parent_Child" ON "Folders" ("ParentFolderID", "FolderName") `);
        await queryRunner.query(`DROP INDEX "IX_FolderID"`);
        await queryRunner.query(`DROP INDEX "IX_Folder_File"`);
        await queryRunner.query(`CREATE TABLE "temporary_Files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderID" integer, "FileName" nvarchar(50) NOT NULL, "FileExtension" nvarchar(50) NOT NULL, "FileContentType" nvarchar(50) NOT NULL, "FileContents" text NOT NULL, "folderIDId" integer, CONSTRAINT "UQ_08159903c9a4c5305fb65f312b8" UNIQUE ("uid"), CONSTRAINT "FK_74c2da0c390a37b6cbe7bfd430c" FOREIGN KEY ("folderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Files"("id", "uid", "createdAt", "FolderID", "FileName", "FileExtension", "FileContentType", "FileContents", "folderIDId") SELECT "id", "uid", "createdAt", "FolderID", "FileName", "FileExtension", "FileContentType", "FileContents", "folderIDId" FROM "Files"`);
        await queryRunner.query(`DROP TABLE "Files"`);
        await queryRunner.query(`ALTER TABLE "temporary_Files" RENAME TO "Files"`);
        await queryRunner.query(`CREATE INDEX "IX_FolderID" ON "Files" ("FolderID") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Folder_File" ON "Files" ("FolderID", "FileName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IX_Folder_File"`);
        await queryRunner.query(`DROP INDEX "IX_FolderID"`);
        await queryRunner.query(`ALTER TABLE "Files" RENAME TO "temporary_Files"`);
        await queryRunner.query(`CREATE TABLE "Files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderID" integer, "FileName" nvarchar(50) NOT NULL, "FileExtension" nvarchar(50) NOT NULL, "FileContentType" nvarchar(50) NOT NULL, "FileContents" text NOT NULL, "folderIDId" integer, CONSTRAINT "UQ_08159903c9a4c5305fb65f312b8" UNIQUE ("uid"))`);
        await queryRunner.query(`INSERT INTO "Files"("id", "uid", "createdAt", "FolderID", "FileName", "FileExtension", "FileContentType", "FileContents", "folderIDId") SELECT "id", "uid", "createdAt", "FolderID", "FileName", "FileExtension", "FileContentType", "FileContents", "folderIDId" FROM "temporary_Files"`);
        await queryRunner.query(`DROP TABLE "temporary_Files"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Folder_File" ON "Files" ("FolderID", "FileName") `);
        await queryRunner.query(`CREATE INDEX "IX_FolderID" ON "Files" ("FolderID") `);
        await queryRunner.query(`DROP INDEX "IX_Parent_Child"`);
        await queryRunner.query(`DROP INDEX "IX_FolderName"`);
        await queryRunner.query(`ALTER TABLE "Folders" RENAME TO "temporary_Folders"`);
        await queryRunner.query(`CREATE TABLE "Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "uid" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "ParentFolderID" integer, "FolderName" nvarchar(50) NOT NULL, "parentFolderIDId" integer, CONSTRAINT "UQ_622aae39fd3df3d49ca0d0a2306" UNIQUE ("uid"))`);
        await queryRunner.query(`INSERT INTO "Folders"("id", "uid", "createdAt", "ParentFolderID", "FolderName", "parentFolderIDId") SELECT "id", "uid", "createdAt", "ParentFolderID", "FolderName", "parentFolderIDId" FROM "temporary_Folders"`);
        await queryRunner.query(`DROP TABLE "temporary_Folders"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Parent_Child" ON "Folders" ("ParentFolderID", "FolderName") `);
        await queryRunner.query(`CREATE INDEX "IX_FolderName" ON "Folders" ("ParentFolderID") `);
        await queryRunner.query(`DROP INDEX "IX_Folder_File"`);
        await queryRunner.query(`DROP INDEX "IX_FolderID"`);
        await queryRunner.query(`DROP TABLE "Files"`);
        await queryRunner.query(`DROP INDEX "IX_Parent_Child"`);
        await queryRunner.query(`DROP INDEX "IX_FolderName"`);
        await queryRunner.query(`DROP TABLE "Folders"`);
    }

}
