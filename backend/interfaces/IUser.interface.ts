
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    gender?: "male" | "female" | "other";
    verified?: boolean;
    verificationToken?: string;
    crushes?: string[];
    recievedLikes?: string[],
    matches?: string[];
    profileImage?: string[];
    description?: string;
    turnOns?: string[];
    lookingFor?: string[];
    imageUrl?: any
}


export interface IOperationUser {
    currentUserId: string,
    selectedUserId: string
}

export interface IAcceptFriend {
    senderId: string,
    recepientId: string,
}


export interface IUserQuery extends IUser {
    userId: string,
}

export interface IUserParams {
    userId: string,
}
