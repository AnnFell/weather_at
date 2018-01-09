window.addEventListener('load', function () {

  //get the date
  function time() {
    const d = new Date();
    const timeDiv = document.querySelector('.time');
    timeDiv.innerHTML = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    setTimeout(time, 1000);
  }
  time();

  //get weather data from buienradar
  let weer;
  fetch('https://api.buienradar.nl/data/public/1.1/jsonfeed')
    .then(data => data.json())
    .then(data => {
      console.log(data);
      weer = data;
      acties();
    });

  const tempDiv = document.querySelector('.temp');
  const humidityDiv = document.querySelector('.humidity');
  const winddirectionDiv = document.querySelector('.winddirection');
  const rainDiv = document.querySelector('.rain');
  const windforceDiv = document.querySelector('.windforce');

  function acties() {
    const actueelWeer = weer.buienradarnl.weergegevens.actueel_weer.weerstations.weerstation;
    const weerLeeuwarden = actueelWeer[25];
    console.log(weerLeeuwarden);


    tempDiv.innerHTML += `${weerLeeuwarden.temperatuur10cm}&#x2103;`;
    humidityDiv.innerHTML += `Luchtvochtigheid: ${weerLeeuwarden.luchtvochtigheid}%`;
    weerLeeuwarden.regenMMPU === "-" ? rainDiv.innerHTML += 'Neerslag: 0 mm per uur' : rainDiv.innerHTML += `Neerslag: ${weerLeeuwarden.regenMMPU}mm per uur`;
    winddirectionDiv.innerHTML += `Windrichting: ${weerLeeuwarden.windrichting}`;
    windforceDiv.innerHTML += `Windkracht: ${weerLeeuwarden.windsnelheidBF}`;
  }

  //Google fonts api
  let fontsJSON;
  fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCpzoJ552LlaWQyYh4LTYHM9mZLziZBBCc')
    .then(data => data.json())
    .then(data => {
      console.log(data);
      fontsJSON = data;
      randomFont();
    });

  function randomFont() {
    const random = getRandomInt(0, fontsJSON.items.length);
    console.log(random);
    //const randomSelectedFont = fontsJSON.item.filter(x => x == random);
    //console.log(randomSelectedFont);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


});