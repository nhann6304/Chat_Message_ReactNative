
export interface IMessage {
    _id: string;
    senderId: string;
    recepientId: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}