export default class SocketIOConstants {
	public static readonly PATH = '/ws';
	public static readonly DATA_EVENT_NAME = 'data';
	public static readonly PING_TIMEOUT = 20 * 1000;
	public static readonly PING_INTERVAL = 20 * 1000;
	public static readonly DATA_EVENT_ACK_TIMEOUT = 5 * 1000;
}
