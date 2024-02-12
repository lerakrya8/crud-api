import { ENDPOINT } from "../constants/apiEndpoint";
import { ServerInterface, UserData } from '../interfaces/interfaces';
import { createResponse } from "../responses/response";
import { StatusCode } from "../constants/statusCodes";
import { Message } from "../constants/messages";

export const isUrlCorrect = (url: string, requiredId = false) => {
    if (!url.startsWith(ENDPOINT)) {
        return false;
    }

    const options = url.split('/').splice(2);

    if (requiredId) {

        return !(options.length > 1);
    }

    if (options.length) {
        return false;
    }

    return true;
}

export const checkUrlForGetRequest = (newUrl: string) => {
    if (!newUrl.startsWith(ENDPOINT)) {
        return false;
    }

    const options = newUrl.split('/').splice(2);

    if (options.length > 1) {
        return false;
    }

    return true;
    
}

export const checkRequiredParams = ({username, age, hobbies}: UserData) => {
    if (!username || !age || !hobbies) {
        return false;
    }

    return true;
}

export const parseData = async ({request, response}:ServerInterface) => {
    return new Promise<UserData>((resolve, reject) => {
        try {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString(); 
            });
            request.on('end', () => {
                try{
                    if(body === '' || Object.keys(body).length === 0) {
                        createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.NO_DATA, response});
                        return;
                    }
                    resolve(JSON.parse(body));
                } catch {
                    createResponse({statusCode: StatusCode.SERVER_ERROR, message: Message.SERVER_ERROR, response});
                }
            });
        } catch (err) {
            createResponse({statusCode: StatusCode.SERVER_ERROR, message: Message.SERVER_ERROR, response});
            reject();

        }
    }) 
}