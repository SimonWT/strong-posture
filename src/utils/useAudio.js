import  { getRandomInt } from './helpers'

const urls = [
  'https://firebasestorage.googleapis.com/v0/b/strong-posture.appspot.com/o/Minecraft%20Damage%20(Oof)%20-%20Sound%20Effect%20(HD).mp3?alt=media&token=c57ff8e1-ca58-42ed-bf7c-66ef86c64a0b',
  // "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Hey%20bro%2C%20straighten%20up!&lang=ru-RU&speed=0.5125&pitch=0.35",
  // "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Don%27t%20crunch%20over!&lang=ru-RU&speed=0.5125&pitch=0.35",
  // "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Come%20on%2C%20man%2C%20raise%20to%20the%20sun&lang=ru-RU&speed=0.5125&pitch=0.35"
]

const useAudio = (props) => {

  const warmup = async () => {
    document.getElementById('audio').load();
  }

  const toggle = async () => {
    document.getElementById('audio').play();
  }

  //TODO: refector
  const playHurtSound = async () => {
    document.getElementById('audio').play();
  }

  return [toggle, warmup, playHurtSound]
}

export default useAudio
