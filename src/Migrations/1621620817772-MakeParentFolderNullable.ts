import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeParentFolderNullable1621620817772 implements MigrationInterface {
    name = 'MakeParentFolderNullable1621620817772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderName" nvarchar(50) NOT NULL, "ParentFolderID" integer NOT NULL, "parentFolderIDId" integer, CONSTRAINT "FK_1e8150819dab45cd54881f8e1bc" FOREIGN KEY ("parentFolderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Folders"("id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId") SELECT "id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId" FROM "Folders"`);
        await queryRunner.query(`DROP TABLE "Folders"`);
        await queryRunner.query(`ALTER TABLE "temporary_Folders" RENAME TO "Folders"`);
        await queryRunner.query(`CREATE TABLE "temporary_Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderName" nvarchar(50) NOT NULL, "ParentFolderID" integer, "parentFolderIDId" integer, CONSTRAINT "FK_1e8150819dab45cd54881f8e1bc" FOREIGN KEY ("parentFolderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Folders"("id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId") SELECT "id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId" FROM "Folders"`);
        await queryRunner.query(`DROP TABLE "Folders"`);
        await queryRunner.query(`ALTER TABLE "temporary_Folders" RENAME TO "Folders"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Folders" RENAME TO "temporary_Folders"`);
        await queryRunner.query(`CREATE TABLE "Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderName" nvarchar(50) NOT NULL, "ParentFolderID" integer NOT NULL, "parentFolderIDId" integer, CONSTRAINT "FK_1e8150819dab45cd54881f8e1bc" FOREIGN KEY ("parentFolderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Folders"("id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId") SELECT "id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId" FROM "temporary_Folders"`);
        await queryRunner.query(`DROP TABLE "temporary_Folders"`);
        await queryRunner.query(`ALTER TABLE "Folders" RENAME TO "temporary_Folders"`);
        await queryRunner.query(`CREATE TABLE "Folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "FolderName" nvarchar(50) NOT NULL, "ParentFolderID" integer NOT NULL, "parentFolderIDId" integer, CONSTRAINT "FK_1e8150819dab45cd54881f8e1bc" FOREIGN KEY ("parentFolderIDId") REFERENCES "Folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Folders"("id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId") SELECT "id", "createdAt", "FolderName", "ParentFolderID", "parentFolderIDId" FROM "temporary_Folders"`);
        await queryRunner.query(`DROP TABLE "temporary_Folders"`);
    }

}
