<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
    <title>Map Effects 100</title>
    <link rel="shortcut icon" href="../img/favicon.ico">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css" />
    <style>
        html, body, #map {
          height: 600px;
          font-family: "Avenir LT W01 35 Light", "Century Gothic", Helvetica, Arial, sans-serif;
          background-color: #000;
        }
        #title {
          position: absolute;
          z-index: 999;
          top: 15px;
          right: 25px;
          color: #fff;
        }
        #time {
          position: absolute;
          z-index: 999;
          bottom: 15px;
          left: 25px;
          color: #fff;
          width: 100%;
        }

        /* CSS3 Transition & Animation for sizing svg icon */
        .circles {
          fill: #ff9c00;

          animation: fade-out 5s 1;
          -webkit-animation: fade-out 5s 1;
        }

        @keyframes fade-out {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
          }
        }
        @-webkit-keyframes fade-out {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
          }
        }
    </style>
  </head>

  <body>
    <div id="title"><p>08. Time Animation Play</p></div>
    <div id="map"><div id="time">From: <i id="from"></i><br>To: <i id="to"></i></div></div>

    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="//d3js.org/d3.v3.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"></script>

    <script>
    $(function() {

      console.log('%c⚛ Map Effects 100: Hello geohacker! ⚛', 'font-family:monospace;font-size:16px;color:darkblue;');

      // Leaflet Map Init
      function initMap() {
        var map = L.map('map').setView([36, 139], 5);

        L.tileLayer('//cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
          attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(map);

        $.getJSON('../data/earthquakes.geojson', function(data) {
          // Init Time
          var t = 1397926574790;
          var startt = t;
          var endt = 1400509007520;
          var dt = 4500000;
          var timer = 500;

          // Time Player
          setInterval(function(){
            t = t + dt;
            if(t > endt) {
              t = startt;
            }
            $('#from').html(new Date(t));
            $('#to').html(new Date(t+dt));
          }, timer);

          var geojson = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
              // Every feature is unvisible at start
              layer.setOpacity(0);

              (function(layer, properties) {
                setInterval(function(){
                  var tt = properties['time'];
                  // Filter by time
                  if(tt > t && tt <= (t+dt)) {
                    layer.setOpacity(1);
                    var svgIcon = L.divIcon({
                      className: 'earthquakes',
                      html: '<svg width="64px" height="64px" viewBox="-20 -20 64 64"><g><circle class="circles" id="' + properties['code'] + '" opacity="0.4" r="1" transform="translate(0,0)"></circle></g></svg>'
                    });
                    layer.setIcon(svgIcon);
                    // Set size by magnitude (you should use setTimeout to animate for sizing)
                    setTimeout(function() {
                      d3.select('circle#' + properties['code'])
                        .transition()
                        .delay(0)
                        .duration(4000)
                        .attr('r', properties['mag']*2.5);
                    }, 500);
                    // Clear feature when finished animation
                    setTimeout(function() {
                      layer.setOpacity(0);
                    }, 5000);
                  }
                }, timer);
              })(layer, feature.properties);
            }
          });
          map.fitBounds(geojson.getBounds());
          geojson.addTo(map);
        });
      }

      function getSize(n) {
        return n > 7 ? 20 :
               n > 6 ? 16 :
               n > 5 ? 12 :
               n > 4 ? 8 :
               8;
      }

      initMap();

    });
    </script>
  </body>
</html>
