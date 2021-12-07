import { learn, validate } from '../../api/classification'

const extractPoints = (keypoints) => {
  const usefull = keypoints.slice(0, 7) // nose, eyes, ears, shoulders
  return usefull.reduce(
    (accumulator, currentValue) => [
      ...accumulator,
      currentValue.position.x,
      currentValue.position.y,
    ],
    []
  )
}

export const train = async (keypoints, isGood, userId) => {
  try {
    const points = extractPoints(keypoints)
    console.log(points)
    const { data } = await learn(userId, points, isGood)
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const classify = async (keypoints, userId) => {
  try {
    const points = extractPoints(keypoints)
    const { data } = await validate(userId, points)
    console.log('classify', data)
    return data.prediction
  } catch (error) {
    console.log(error)
    return null
  }
}
