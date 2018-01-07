window.addEventListener('load', function(){

  let weer;

  fetch('https://api.buienradar.nl/data/public/1.1/jsonfeed')
    .then(data => data.json())
    .then(data => {
      console.log(data);
      weer = data;
      acties();
    });


  function acties() {
    const actueelWeer = weer.buienradarnl.weergegevens.actueel_weer.weerstations.weerstation;
    const weerLeeuwarden = actueelWeer[25];
    console.log(weerLeeuwarden);

    const tempDiv = document.querySelector('.temp');
    tempDiv.innerHTML += `${weerLeeuwarden.temperatuur10cm}&#x2103;`;
    
    const humidityDiv =document.querySelector('.humidity');
    humidityDiv.innerHTML += `Luchtvochtigheid: ${weerLeeuwarden.luchtvochtigheid}%`;

    const rainDiv = document.querySelector('.rain');
    if(weerLeeuwarden.regenMMPU === "-"){
      rainDiv.innerHTML += 'Neerslag: 0 mm per uur';
    }else {
      rainDiv.innerHTML += `Neerslag: ${weerLeeuwarden.regenMMPU}mm per uur`;
    }

    const winddirectionDiv = document.querySelector('.winddirection');
    winddirectionDiv.innerHTML += `Windrichting: ${weerLeeuwarden.windrichting}`;
   
    const windforceDiv = document.querySelector('.windforce');
    windforceDiv.innerHTML += `Windkracht: ${weerLeeuwarden.windsnelheidBF}`;
  }

  function time() {
    const d = new Date();
    const timeDiv = document.querySelector('.time');
    timeDiv.innerHTML = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` ;
    setTimeout(time, 1000);
  }
  time();


});