import axios from 'axios';
import RequestMethodEnum from '../enums/RequestMethodEnum';

export default class ServiceConnectionHandler {
	private url: string | undefined;
	private method: RequestMethodEnum | undefined;
	private params: Record<string, string> | undefined;
	private headers: Record<string, string> | undefined;

	public setUrl(url: string | undefined): void {
		this.url = url;
	}

	public setMethod(method: RequestMethodEnum): void {
		this.method = method;
	}

	public setHeaders(headers: Record<string, string>): void {
		this.headers = headers;
	}

	public setParams(params: Record<string, string>): void {
		this.params = params;
	}

	public async handle(): Promise<any> {
		return axios({
			url: this.url,
			params: this.params,
			method: this.method,
			headers: this.headers
		}).then((response) => response.data);
	}
}
