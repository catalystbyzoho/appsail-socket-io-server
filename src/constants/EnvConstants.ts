export default class EnvConstants {
	public static readonly PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT as string;
	public static PROJECT_DOMAIN = process.env.PROJECT_DOMAIN as string;
	public static CODELIB_SECRET_KEY = process.env
		.CODELIB_SECRET_KEY as string;
}
