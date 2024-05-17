import { createServer } from 'http';

import Logger from './utils/LoggerUtil';
import SocketIOUtil from './utils/SocketIOUtil';
import ReadMessagesJob from './jobs/MessageReadJob';
import EnvConstants from './constants/EnvConstants';

class AppRunner {
	private static logger: Logger = Logger.getInstance(AppRunner.name);
	public static start() {
		const server = createServer();
		SocketIOUtil.init(server);

		ReadMessagesJob.getInstance().run();

		server.listen(EnvConstants.PORT, () => {
			this.logger.info('Server started at ::: ', EnvConstants.PORT);
		});
	}
}

AppRunner.start();
