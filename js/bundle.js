(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var convexHull = require('../../src/convex-hull.js');

var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}),
    point = L.latLng([55.753210, 37.621766]),
    lmap = new L.Map('map', { layers: [osm], center: point, zoom: 12, maxZoom: 22 }),
    generateButton = document.getElementsByClassName('generate')[0],
    pointsNumberButton = document.getElementsByClassName('points-number')[0],
    markers,
    polygon;

function drawHull() {
    if (markers) {
        lmap.removeLayer(markers);
    }

    if (polygon) {
        lmap.removeLayer(polygon);
    }

    var bounds = lmap.getBounds(),
        n = bounds._northEast.lat,
        e = bounds._northEast.lng,
        s = bounds._southWest.lat,
        w = bounds._southWest.lng,
        height = n - s,
        width = e - w,
        qHeight = height / 4,
        qWidth = width / 4,
        pointsNumber = pointsNumberButton.value,
        points,
        coords,
        res,
        lls;

    points = turf.random('points', pointsNumber, {
        bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
    });

    coords = points.features.map(function (feature) {
        return feature.geometry.coordinates;
    });

    res = convexHull(coords);

    lls = res.map(function (coord) {
        return L.latLng([coord[1], coord[0]]);
    });

    markers = L.geoJson(points, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, { radius: 3, fillColor: "#ffff00" });
        }
    }).addTo(lmap);

    polygon = L.polygon(lls, { color: "#ffb90f" }).addTo(lmap);
}

generateButton.onclick = drawHull;

drawHull();

var cs = [[0, 1], [2, 0], [3, 1], [2, 2], [2, 1]];

