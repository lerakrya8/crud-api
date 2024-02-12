import { server } from "../../app";
import { ENDPOINT } from "../constants/apiEndpoint";
import { Message } from "../constants/messages";
import { StatusCode } from "../constants/statusCodes";
import supertest from 'supertest';

const user = {
    username: 'user',
    age: 20,
    hobbies: ['reading']
};

const userWithoutField = {
    username: 'user',
    hobbies: ['reading']
};

const changeFeildsForUser = {
    username: 'the best',
    age: 22,
}

const userIdCorrect = 'e32f8dd3-930b-4581-89e7-140b07f45ada';
const incorrectId = '213e4r';

describe('Method - Get', () => {
    const request = supertest(server);

    it('Get all users', async () => {
        const response = await request.get(`/${ENDPOINT}`);

        expect(response.status).toBe(StatusCode.OK);
        expect(response.body.data).toEqual([]);
    });

    it('Get user by id', async () => {
        const addUser = await request.post(`/${ENDPOINT}`).send(user);

        const id = addUser.body.data.id;

        const response = await request.get(
            `/${ENDPOINT}/${id}`
        );

        expect(response.status).toBe(StatusCode.OK);
        expect(response.body.data).toEqual({
            id: id,
            ...user,
        });
    });

    it('Get error by incorrect id', async () => {
        await request.post(`/${ENDPOINT}`).send(user);

        const response = await request.get(
            `/${ENDPOINT}/${incorrectId}`
        );

        expect(response.status).toBe(StatusCode.BAD_REQUEST);
        expect(response.body.message).toBe(Message.INVALID_ID);
    });

    it('Get error by unexisting id', async () => {
        await request.post(`/${ENDPOINT}`).send(user);

        const response = await request.get(
            `/${ENDPOINT}/${userIdCorrect}`
        );

        expect(response.status).toBe(StatusCode.NOT_FOUND);
        expect(response.body.message).toBe(Message.DOES_NOT_EXIST);
    });
});

describe('Method - Post', () => {
    const request = supertest(server);

    it('Post user with correct data', async () => {
        const response = await request.post(`/${ENDPOINT}`).send(user);

        const id = response.body.data.id;

        expect(response.status).toBe(StatusCode.CREATED);
        expect(response.body.data).toEqual({
            id,
            ...user
        });
    });

    it('Get error when posting user without requires field', async () => {
        const response = await request.post(`/${ENDPOINT}`).send(userWithoutField);

        expect(response.status).toBe(StatusCode.BAD_REQUEST);
        expect(response.body.message).toBe(Message.REQUIRED_PARAMS);
    });
});

describe('Method - Delete', () => {
    const request = supertest(server);

    it('Delete user successfully', async () => {
        const addUser = await request.post(`/${ENDPOINT}`).send(user);

        const id = addUser.body.data.id;

        const response = await request.delete(
            `/${ENDPOINT}/${id}`
        );

        expect(response.status).toBe(StatusCode.DELETED);
    });

    it('Invalid id for delete', async () => {
        await request.post(`/${ENDPOINT}`).send(user);

        const response = await request.delete(
            `/${ENDPOINT}/${incorrectId}`
        );

        expect(response.status).toBe(StatusCode.BAD_REQUEST);
        expect(response.body.message).toBe(Message.INVALID_ID);
    });

    it('Not found record with id for delete', async () => {
        await request.post(`/${ENDPOINT}`).send(user);

        const response = await request.delete(
            `/${ENDPOINT}/${userIdCorrect}`
        );

        expect(response.status).toBe(StatusCode.NOT_FOUND);
        expect(response.body.message).toBe(Message.DOES_NOT_EXIST);
    });
});  

describe('Method - Put', () => {
    const request = supertest(server);

    it('Change user data successfully', async () => {
        const addUser = await request.post(`/${ENDPOINT}`).send(user);

        const id = addUser.body.data.id;

        const response = await request.put(
            `/${ENDPOINT}/${id}`
        ).send(changeFeildsForUser);

        const newUserData = {
            username: 'the best',
            age: 22,
            hobbies: ['reading']
        }

        expect(response.status).toBe(StatusCode.OK);
        expect(response.body.data).toEqual({
            id,
            ...newUserData
        });
        
    });

    it('Invalid id for put', async () => {
        await request.post(`/${ENDPOINT}`).send(user);

        const response = await request.put(
            `/${ENDPOINT}/${incorrectId}`
        ).send(changeFeildsForUser);

        expect(response.status).toBe(StatusCode.BAD_REQUEST);
        expect(response.body.message).toBe(Message.INVALID_ID);
    });

    it('Put without data', async () => {
        const addUser = await request.post(`/${ENDPOINT}`).send(user);

        const id = addUser.body.data.id;

        const response = await request.put(
            `/${ENDPOINT}/${id}`
        ).send();

        expect(response.status).toBe(StatusCode.BAD_REQUEST);
        expect(response.body.message).toBe(Message.NO_DATA);
    });

    it('Not found record with id for put', async () => {
        await request.post(`/${ENDPOINT}`).send(user);

        const response = await request.put(
            `/${ENDPOINT}/${userIdCorrect}`
        ).send({changeFeildsForUser});

        expect(response.status).toBe(StatusCode.NOT_FOUND);
        expect(response.body.message).toBe(Message.DOES_NOT_EXIST);
    });
}); 

describe('Invalid methods', () => {
    const request = supertest(server);

    it('Invalid method Patch', async () => {
        const addUser = await request.post(`/${ENDPOINT}`).send(user);

        const id = addUser.body.data.id;

        const response = await request.patch(
            `/${ENDPOINT}/${id}`
        ).send(changeFeildsForUser);

        expect(response.status).toBe(StatusCode.NOT_FOUND);
        expect(response.body.message).toBe(Message.INVALID_OPERATION);
        
    });
});

describe('Invalid urls', () => {
    const request = supertest(server);

    it('Invalid url get', async () => {
        const addUser = await request.post(`/${ENDPOINT}`).send(user);

        const id = addUser.body.data.id;

        const response = await request.post(
            `/v1/${id}/dfdgfhj/answer`
        );

        expect(response.status).toBe(StatusCode.NOT_FOUND);
        expect(response.body.message).toBe(Message.INVALID_URL);
    });

    it('Invalid url post', async () => {
        const response = await request.post(
            `/${ENDPOINT}/answer`
        ).send({});

        expect(response.status).toBe(StatusCode.NOT_FOUND);
        expect(response.body.message).toBe(Message.INVALID_URL);
    });
});

describe('Server error', () => {
    const request = supertest(server);

    it('Post with wrong JSON object', async () => {
        const response = await request.post(`/${ENDPOINT}`).send(JSON.stringify(user).replace("\"", "'"));

        expect(response.status).toBe(StatusCode.SERVER_ERROR);
        expect(response.body.message).toBe(Message.SERVER_ERROR);
        
    });
});