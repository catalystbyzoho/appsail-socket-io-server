import ServiceConnectorUtil from './ServiceConnectorUtil';
import RequestMethodEnum from '../enums/RequestMethodEnum';
import ServiceConnectionHandler from '../handlers/ServiceConnectionHandler';
import ServiceConnectionConstants from '../constants/MessageServiceConnectionConstants';

import { Message, PageDetails } from '../types';

export default class MessageUtil {
	public static async getPagedMessages(
		page: number,
		perPage: number
	): Promise<{
		data: Array<Message>;
		page: PageDetails;
	}> {
		const handler = new ServiceConnectionHandler();
		handler.setMethod(RequestMethodEnum.GET);
		handler.setUrl(
			ServiceConnectorUtil.getBaseUrl() +
				ServiceConnectionConstants.Endpoints.MESSAGES
		);
		handler.setParams({
			page: page.toString(),
			perPage: perPage.toString()
		});
		handler.setHeaders(ServiceConnectorUtil.getAuthenticationHeaders());

		return handler.handle().then((response) => ({
			data: response.data,
			page: response.page
		}));
	}
}
