import moment from 'moment';

import Logger from '../utils/LoggerUtil';
import CommonUtil from '../utils/CommonUtil';
import MessageUtil from '../utils/MessageUtil';
import SocketIOUtil from '../utils/SocketIOUtil';
import SocketIOConstants from '../constants/SocketIOConstants';
import ServiceConnectionConstants from '../constants/MessageServiceConnectionConstants';

import { Message } from '../types';

export default class ReadMessagesJob {
	private static logger: Logger = Logger.getInstance(ReadMessagesJob.name);

	public async run(): Promise<void> {
		ReadMessagesJob.logger.info('Reading messages job has been started.');
		while (true) {
			try {
				ReadMessagesJob.logger.info(
					'Retrieving all the socket connections of the instance.'
				);
				const sockets = await SocketIOUtil.getAllSockets();

				if (sockets.length) {
					ReadMessagesJob.logger.info('Retrieving all the messages.');

					let page = 1;
					let hasMore = true;

					const messages: Array<Message> = [];

					do {
						await MessageUtil.getPagedMessages(
							page,
							ServiceConnectionConstants.MAX_RECORDS_PER_OPERATION
						).then(({ data, page }) => {
							messages.push(...data);
							hasMore = page.hasMore;
						});
						await CommonUtil.sleep(1);
					} while (hasMore);

					if (messages.length) {
						ReadMessagesJob.logger.info(
							'Retrieving all the client information.'
						);

						for (const socket of sockets) {
							const { name, created_time, last_read_message } = socket.data;
							const eventMessages = messages.filter((obj) => {
								if (last_read_message) {
									return parseInt(obj.id) > parseInt(last_read_message);
								}
								return moment(obj.created_time, 'YYYY-MM-DD HH:mm:ss').isAfter(
									created_time
								);
							});

							if (eventMessages.length) {
								ReadMessagesJob.logger.info('Sending payload to ', name);
								try {
									await socket
										.timeout(SocketIOConstants.DATA_EVENT_ACK_TIMEOUT)
										.emitWithAck(
											SocketIOConstants.DATA_EVENT_NAME,
											eventMessages
										);

									socket.data.last_read_message =
										eventMessages[eventMessages.length - 1].id;
									ReadMessagesJob.logger.info(name, ' acknowledged the event.');
								} catch (err) {
									ReadMessagesJob.logger.error(name, ' failed to acknowledge.');
								}
							}
						}
					} else {
						ReadMessagesJob.logger.info('No messages available in the server.');
					}
				} else {
					ReadMessagesJob.logger.info(
						'Retrieving all the messages skipped since there is no socket connection available in the instance.'
					);
				}
			} catch (err) {
				ReadMessagesJob.logger.error(err);
			}

			ReadMessagesJob.logger.info('Reading messages job paused for a while.');
			await CommonUtil.sleep(10);
			ReadMessagesJob.logger.info('Reading messages job has been resumed.');
		}
	}

	public static getInstance(): ReadMessagesJob {
		return new ReadMessagesJob();
	}
}
