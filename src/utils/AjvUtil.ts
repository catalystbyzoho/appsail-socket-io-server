import AJV from 'ajv';
import AJVErrors from 'ajv-errors';
import AJVFormats from 'ajv-formats';
import AJVKeywords from 'ajv-keywords';

export default class AjvUtil {
	private static instance: AJV;

	private constructor() {}

	public static getInstance(): AJV {
		if (!this.instance) {
			this.instance = AJVFormats(
				AJVErrors(
					AJVKeywords(
						new AJV({
							allErrors: true,
							coerceTypes: true
						})
					)
				)
			);
		}
		return this.instance;
	}
}
