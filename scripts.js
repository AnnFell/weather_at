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
      weer = data;
      actiesWeerData();
    });

  function actiesWeerData() {
    // weergegevens voor Leeuwarden uit weerdata halen
    const actueelWeer = weer.buienradarnl.weergegevens.actueel_weer.weerstations.weerstation;
    const weerLeeuwarden = actueelWeer[25];

    // data voor temperatuur, luchtvochtigheid en regen in gridblokjes zetten
    const tempDiv = document.querySelector('.temp');
    const humidityDiv = document.querySelector('.humidity');
    const rainDiv = document.querySelector('.rain');
    tempDiv.innerHTML += `${weerLeeuwarden.temperatuur10cm}&deg;C`;
    humidityDiv.innerHTML += `Luchtvochtigheid:<br> ${weerLeeuwarden.luchtvochtigheid}%`;
    weerLeeuwarden.regenMMPU === "-" ? rainDiv.innerHTML += '<i class="fa fa-tint" aria-hidden="true"></i> 0 mm per uur' : rainDiv.innerHTML += `<i class="fa fa-tint" aria-hidden="true"></i> ${weerLeeuwarden.regenMMPU}mm per uur`;

    // Windrichting en windkracht in kompasroos zetten
    const hand = document.querySelector('.compass__hand');
    const force = document.querySelector('.compass__force');
    hand.style.transform = `rotate(${Number(weerLeeuwarden.windrichtingGR) + 90}deg)`;
    force.innerHTML = weerLeeuwarden.windsnelheidBF;
    //console.log(Number(weerLeeuwarden.windrichtingGR));
  }

  //Google fonts api data laden
  let fontsJSON = [];
  fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCpzoJ552LlaWQyYh4LTYHM9mZLziZBBCc')
    .then(data => data.json())
    .then(data => {
      fontsJSON.push(...data.items);
      randomFont();
    });

  // random font uit google fonts data selecteren + naam en stijl toevoegen aan grid
  function randomFont() {
    const random = getRandomInt(0, fontsJSON.length);
    const fontObject = fontsJSON[random];

    const headStyles = document.querySelector('style');
    // remove standard http: from url, so browser uses https under ssl automatically
    const fontURL = fontObject.files.regular.replace(/(^\w+:|^)/, '');
    headStyles.innerHTML += `@font-face {font-family: ${fontObject.family}; src: url(${fontURL})`;
    const fontDiv = document.querySelector('.googleFontSample');
    fontDiv.style.fontFamily = `"${fontObject.family}"`;
    const fontDivTitle = document.querySelector('.fontName');
    fontDivTitle.innerHTML += `Font family: ${fontObject.family}<br>Varianten: ${fontObject.variants.join(", ")}`;
  }

  // random nummer tussen min en max genereren
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // als er geen verbinding is, een error bericht laten zien
  if (!navigator.onLine) {
    tempDiv.innerHTML = "Geen verbinding";
  }

});