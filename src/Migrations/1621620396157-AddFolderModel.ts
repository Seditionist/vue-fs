import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFolderModel1621620396157 implements MigrationInterface {
    name = 'AddFolderModel1621620396157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderName" nvarchar(50) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_Files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FileName" nvarchar(50) NOT NULL, "FileExtension" nvarchar(50) NOT NULL, "FileContentType" nvarchar(50) NOT NULL, "FileContents" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_Files"("id", "createdAt") SELECT "id", "createdAt" FROM "Files"`);
        await queryRunner.query(`DROP TABLE "Files"`);
        await queryRunner.query(`ALTER TABLE "temporary_Files" RENAME TO "Files"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Files" RENAME TO "temporary_Files"`);
        await queryRunner.query(`CREATE TABLE "Files" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "Files"("id", "createdAt") SELECT "id", "createdAt" FROM "temporary_Files"`);
        await queryRunner.query(`DROP TABLE "temporary_Files"`);
        await queryRunner.query(`DROP TABLE "Folders"`);
    }

}
