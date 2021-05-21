import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { createHttpTerminator, HttpTerminator } from "http-terminator";

import { Logger } from "../Utilities/Logger";
import { Config } from "../Utilities/Config";
import { router } from "../Controllers";

export class Server {

	private static port = Config.Options.PORT;

	private static terminator: HttpTerminator;

	public static async Setup(): Promise<void> {
		Logger.System("Starting server...");

		const app = express();

		app.use(cors());
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(fileUpload());

		app.use("/", router);

		const server = app.listen(Server.port, () => {
			Logger.System(`Server running on port: ${Server.port}`);
		});

		Server.terminator = createHttpTerminator({
			server: server
		});
	}

	public static async Close(): Promise<void> {
		await Server.terminator.terminate();
		Logger.Event("Closed server.");
	}
}
