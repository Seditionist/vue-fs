import { cwd } from "process";
import debug from "debug";

const logError = debug("vue-fs:exit");

export class ExitHandler {

	public static async cleanupHandler(): Promise<void> {
		logError("No cleanup handler subscription.");
	}

	public static Setup(): void {

		process.on("uncaughtException", (err: Error) => {
			const error = (err ? err.stack || err : "").toString();
			const errorMsg = this.CleanPath(error);
			this.Terminate(1, errorMsg);
		});

		process.on("unhandledRejection", (err: Error) => {
			const errorMsg = `Uncaught Promise error: \n${this.CleanPath(err.stack as string)}`;
			this.Terminate(1, errorMsg);
		});

		process.on("SIGTERM", () => {
			const errorMsg = `Process ${process.pid} received a SIGTERM signal`;
			this.Terminate(0, errorMsg);
		});

		process.on("SIGINT", () => {
			const errorMsg = `Process ${process.pid} has been interrupted`;
			this.Terminate(0, errorMsg);
		});
	}

	public static Configure(cleanup: () => Promise<void>): void {
		this.cleanupHandler = cleanup;
	}

	public static CleanPath(message: string): string {
		if (message === undefined)
			return "";

		const root = cwd();
		const path = root.replace(/\\/g, "\\\\");
		const regex = new RegExp(`${path}\\\\`, "mg");
		return message.replace(regex, ".\\");
	}

	public static async Terminate(code: number, message: string): Promise<void> {
		// Exit function
		const exit = () => {
			process.exit(code);
		};

		logError(message);

		// exit if cleanup takes too long
		setTimeout(exit, 500).unref();

		// Attempt a graceful shutdown
		if (this.cleanupHandler != undefined) {
			await this.cleanupHandler();
		}

		exit();
	}
}
