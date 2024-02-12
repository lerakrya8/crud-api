export enum Message {
    REQUIRED_PARAMS = "One of the user's data (username, age, hobbies) or all of them are missed",
    INVALID_ID = 'User id is invalid (should be uui4)',
    DOES_NOT_EXIST = 'User with providing id does not exist',
    SERVER_ERROR = 'Sorry, server error happened',
    CREATE_USER = 'User was successfully created',
    INVALID_URL = 'Invalid url',
    SUCCESS = 'Operation was successfully done',
    NEED_ID = "Do not give an id",
    INVALID_OPERATION = 'This method is not supported in this api',
    NO_DATA = 'Should be fields to change'
}