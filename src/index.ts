import "dotenv/config";
import "reflect-metadata";

import { ExitHandler } from "./Utilities/ExitHandler";
import { Server } from "./Services/Server";
import { Database } from "./Services/Database";

(async (): Promise<void> => {
	ExitHandler.Setup();

	await Database.Connect();

	await Server.Setup();

	ExitHandler.Configure(async () => {
		await Database.Close();
		await Server.Close();
	});
})();