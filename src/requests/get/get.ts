import { Message } from "../../constants/messages";
import { StatusCode } from "../../constants/statusCodes";
import { GetServerInterface } from "../../interfaces/interfaces";
import { createResponse, createResponseWithData } from "../../responses/response";
import { getAllUsers, getUser } from "../methods";

const get = ({requestUrl, response}: GetServerInterface) => {

    const id = requestUrl.split('/').splice(2).at(0);

    if (id) {
        const checkId = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

        if (!checkId) {
            createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.INVALID_ID, response});
            return;
        }

        const user = getUser(id);

        if ( user === null) {
            createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.DOES_NOT_EXIST, response});
            return;
        }

        createResponseWithData({statusCode: StatusCode.OK, message: Message.SUCCESS, data: user, response});
        return;
    }

    const users = getAllUsers();

    createResponseWithData({statusCode: StatusCode.OK, message: Message.SUCCESS, data: users, response});
    return;
}

export default get;