import { Message } from "../../constants/messages";
import { StatusCode } from "../../constants/statusCodes";
import { parseData } from "../../helpers/helpers";
import { checkRequiredParams } from "../../helpers/helpers";
import { ServerInterface, User, UserData } from "../../interfaces/interfaces";
import { createResponse, createResponseWithData } from "../../responses/response";
import { v4 as uuidv4 } from 'uuid';
import { addUser } from "../methods";

const add = async ({request, response}: ServerInterface) => {
    const data: UserData = await parseData({request, response});

    if (!checkRequiredParams(data)) {
        return createResponse({statusCode: StatusCode.BAD_REQUEST, message: Message.REQUIRED_PARAMS, response});
    }

    const id = uuidv4();

    const createdUser: User = {
        id,
        username: data.username,
        age: data.age,
        hobbies: data.hobbies
    }

    addUser(createdUser);

    createResponseWithData({statusCode: StatusCode.CREATED, message: Message.CREATE_USER, data: createdUser, response});
    return;
}

export default add;