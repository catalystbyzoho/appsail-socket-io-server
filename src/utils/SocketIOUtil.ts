import http from 'http';
import { JSONSchemaType } from 'ajv';
import { RemoteSocket, Server, Socket } from 'socket.io';

import AjvUtil from './AjvUtil';
import Logger from './LoggerUtil';
import AuthUtil from './AuthUtil';
import SocketIOConstants from '../constants/SocketIOConstants';

import { SocketData } from '../types';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export default class SocketIOUtil {
	private static server: Server;
	private static logger: Logger = Logger.getInstance(SocketIOUtil.name);

	public static async getAllSockets(): Promise<
		Array<RemoteSocket<DefaultEventsMap, SocketData>>
	> {
		return SocketIOUtil.server
			.fetchSockets()
			.then((sockets) => sockets.map((socket) => socket));
	}

	private static async registerClient(
		socket: Socket<
			DefaultEventsMap,
			DefaultEventsMap,
			DefaultEventsMap,
			SocketData
		>
	): Promise<void> {
		try {
			this.logger.info('New client connection detected so registering it.');

			const name = socket.handshake.query.name as string;

			let last_read_message = '';

			if (socket.handshake.query.last_read_message) {
				last_read_message = socket.handshake.query.last_read_message as string;
			}

			socket.data = {
				name,
				last_read_message,
				created_time: Date.now()
			};

			socket.on('disconnect', async () => {
				try {
					this.logger.info('Client disconnection detected. ');
				} catch (err) {
					this.logger.error(err);
				}
			});
		} catch (err) {
			this.logger.error(err);
		}
	}

	public static init(server: http.Server): void {
		this.logger.info('Initializing SocketIO');
		if (!this.server) {
			this.server = new Server(server, {
				path: SocketIOConstants.PATH,
				pingTimeout: SocketIOConstants.PING_TIMEOUT,
				pingInterval: SocketIOConstants.PING_INTERVAL,
				transports: ['polling'],
				allowUpgrades: false
			});

			this.server.use(async (socket, next) => {
				try {
					const token = socket.handshake.auth.token;
					const name = socket.handshake.query.name as string;
					const last_read_message = socket.handshake.query
						.last_read_message as string;

					if (!AuthUtil.isValidToken(token)) {
						throw new Error(
							"You don't have permission to perform this opertaion. Kindly contact your administrator for more details."
						);
					}

					const schema: JSONSchemaType<{
						name: string;
						last_read_message: number;
					}> = {
						type: 'object',
						properties: {
							name: {
								type: 'string',
								minLength: 1,
								pattern: '^[a-zA-Z0-9]*$',
								errorMessage: {
									minLength: 'name cannot be empty.',
									pattern:
										'Invalid value for name. name should be alphanumeric.'
								}
							},
							last_read_message: {
								type: 'number',
								minimum: 1,
								errorMessage: {
									type: 'Invalid value for last_read_message. last_read_message should be a number.',
									minimum:
										'Invalid value for last_read_message. last_read_message should be greater than or equal to one.'
								}
							}
						},
						required: ['name'],
						errorMessage: {
							required: {
								name: 'name cannot be empty.'
							}
						}
					};

					const validate = AjvUtil.getInstance().compile(schema);
					const validationStatus = validate({
						name,
						last_read_message
					});

					if (
						!validationStatus &&
						validate.errors &&
						validate.errors.length !== 0 &&
						validate.errors[0].message
					) {
						throw new Error(validate.errors[0].message);
					}

					await this.getAllSockets().then((sockets) => {
						const socket = sockets.find((obj) => obj.data.name === name);

						if (socket) {
							throw new Error('name already exists.');
						}
					});

					next();
				} catch (err) {
					next(err as Error);
				}
			});

			this.server.on('connection', (socket) => this.registerClient(socket));
		}
	}
}
