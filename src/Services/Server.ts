import express from "express";
import debug from "debug";
import cors from "cors";
import fileUpload from "express-fileupload";
import { createHttpTerminator, HttpTerminator } from "http-terminator";

import { Config } from "../Utilities/Config";
import { router } from "../Controllers";
import ErrorHandler from "../Middleware/ErrorHandler";

export class Server {
	private static logSystem = debug("vue-fs:api:system");
	private static logEvent = debug("vue-fs:api:event");
	private static logError = debug("vue-fs:api:error");

	private static port = Config.Options.PORT;

	private static terminator: HttpTerminator;

	public static async Setup(): Promise<void> {
		this.logSystem("Starting server...");

		const app = express();

		app.use(cors());
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(fileUpload());

		app.use("/", router);

		ErrorHandler.Setup(Server.logError);

		app.use(ErrorHandler.Middleware);

		const server = app.listen(this.port, () => {
			this.logSystem(`Server running on port: ${this.port}`);
		});

		this.terminator = createHttpTerminator({
			server: server
		});
	}

	public static async Close(): Promise<void> {
		await this.terminator.terminate();
		this.logEvent("Closed server.");
	}
}
