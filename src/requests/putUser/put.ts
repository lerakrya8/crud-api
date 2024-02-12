import { Message } from "../../constants/messages";
import { StatusCode } from "../../constants/statusCodes";
import { parseData } from "../../helpers/helpers";
import { PutServerInterface } from "../../interfaces/interfaces";
import { createResponse, createResponseWithData } from "../../responses/response";
import { changeUser } from "../methods";

const put = async ({request, response, requestUrl}: PutServerInterface) => {
    const data = await parseData({request, response});

    if (!data) {
        createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.NO_DATA, response});
        return;
    }

    const id = requestUrl.split('/').splice(2).at(0);

    if (id) {
        const checkId = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

        if (!checkId) {
            createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.INVALID_ID, response});
            return;
        }

        const successOfUpdate = changeUser(id, data);

        if (successOfUpdate === null) {
            createResponse({statusCode: StatusCode.NOT_FOUND, message: Message.DOES_NOT_EXIST, response});
            return;
        }

        createResponseWithData({statusCode: StatusCode.OK, message: Message.SUCCESS, data: successOfUpdate, response});
        return;
    }

    createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.NEED_ID, response});
    return;
}

export default put;