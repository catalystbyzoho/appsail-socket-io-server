export default class ServiceConnectionConstants {
	public static MAX_RECORDS_PER_OPERATION = 200;
	public static Endpoints = {
		MESSAGES: '/messages',
		ROOT_PATH: '/server/message_service'
	};

	public static Headers = {
		CATALYST_CODELIB_SECRET_KEY: {
			key: 'catalyst-codelib-secret-key'
		}
	};
}
