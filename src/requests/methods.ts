import { DATABASE } from "../database/users";
import { User, userDataForPut } from "../interfaces/interfaces";

export const addUser = (user: User) => {
    DATABASE.push(user);
}

export const changeUser = (id: string, data: userDataForPut) => { 
    const user = DATABASE.find(userCard => userCard.id === id);
    const userIndex = DATABASE.findIndex(userCard => userCard.id === id);

    if(!user) {
        return null;
    }

    const changedUserData: User = {
        id: user.id,
        username: data.username || user.username,
        age: data.age || user.age,
        hobbies: data.hobbies || user.hobbies
    };

    DATABASE.splice(userIndex, 1, changedUserData);

    return changedUserData;
}

export const deleteUserFromDatabase = (id: string) => {
    const deleteIdx = DATABASE.findIndex(user => user.id === id);

    if (deleteIdx === -1) {
        return null;
    }

    DATABASE.splice(deleteIdx, 1);

    return true;
}

export const getAllUsers = () => {
    return DATABASE;
}

export const getUser = (id: string) => {
    const user = DATABASE.find(userCard => userCard.id === id);

    if(!user) {
        return null;
    }

    return user;
}
