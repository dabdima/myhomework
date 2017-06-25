var APPID = "99e6d1152480160aa39f9f6b118c2bf2",
    baseUrl = "http://api.openweathermap.org/data/2.5/forecast",
    container = document.getElementById('container');

document.forms.weather.onsubmit = function(e) {
    e.preventDefault();
    sendRequest(this.elements.city.value);
};

function sendRequest(city) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl + "?APPID=" + APPID
        + "&q=" + city + "&units=metric&lang=ua");
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4)
            return;

        if (xhr.status == 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                document.getElementById("container").style.display = "block";
                renderMap(data.city.coord);
                renderTable(data);
                console.log(data);

            }
            catch(e) {
                console.log(e);
            }
        }
    };
}

function renderMap(coord) {
    var mapProp= {
        center:new google.maps.LatLng(coord.lat, coord.lon),
        zoom:7
    };
    var map = new google.maps.Map(document.getElementById("container"),mapProp);
    var marker = new google.maps.Marker({
        position: mapProp.center,
        animation: google.maps.Animation.BOUNCE
    });

    marker.setMap(map);
}

function renderTable(obj) {
    var wt = document.getElementById("weather-table"),
    divNum = 0,
    im = "http://openweathermap.org/img/w/";
    var divCol = [];
    var divEl = [];
   // var divCol = document.createElement('div');
    //div.className = "alert alert-success";

    for (var i = 0; i < obj.list.length; i++) {

        if (i % 8 === 0) {
            divCol.push(document.createElement('div'));
            divCol[divNum].className = "wtab";
            wt.appendChild(divCol[divNum]);
            divNum++;
            console.log(i);
        }

        divEl.push(document.createElement('div'));
        divEl[i].className = "wel";
        divEl[i].innerHTML = "<h4>"+ obj.list[i].dt_txt + "</h4>" +
            "<p>" + obj.list[i].main.temp + " C</p>" +
            "<img src=\"" + im + obj.list[i].weather[0].icon + ".png\" alt=\"\">";




        wt.children[divNum - 1].appendChild(divEl[i]);


    }
}