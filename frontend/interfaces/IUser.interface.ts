
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    gender?: "male" | "female" | "other";
    verified?: boolean;
    verificationToken?: string;
    crushes?: string[];
    matches?: string[];
    profileImage?: string[];
    description?: string;
    turnOns?: string[];
    lookingFor?: string[];
    deviceToken?: string
}


export type IFriendRequest = {
    currentUserId: string,
    selectedUserId: string
}

export interface IAcceptFriend {
    senderId: string,
    recepientId: string,
}

export interface IUserParams {
    userId: string,
}

export interface IOperationUser {
    currentUserId: string,
    selectedUserId: string
}


export interface IUserQuery extends IUser {
    userId: string,
}