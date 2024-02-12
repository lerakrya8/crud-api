import 'dotenv/config';
import http from 'http';
import { checkUrlForGetRequest, isUrlCorrect } from './src/helpers/helpers';
import add from './src/requests/addUser/add';
import put from './src/requests/putUser/put';
import deleteUser from './src/requests/deleteUser/delete';
import get from './src/requests/get/get';
import { createResponse } from './src/responses/response';
import { StatusCode } from './src/constants/statusCodes';
import { Message } from './src/constants/messages';

const PORT = process.env.PORT || 3000;

export const handler = (request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage>) => {
    let requestUrl = request.url || '';
    if (requestUrl?.endsWith('/')) {
        requestUrl = requestUrl.slice(0, -1);
    }

    if (requestUrl?.startsWith('/')) {
        requestUrl = requestUrl.slice(1);
    }

    switch(request.method) {
        case 'GET':
            if (!checkUrlForGetRequest(requestUrl)) {
                createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.INVALID_URL, response});
                return;
            }
            get({requestUrl, response});
            break;
        case 'POST':
            if (!isUrlCorrect(requestUrl)) {
                createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.INVALID_URL, response});
                return;
            }
            add({request, response});
            break;
        case 'PUT':
            if (!isUrlCorrect(requestUrl, true)) {
                createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.INVALID_URL, response});
                return;
            }
            put({request, response, requestUrl});
            break;
        case 'DELETE':
            if (!isUrlCorrect(requestUrl, true)) {
                createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.INVALID_URL, response});
                return;
            }
            deleteUser({requestUrl, response});
            break;
        default:
            createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.INVALID_OPERATION, response});
            return;
    }
}

export const server = http.createServer((request, response) => {
    handler(request, response);
})

server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});