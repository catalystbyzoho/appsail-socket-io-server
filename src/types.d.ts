export type Message = {
	id: string;
	message: string;
	created_time: string;
};

export type PageDetails = {
	page: number;
	perPage: number;
	hasMore: boolean;
	totalPages: number;
	totalRecords: number;
};

export type SocketData = {
    name:string;
	created_time: number;
	last_read_message: string;
};
