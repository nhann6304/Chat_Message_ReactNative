
export interface IMessage {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}