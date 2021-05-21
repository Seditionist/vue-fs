import debug from "debug";

import { DateTime } from "../Utilities/DateTime";

export class Logger {

	private static readonly logSystem = debug("vue-fs:system");
	private static readonly logEvent = debug("vue-fs:event");
	private static readonly logError = debug("vue-fs:error");
	private static readonly logWarn = debug("vue-fs:warn");

	public static System(log: unknown): void {
		Logger.logSystem("\x1b[36m%s\x1b[0m", log, `- ${DateTime.Now()}`);
	}

	public static Event(log: unknown): void {
		Logger.logEvent(log, `- ${DateTime.Now()}`);
	}

	public static Warn(log: unknown): void {
		Logger.logWarn("\x1b[33m%s\x1b[0m", log, `- ${DateTime.Now()}`);
	}

	public static Error(log: unknown): void {
		Logger.logError("\x1b[31m%s\x1b[0m", log, `- ${DateTime.Now()}`);
	}
}