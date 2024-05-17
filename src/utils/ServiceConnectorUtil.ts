import EnvConstants from '../constants/EnvConstants';
import ServiceConnectionConstants from '../constants/MessageServiceConnectionConstants';

export default class ServiceConnectorUtil {
	public static getBaseUrl(): string {
		return (
			EnvConstants.PROJECT_DOMAIN +
			ServiceConnectionConstants.Endpoints.ROOT_PATH
		);
	}

	public static getAuthenticationHeaders(): Record<string, string> {
		return {
			[ServiceConnectionConstants.Headers.CATALYST_CODELIB_SECRET_KEY.key]:
				EnvConstants.CODELIB_SECRET_KEY
		};
	}
}
