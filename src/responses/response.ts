import { ResponseInterface, ResponseWithDataInterface } from "../interfaces/interfaces";

export const createResponse = ({statusCode, message, response}: ResponseInterface) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({message}));
    response.end();
}

export const createResponseWithData = ({statusCode, message, response, data}: ResponseWithDataInterface) => {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({message, data}));
    response.end();
}
