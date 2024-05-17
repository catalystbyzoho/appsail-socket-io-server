export default class Logger {
	private className: string;

	private constructor(className: string) {
		this.className = className;
	}

	private getTimestamp(): number {
		return Date.now();
	}

	public info(...message: Array<unknown>): void {
		console.log(this.getTimestamp(), ' ::: ', this.className, ' ::: ', ...message);
	}

	public error(...message: Array<unknown>): void {
		console.error(
			this.getTimestamp(),
			' ::: ',
			this.className,
			' ::: ',
			...message
		);
	}

	public static getInstance(className: string): Logger {
		return new Logger(className);
	}
}
