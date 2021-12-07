import { v4 as uuidv4 } from 'uuid';

const STORAGE_NAME = 'strongPostureUserStorage'

const initUser = () => {
    const storage = getStorage()
    if(storage.userId) return storage.userId
    const uuid = uuidv4()
    updateStorage('userId', uuid)
}

const getStorage = () => {
    const string = localStorage.getItem(STORAGE_NAME)
    if(!string || string.length === 0 ) return {}
    return JSON.parse(string)
}

const updateStorage = (key, value) => {
    const storage = getStorage()
    storage[key] = value
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}

export { initUser, getStorage, updateStorage }