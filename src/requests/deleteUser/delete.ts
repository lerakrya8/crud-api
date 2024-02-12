import { Message } from "../../constants/messages";
import { StatusCode } from "../../constants/statusCodes";
import { GetServerInterface } from "../../interfaces/interfaces";
import { createResponse } from "../../responses/response";
import { deleteUserFromDatabase } from "../methods";

const deleteUser = ({requestUrl, response}: GetServerInterface) => {
    const id = requestUrl.split('/').splice(2).at(0);

    if (id) {
        const checkId = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

        if (!checkId) {
            createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.INVALID_ID, response});
            return;
        }

        const successfulDelete = deleteUserFromDatabase(id);

        if (successfulDelete === null) {
            createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.DOES_NOT_EXIST, response});
            return;
        } 

        createResponse({statusCode: StatusCode.DELETED, message: Message.SUCCESS, response});
        return;
    }

    createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.NEED_ID, response});
    return;

}

export default deleteUser;