import  {getRandomInt} from './helpers'

const urls = [
  'https://firebasestorage.googleapis.com/v0/b/strong-posture.appspot.com/o/Minecraft%20Damage%20(Oof)%20-%20Sound%20Effect%20(HD).mp3?alt=media&token=c57ff8e1-ca58-42ed-bf7c-66ef86c64a0b',
  "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Hey%20bro%2C%20straighten%20up!&lang=ru-RU&speed=0.5125&pitch=0.35",
  "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Don%27t%20crunch%20over!&lang=ru-RU&speed=0.5125&pitch=0.35",
  "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Come%20on%2C%20man%2C%20raise%20to%20the%20sun&lang=ru-RU&speed=0.5125&pitch=0.35"
]

const useAudio = (props) => {
  const initAudioContext = () => {
    var AudioContext = window.AudioContext || window.webkitAudioContext
    var context = new AudioContext() // Make it crossbrowser
    var gainNode = context.createGain()
    gainNode.gain.value = 1 // set volume to 100%
    console.log('context', context)
    return context
  }

  const play = (audioBuffer, context) => {
    console.log(audioBuffer)
    var source = context.createBufferSource()
    source.buffer = audioBuffer
    source.connect(context.destination)
    source.start()
    // source.stop()
  }

  const warmup = async (setContext) => {
    const context = initAudioContext()
    setContext(context)
    const random = getRandomInt(urls.length - 1)
    const audioBuffer = await getAudioBuffer(urls[random], context)
    var source = context.createBufferSource()
    source.buffer = audioBuffer
    source.connect(context.destination)
    source.start()
    source.stop()
  }

  const getAudioBuffer = async (URL, context) => {
    return new Promise((resolve, reject) => {
      // The Promise-based syntax for BaseAudioContext.decodeAudioData() is not supported in Safari(Webkit).
      fetch(URL)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) =>
          context.decodeAudioData(
            arrayBuffer,
            (audioBuffer) => {
              resolve(audioBuffer)
            },
            (error) => {
              console.error(error)
              reject(error)
            }
          )
        )
    })
  }

  function soundNotification() {
    const sound = new Audio(
      'https://firebasestorage.googleapis.com/v0/b/strong-posture.appspot.com/o/Minecraft%20Damage%20(Oof)%20-%20Sound%20Effect%20(HD).mp3?alt=media&token=c57ff8e1-ca58-42ed-bf7c-66ef86c64a0b'
    )

    const promise = sound.play()

    if (promise !== undefined) {
      promise.then(() => {}).catch((error) => console.error)
    }
  }

  const toggle = async (audioContext) => {
    console.log('toggle')
    const random = getRandomInt(urls.length - 1)
    const audioStuff = await getAudioBuffer(urls[random], audioContext)
    play(audioStuff, audioContext)
  }

  const playHurtSound = async (audioContext) => {
    const audioStuff = await getAudioBuffer(urls[0], audioContext)
    play(audioStuff, audioContext)
  }

  

  return [toggle, warmup, playHurtSound]
}

export default useAudio
