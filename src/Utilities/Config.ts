export class Config {

	public static Options = {
		PORT: process.env.PORT || 5000,
		NODE_ENV: process.env.NODE_ENV || "development"
	}
}