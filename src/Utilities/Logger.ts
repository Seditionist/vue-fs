import debug from "debug";

import { DateTime } from "./DateTime";

const logSystem = debug("vue-fs:system");
const logEvent = debug("vue-fs:event");
const logError = debug("vue-fs:error");
const logWarn = debug("vue-fs:warn");

export class Logger {

	public static System(log: unknown): void {
		logSystem("\x1b[36m%s\x1b[0m", log, `- ${DateTime.Now()}`);
	}

	public static Event(log: unknown): void {
		logEvent(log, `- ${DateTime.Now()}`);
	}

	public static Warn(log: unknown): void {
		logWarn("\x1b[33m%s\x1b[0m", log, `- ${DateTime.Now()}`);
	}

	public static Error(log: unknown): void {
		logError("\x1b[31m%s\x1b[0m", log, `- ${DateTime.Now()}`);
	}
}