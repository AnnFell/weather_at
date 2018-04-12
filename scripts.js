window.addEventListener('load', function () {

    document.querySelector('.hi').innerHTML += "<p>Hallo,<br><strong>Annelotte<strong></p>";


    function getCurrentTime() {
        const d = new Date();
        let minutes = addZero(d.getMinutes());
        let seconds = addZero(d.getSeconds());
        const timeDiv = document.querySelector('.time');
        const dateDiv = document.querySelector('.date');
        dateDiv.innerHTML = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
        timeDiv.innerHTML = `${d.getHours()}:${minutes}:${seconds}`;
        setTimeout(getCurrentTime, 1000);
    }
    getCurrentTime();

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    let buienradarData;
    fetch('https://api.buienradar.nl/data/public/1.1/jsonfeed')
        .then(data => data.json())
        .then(data => {
            buienradarData = data;
            leeuwardenWeatherData();
            locationWeatherData(53.13, 6.10); //testing location weather data
        });

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    // function showPosition(position) {
    //     console.log(position);
    //     const latitude = position.coords.latitude.toFixed(2);
    //     const longitude = position.coords.longitude.toFixed(2);
    //     console.log(latitude, longitude);
    //     locationWeatherData(latitude, longitude);
    // }

    //getLocation();
    
    function locationWeatherData(latitude, longitude) {
        // all buienradar stations data
        const allBuienradarStations = buienradarData.buienradarnl.weergegevens.actueel_weer.weerstations.weerstation;
        console.log(allBuienradarStations);
        allBuienradarStations.sort((a, b) => {

        });
        //.[n].latGraden en .lonGraden, of lat en lon (xx.xx)
        // naam station: .[n].stationnaam (.#text, .@regio)
        //console.log(actueelWeer);
        //actionsWeatherData(closestBuienradarStation);
    }

    function leeuwardenWeatherData() {
        // all buienradar stations data
        const allBuienradarStations = buienradarData.buienradarnl.weergegevens.actueel_weer.weerstations.weerstation;
        const leeuwardenBuienraderStation = allBuienradarStations[25];

        actionsWeatherData(leeuwardenBuienraderStation);
    }

    function actionsWeatherData(station) {
        // data voor temperatuur, luchtvochtigheid en regen in gridblokjes zetten
        const tempDiv = document.querySelector('.temp');
        const humidityDiv = document.querySelector('.humidity');
        const rainDiv = document.querySelector('.rain');

        tempDiv.innerHTML += `${station.temperatuur10cm}&deg;C`;
        humidityDiv.innerHTML += `Luchtvochtigheid:<br> ${station.luchtvochtigheid}%`;
        if(station.regenMMPU === "-") {
            rainDiv.innerHTML += '<i class="fa fa-tint" aria-hidden="true"></i> 0 mm per uur';
        }else{
            rainDiv.innerHTML += `<i class="fa fa-tint" aria-hidden="true"></i> ${station.regenMMPU}mm per uur`;
        }

        // compass data
        const compassHand = document.querySelector('.compass__hand');
        const compassWindforce = document.querySelector('.compass__force');
        compassHand.style.transform = `rotate(${Number(station.windrichtingGR) + 90}deg)`;
        compassWindforce.innerHTML = station.windsnelheidBF;
    }

    // Google fonts api data
    let fontsJSON = [];
    fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCpzoJ552LlaWQyYh4LTYHM9mZLziZBBCc')
        .then(data => data.json())
        .then(data => {
            fontsJSON.push(...data.items);
            randomGoogleFont();
        });

    // Select random font + add to grid
    function randomGoogleFont() {
        const random = getRandomInt(0, fontsJSON.length);
        const fontObject = fontsJSON[random];

        const headStyles = document.querySelector('style');
        // remove standard http: from url, so browser uses https under ssl automatically
        const fontURL = fontObject.files.regular.replace(/(^\w+:|^)/, '');
        headStyles.innerHTML += `@font-face {font-family: ${fontObject.family}; src: url(https://${fontURL})`;
        const fontDiv = document.querySelector('.googleFontSample');
        fontDiv.style.fontFamily = `"${fontObject.family}"`;
        const fontDivTitle = document.querySelector('.fontName');
        fontDivTitle.innerHTML += `Font family: ${fontObject.family}<br>Varianten: ${fontObject.variants.join(", ")}`;
    }

    // generate random number between min and max
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // show error message when offline
    if (!navigator.onLine) {
        tempDiv.innerHTML = "Geen verbinding";
    }

});