import { api } from './index'

export const learn = (username, points, isGood) => {
    return api.post('/Classification/learn', {
        UserName: username,
        Points: points,
        isGood
    })
}

export const validate = (username, points) => {
    return api.post('/Classification/validate', {
        UserName: username,
        Points: points
    })
}