const urls = [
  "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Hey%20bro%2C%20straighten%20up!&lang=ru-RU&speed=0.5125&pitch=0.35",
  "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Don%27t%20crunch%20over!&lang=ru-RU&speed=0.5125&pitch=0.35",
  "https://www.google.com/speech-api/v2/synthesize?enc=mpeg&client=chromium&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&text=Come%20on%2C%20man%2C%20raise%20to%20the%20sun&lang=ru-RU&speed=0.5125&pitch=0.35"
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const useAudio = (props) => {

  const toggle = () => {
    console.log('toggle')
    const random = getRandomInt(urls.length - 1);
    const audio = new Audio(urls[random]);
    audio.play()
  };

  return [toggle];
};

export default useAudio;
