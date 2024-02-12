import http from 'http';

export interface User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

export interface ServerInterface {
    request: http.IncomingMessage;
    response: http.ServerResponse<http.IncomingMessage>;
}

export interface GetServerInterface {
    requestUrl: string;
    response: http.ServerResponse<http.IncomingMessage>;
}

export interface PutServerInterface {
    request: http.IncomingMessage;
    requestUrl: string;
    response: http.ServerResponse<http.IncomingMessage>;
}

export interface UserData {
    username: string;
    age: number;
    hobbies: string[];
}

export interface ResponseInterface {
    statusCode: number;
    message: string;
    response: http.ServerResponse<http.IncomingMessage>;
}

export interface ResponseWithDataInterface {
    statusCode: number;
    message: string;
    response: http.ServerResponse<http.IncomingMessage>;
    data: User[] | User;
}

export interface userDataForPut {
    username?: string;
    age?: number;
    hobbies?: string[];
}
