import debug from "debug";
import { ConnectionOptions, Connection, getConnection, createConnection } from "typeorm";
import { cwd } from "process";
import path from "path";

import { Config } from "../Utilities/Config";

export class Database {
	private static logSystem = debug("vue-fs:db:system");
	private static logEvent = debug("vue-fs:db:event");
	private static logError = debug("vue-fs:db:error");

	private static readonly ormconfig = {
		type: Config.Database.DB_TYPE,
		database: Config.Database.DB_NAME,
		logging: Config.Database.DB_LOGGING,
		synchronize: Config.Database.DB_SYNC,
		autoReconnect: true,
		reconnectTries: Number.MAX_VALUE,
		reconnectInterval: 2000,
		entities: [path.join(cwd(), `${Config.Options.IS_COMPILED ? "build" : "src"}/Models/**/*{.js,.ts}`)]
	} as ConnectionOptions;

	public static async Connect(): Promise<void> {

		Database.logSystem("Connecting to db...");

		let connection: Connection | undefined;
		try {
			connection = getConnection();
		} catch (e) {
			Database.logError(`error connecting to database ${e}`);
		}


		try {
			if (connection) {
				if (!connection.isConnected)
					await connection.connect();
			} else
				await createConnection(Database.ormconfig);

			Database.logSystem("successfully connected to database");
		} catch (e) {
			Database.logError(`error connecting to database ${e}`);
			throw Error(e);
		}
	}

	public static async Close(): Promise<void> {
		try {
			const connection = getConnection();
			await connection.close();
			Database.logEvent("Closed database connection.");
		} catch (error) {
			throw Error(error);
		}
	}

}