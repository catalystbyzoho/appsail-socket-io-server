import EnvConstants from '../constants/EnvConstants';

export default class AuthUtil {
	private static DEFAULT_KEY = 'CODELIB_FAKE_KEY';

	public static isValidToken(token: string): boolean {
		return (
			token !== this.DEFAULT_KEY && token === EnvConstants.CODELIB_SECRET_KEY
		);
	}
}
