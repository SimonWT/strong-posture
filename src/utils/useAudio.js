import { getRandomInt } from './helpers'

const urls = [
  // 'https://firebasestorage.googleapis.com/v0/b/strong-posture.appspot.com/o/Minecraft%20Damage%20(Oof)%20-%20Sound%20Effect%20(HD).mp3?alt=media&token=c57ff8e1-ca58-42ed-bf7c-66ef86c64a0b',
  // "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Hey%20bro%2C%20straighten%20up!&lang=ru-RU&speed=0.5125&pitch=0.35",
  // "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Don%27t%20crunch%20over!&lang=ru-RU&speed=0.5125&pitch=0.35",
  // "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Come%20on%2C%20man%2C%20raise%20to%20the%20sun&lang=ru-RU&speed=0.5125&pitch=0.35"
]

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
      const soundKeys = Object.keys(remindSounds)
      const random = getRandomInt(soundKeys.length)
      const randomAudio = soundKeys[random]
      document.getElementById(`audio-${randomAudio}`).play();
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
