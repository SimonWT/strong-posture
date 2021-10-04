// # you can change scale to adjust all thresholds at once
// # probably we need to give instructions to the user which parameters we are checking
// # so that he does not waste time trying to guess correct posture

const scale = 1
const THRESHOLD_VALUE = 0.03

function check_lean_forward(key_points) {
  // """
  // If the distance between the eyes becomes bigger it means that the person is becoming
  // closer to the laptop
  // ATTENTION: need to find out the distance between eyes when sitting correct and
  // THRESHOLD_VALUE when leaning forward
  // """
  // # != -1 means the point is recognized (not NULL)
  if (
    key_points['leftEye'].x !== -1 &&
    key_points['rightEye'].x !== -1 &&
    Math.abs(key_points['leftEye'].x - key_points['rightEye'].x) >=
      THRESHOLD_VALUE * scale
  )
    return false
  return true
}

function check_slump(key_points) {
  // """
  // when slumping the nose should become closer to the neck
  // so if the Y distance between shoulder and nose becomes smaller than THRESHOLD_VALUE
  // the posture is incorrect
  // TRY THRESHOLD_VALUE with 150px, but adjust
  // """
  if (
    key_points['leftShoulder'].y !== -1 &&
    key_points['nose'].y !== -1 &&
    key_points['leftShoulder'].y - key_points['nose'].y <=
      scale * THRESHOLD_VALUE
  )
    return false

  return true
}

function check_head_drop(key_points) {
  // """
  // when the person is looking down, i.e. drops his head the Y distance between the ear and
  // eye becomes smaller
  // so, if the distance is smaller than THRESHOLD_VALUE the posture is incorrect
  // TRY THRESHOLD_VALUE for start with 15px, but adjust
  // normally the ear point should be lower than eye point
  // """

  if (
    key_points['leftEye'].y != -1 &&
    key_points['leftEar'].y != -1 &&
    key_points['leftEye'].y > key_points['leftEar'].y + scale * THRESHOLD_VALUE
  )
    return false

  if (
    key_points['rightEye'].y !== -1 &&
    key_points['rightEar'].y !== -1 &&
    key_points['rightEye'].y >
      key_points['rightEar'].y + scale * THRESHOLD_VALUE
  )
    return false

  return true
}

export function determineIsPostureCorrect(key_points) {
  // # all method returns true if && only if all the values inside are true (and)
  return (
    check_slump(key_points) &&
    check_head_drop(key_points) &&
    check_lean_forward(key_points)
  )
}