console.log(convexHull(cs));

},{"../../src/convex-hull.js":2}],2:[function(require,module,exports){
function convexHull(data) {
    var upperArr = [],
        lowerArr = [];

    data.sort(function (a, b) {
        return a[0] - b[0];
    });

    // calculate the upper hull
    for (var i = 0; i < data.length; i++) {
        var point = data[i];

        upperArr.push(point);
        removePoints(upperArr);
    }

    // calculate the lower hull
    for (var j = data.length - 1; j >= 0; j--) {
        var point = data[j];

        lowerArr.push(point);
        removePoints(lowerArr);
    }

    lowerArr.splice(0, 1);
    lowerArr.splice(lowerArr.length - 1, 1);

    // concat hulls
    return upperArr.concat(lowerArr);
}

function removePoints(arr) {
    while (arr.length >= 3 && !isTurnRight(arr[arr.length - 3], arr[arr.length - 2], arr[arr.length - 1])) {
        arr.splice(arr.length - 2, 1);
    }
}

function isTurnRight(point1, point2, point3) {
    var x1 = point1[0],
        x2 = point2[0],
        x3 = point3[0],
        y1 = point1[1],
        y2 = point2[1],
        y3 = point3[1];

    return (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1) > 0;
}

module.exports = convexHull;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxqc1xcYXBwLmpzIiwic3JjXFxjb252ZXgtaHVsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksYUFBYSxRQUFRLDBCQUFSLENBQWpCOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENBSlo7QUFBQSxJQUtJLE9BQU8sSUFBSSxFQUFFLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEVBQUMsUUFBUSxDQUFDLEdBQUQsQ0FBVCxFQUFnQixRQUFRLEtBQXhCLEVBQStCLE1BQU0sRUFBckMsRUFBeUMsU0FBUyxFQUFsRCxFQUFqQixDQUxYO0FBQUEsSUFNSSxpQkFBaUIsU0FBUyxzQkFBVCxDQUFnQyxVQUFoQyxFQUE0QyxDQUE1QyxDQU5yQjtBQUFBLElBT0kscUJBQXFCLFNBQVMsc0JBQVQsQ0FBZ0MsZUFBaEMsRUFBaUQsQ0FBakQsQ0FQekI7QUFBQSxJQVFJLE9BUko7QUFBQSxJQVNJLE9BVEo7O0FBV0EsU0FBUyxRQUFULEdBQW9CO0FBQ2hCLFFBQUksT0FBSixFQUFhO0FBQ1QsYUFBSyxXQUFMLENBQWlCLE9BQWpCO0FBQ0g7O0FBRUQsUUFBSSxPQUFKLEVBQWE7QUFDVCxhQUFLLFdBQUwsQ0FBaUIsT0FBakI7QUFDSDs7QUFFRCxRQUFJLFNBQVMsS0FBSyxTQUFMLEVBQWI7QUFBQSxRQUNJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBRDFCO0FBQUEsUUFFSSxJQUFJLE9BQU8sVUFBUCxDQUFrQixHQUYxQjtBQUFBLFFBR0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FIMUI7QUFBQSxRQUlJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBSjFC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LElBQUksTUFBSixJQUFjLENBQWQsSUFBbUIsQ0FBQyxZQUFZLElBQUksSUFBSSxNQUFKLEdBQVcsQ0FBZixDQUFaLEVBQStCLElBQUksSUFBSSxNQUFKLEdBQVcsQ0FBZixDQUEvQixFQUFrRCxJQUFJLElBQUksTUFBSixHQUFXLENBQWYsQ0FBbEQsQ0FBM0IsRUFBaUc7QUFDN0YsWUFBSSxNQUFKLENBQVcsSUFBSSxNQUFKLEdBQVcsQ0FBdEIsRUFBeUIsQ0FBekI7QUFDSDtBQUNKOztBQUVELFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxNQUFyQyxFQUE2QztBQUN6QyxRQUFJLEtBQUssT0FBTyxDQUFQLENBQVQ7QUFBQSxRQUNJLEtBQUssT0FBTyxDQUFQLENBRFQ7QUFBQSxRQUVJLEtBQUssT0FBTyxDQUFQLENBRlQ7QUFBQSxRQUdJLEtBQUssT0FBTyxDQUFQLENBSFQ7QUFBQSxRQUlJLEtBQUssT0FBTyxDQUFQLENBSlQ7QUFBQSxRQUtJLEtBQUssT0FBTyxDQUFQLENBTFQ7O0FBT0EsV0FBUSxDQUFDLEtBQUssRUFBTixLQUFhLEtBQUssRUFBbEIsSUFBd0IsQ0FBQyxLQUFLLEVBQU4sS0FBYSxLQUFLLEVBQWxCLENBQXpCLEdBQWtELENBQXpEO0FBQ0g7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjb252ZXhIdWxsID0gcmVxdWlyZSgnLi4vLi4vc3JjL2NvbnZleC1odWxsLmpzJyk7XG5cbnZhciBvc20gPSBMLnRpbGVMYXllcignaHR0cDovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfbm9sYWJlbHMve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICBtYXhab29tOiAyMixcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4nXG4gICAgfSksXG4gICAgcG9pbnQgPSBMLmxhdExuZyhbNTUuNzUzMjEwLCAzNy42MjE3NjZdKSxcbiAgICBsbWFwID0gbmV3IEwuTWFwKCdtYXAnLCB7bGF5ZXJzOiBbb3NtXSwgY2VudGVyOiBwb2ludCwgem9vbTogMTIsIG1heFpvb206IDIyfSksXG4gICAgZ2VuZXJhdGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdnZW5lcmF0ZScpWzBdLFxuICAgIHBvaW50c051bWJlckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BvaW50cy1udW1iZXInKVswXSxcbiAgICBtYXJrZXJzLFxuICAgIHBvbHlnb247XG5cbmZ1bmN0aW9uIGRyYXdIdWxsKCkge1xuICAgIGlmIChtYXJrZXJzKSB7XG4gICAgICAgIGxtYXAucmVtb3ZlTGF5ZXIobWFya2Vycyk7XG4gICAgfVxuXG4gICAgaWYgKHBvbHlnb24pIHtcbiAgICAgICAgbG1hcC5yZW1vdmVMYXllcihwb2x5Z29uKTtcbiAgICB9XG5cbiAgICB2YXIgYm91bmRzID0gbG1hcC5nZXRCb3VuZHMoKSxcbiAgICAgICAgbiA9IGJvdW5kcy5fbm9ydGhFYXN0LmxhdCxcbiAgICAgICAgZSA9IGJvdW5kcy5fbm9ydGhFYXN0LmxuZyxcbiAgICAgICAgcyA9IGJvdW5kcy5fc291dGhXZXN0LmxhdCxcbiAgICAgICAgdyA9IGJvdW5kcy5fc291dGhXZXN0LmxuZyxcbiAgICAgICAgaGVpZ2h0ID0gbiAtIHMsXG4gICAgICAgIHdpZHRoID0gZSAtIHcsXG4gICAgICAgIHFIZWlnaHQgPSBoZWlnaHQgLyA0LFxuICAgICAgICBxV2lkdGggPSB3aWR0aCAvIDQsXG4gICAgICAgIHBvaW50c051bWJlciA9IHBvaW50c051bWJlckJ1dHRvbi52YWx1ZSxcbiAgICAgICAgcG9pbnRzLFxuICAgICAgICBjb29yZHMsXG4gICAgICAgIHJlcyxcbiAgICAgICAgbGxzO1xuXG4gICAgcG9pbnRzID0gdHVyZi5yYW5kb20oJ3BvaW50cycsIHBvaW50c051bWJlciwge1xuICAgICAgICBiYm94OiBbdyArIHFXaWR0aCwgcyArIHFIZWlnaHQsIGUgLSBxV2lkdGgsIG4gLSBxSGVpZ2h0XVxuICAgIH0pO1xuXG4gICAgY29vcmRzID0gcG9pbnRzLmZlYXR1cmVzLm1hcChmdW5jdGlvbiAoZmVhdHVyZSkge1xuICAgICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICB9KTtcblxuICAgIHJlcyA9IGNvbnZleEh1bGwoY29vcmRzKTtcblxuICAgIGxscyA9IHJlcy5tYXAoZnVuY3Rpb24oY29vcmQpIHtcbiAgICAgICAgcmV0dXJuIEwubGF0TG5nKFtjb29yZFsxXSxjb29yZFswXV0pO1xuICAgIH0pO1xuXG4gICAgbWFya2VycyA9IEwuZ2VvSnNvbihwb2ludHMsIHtcbiAgICAgICAgcG9pbnRUb0xheWVyOiBmdW5jdGlvbiAoZmVhdHVyZSwgbGF0bG5nKSB7XG4gICAgICAgICAgICByZXR1cm4gTC5jaXJjbGVNYXJrZXIobGF0bG5nLCB7cmFkaXVzOiAzLCBmaWxsQ29sb3I6IFwiI2ZmZmYwMFwifSk7XG4gICAgICAgIH1cbiAgICB9KS5hZGRUbyhsbWFwKTtcblxuICAgIHBvbHlnb24gPSBMLnBvbHlnb24obGxzLCB7Y29sb3I6IFwiI2ZmYjkwZlwifSkuYWRkVG8obG1hcCk7XG59XG5cbmdlbmVyYXRlQnV0dG9uLm9uY2xpY2sgPSBkcmF3SHVsbDtcblxuZHJhd0h1bGwoKTtcblxuXG52YXIgY3MgPSBbXG4gICAgWzAsIDFdLFxuICAgIFsyLCAwXSxcbiAgICBbMywgMV0sXG4gICAgWzIsIDJdLFxuICAgIFsyLCAxXVxuXVxuXG5jb25zb2xlLmxvZyhjb252ZXhIdWxsKGNzKSk7XG4iLCJmdW5jdGlvbiBjb252ZXhIdWxsKGRhdGEpIHtcbiAgICB2YXIgdXBwZXJBcnIgPSBbXSxcbiAgICAgICAgbG93ZXJBcnIgPSBbXTtcblxuICAgIGRhdGEuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYVswXSAtIGJbMF07XG4gICAgfSk7XG5cbiAgICAvLyBjYWxjdWxhdGUgdGhlIHVwcGVyIGh1bGxcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBvaW50ID0gZGF0YVtpXTtcblxuICAgICAgICB1cHBlckFyci5wdXNoKHBvaW50KTtcbiAgICAgICAgcmVtb3ZlUG9pbnRzKHVwcGVyQXJyKTtcbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgdGhlIGxvd2VyIGh1bGxcbiAgICBmb3IgKHZhciBqID0gZGF0YS5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICB2YXIgcG9pbnQgPSBkYXRhW2pdO1xuXG4gICAgICAgIGxvd2VyQXJyLnB1c2gocG9pbnQpO1xuICAgICAgICByZW1vdmVQb2ludHMobG93ZXJBcnIpO1xuICAgIH1cblxuICAgIGxvd2VyQXJyLnNwbGljZSgwLCAxKTtcbiAgICBsb3dlckFyci5zcGxpY2UobG93ZXJBcnIubGVuZ3RoIC0gMSwgMSk7XG5cbiAgICAvLyBjb25jYXQgaHVsbHNcbiAgICByZXR1cm4gdXBwZXJBcnIuY29uY2F0KGxvd2VyQXJyKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUG9pbnRzKGFycikge1xuICAgIHdoaWxlIChhcnIubGVuZ3RoID49IDMgJiYgIWlzVHVyblJpZ2h0KGFyclthcnIubGVuZ3RoLTNdLCBhcnJbYXJyLmxlbmd0aC0yXSwgYXJyW2Fyci5sZW5ndGgtMV0pKSB7XG4gICAgICAgIGFyci5zcGxpY2UoYXJyLmxlbmd0aC0yLCAxKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzVHVyblJpZ2h0KHBvaW50MSwgcG9pbnQyLCBwb2ludDMpIHtcbiAgICB2YXIgeDEgPSBwb2ludDFbMF0sXG4gICAgICAgIHgyID0gcG9pbnQyWzBdLFxuICAgICAgICB4MyA9IHBvaW50M1swXSxcbiAgICAgICAgeTEgPSBwb2ludDFbMV0sXG4gICAgICAgIHkyID0gcG9pbnQyWzFdLFxuICAgICAgICB5MyA9IHBvaW50M1sxXTtcblxuICAgIHJldHVybiAoKHgyIC0geDEpICogKHkzIC0geTEpIC0gKHkyIC0geTEpICogKHgzIC0geDEpKSA+IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29udmV4SHVsbDtcbiJdfQ==