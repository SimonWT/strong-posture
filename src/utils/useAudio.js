import { getRandomInt } from './helpers'
import { getStorage } from './userStorage'

const minecraftDamage = 'minecraftDamage.mp3'
const fluteAlert = 'fluteAlert.wav'
const fluteAlertLong = 'fluteAlertLong.wav'
const gameFluteBonus = 'gameFluteBonus.wav'
const levelCompletion = 'levelCompletion.wav'
const completeOrApprovedMission = 'completeOrApprovedMission.wav'
const negativeGuitar = 'negativeGuitar.wav'
const positiveNotification = 'positiveNotification.wav'
const treasure = 'treasure.wav'

const sounds = {
  minecraftDamage, fluteAlert, fluteAlertLong, gameFluteBonus, levelCompletion, completeOrApprovedMission, negativeGuitar, positiveNotification, treasure
}

const remindSounds = {
  minecraftDamage, fluteAlert, fluteAlertLong, gameFluteBonus, completeOrApprovedMission, negativeGuitar
}

const useAudio = () => {

  const warmup = async () => {
    for (const [sound, path] of Object.entries(sounds)) {
      document.getElementById(`audio-${sound}`).load();
    }
    document.getElementById('audio').load();
  }

  const playSound = async (sound) => {
    if(!sound){
      // const soundKeys = Object.keys(remindSounds)
      // const random = getRandomInt(soundKeys.length)
      // const randomAudio = soundKeys[random]
      const userSound = getStorage().sound
      const audioName = userSound ?? 'treasure'
      document.getElementById(`audio-${audioName}`).play();
      return
    }
    document.getElementById(`audio-${sound}`).play();
    // document.getElementById('audio').play();
  }

  //TODO: refector
  const playHurtSound = async () => {
    document.getElementById('audio').play();
  }


  return [playSound, warmup, playHurtSound, sounds]
}

export default useAudio
