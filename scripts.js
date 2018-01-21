window.addEventListener('load', function () {

  document.querySelector('.hi').innerHTML += "<p>Hallo,<br><strong>Annelotte<strong></p>";


  //get the date
  function time() {
    const d = new Date();
    let minutes = addZero(d.getMinutes());
    let seconds = addZero(d.getSeconds());
    const timeDiv = document.querySelector('.time');
    const dateDiv = document.querySelector('.date');
    dateDiv.innerHTML = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    timeDiv.innerHTML = `${d.getHours()}:${minutes}:${seconds}`;
    setTimeout(time, 1000);
  }
  time();
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  //get weather data from buienradar
  let weer;
  fetch('https://api.buienradar.nl/data/public/1.1/jsonfeed')
    .then(data => data.json())
    .then(data => {
      console.log(data);
      weer = data;
      actiesWeerData();
    });

  const tempDiv = document.querySelector('.temp');
  const humidityDiv = document.querySelector('.humidity');
  const rainDiv = document.querySelector('.rain');
  const windforceDiv = document.querySelector('.windforce');

  function actiesWeerData() {
    const actueelWeer = weer.buienradarnl.weergegevens.actueel_weer.weerstations.weerstation;
    const weerLeeuwarden = actueelWeer[25];
    console.log(weerLeeuwarden);

    tempDiv.innerHTML += `${weerLeeuwarden.temperatuur10cm}&deg;C`;
    humidityDiv.innerHTML += `Luchtvochtigheid:<br> ${weerLeeuwarden.luchtvochtigheid}%`;
    weerLeeuwarden.regenMMPU === "-" ? rainDiv.innerHTML += '<i class="fa fa-tint" aria-hidden="true"></i> 0 mm per uur' : rainDiv.innerHTML += `<i class="fa fa-tint" aria-hidden="true"></i> ${weerLeeuwarden.regenMMPU}mm per uur`;
    windforceDiv.innerHTML += `Wind:<br>${weerLeeuwarden.windsnelheidBF} ${weerLeeuwarden.windrichting}`;

    const hand = document.querySelector('.hand');
    hand.style.transform = `rotate(${Number(weerLeeuwarden.windrichtingGR) + 90}deg)`;
    console.log(Number(weerLeeuwarden.windrichtingGR));
  }

  //Google fonts api
  let fontsJSON = [];
  fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCpzoJ552LlaWQyYh4LTYHM9mZLziZBBCc')
    .then(data => data.json())
    .then(data => {
      console.log(data);
      fontsJSON.push(...data.items);
      console.log(fontsJSON);
      randomFont();
    });

  function randomFont() {
    const random = getRandomInt(0, fontsJSON.length);
    const fontObject = fontsJSON[random];
    console.log(fontObject);

    const headStyles = document.querySelector('style')
    headStyles.innerHTML += `@font-face {font-family: ${fontObject.family}; src: url(${fontObject.files.regular})`;
    const fontDiv = document.querySelector('.googleFontSample');
    fontDiv.style.fontFamily = `"${fontObject.family}"`;
    const fontDivTitle = document.querySelector('.fontName');
    fontDivTitle.innerHTML += `Font family: ${fontObject.family}<br>Varianten: ${fontObject.variants.join(", ")}`;

  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (!navigator.onLine) {
    tempDiv.innerHTML = "Geen verbinding";
  };

});