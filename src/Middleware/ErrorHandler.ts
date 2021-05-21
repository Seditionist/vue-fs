import { Debugger } from "debug";
import { Request, Response, NextFunction, Errback } from "express";

export default class ErrorHandler {
	private static logError: Debugger;

	public static Setup(log: Debugger): void {
		this.logError = log;
	}

	public static async Middleware(err: Errback, _req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		if (!err)
			return next();

		this.logError(err);
		return res.status(500).json({
			ok: false,
			status: 500,
			data: err.toString()
		});
	}
}