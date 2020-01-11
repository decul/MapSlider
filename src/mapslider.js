var configs = [];
configs.push({ name: "1888", fileName: "1888.jpg", w: 2462, h: 1758, x: 1467, y: 926, z: 0.9238, r: 0 });
configs.push({ name: "1944", fileName: "1944.jpg", w: 4662, h: 4345, x: 2658.58, y: 2040.92, z: 0.4, r: 0 });
configs.push({ name: "2012 Śródmieście", fileName: "2012 center.png", w: 3072, h: 2560, x: 1552, y: 1309, z: 0.826, r: 2.42 });
configs.push({ name: "2012 Przedmieścia", fileName: "2012 wide.jpg", w: 3584, h: 3584, x: 1952.36, y: 1674.21, z: 8.2484, r: 2.42 })
configs.push({ name: "Foto 1944 Śródmieście", fileName: "1944_7.jpg", w: 3468, h: 3464, x: 2005.42, y: 1433.85, z: 0.5226, r: -59.2 })
configs.push({ name: "Foto 1944 1000-lecia", fileName: "1944_6.jpg", w: 3461, h: 3462, x: 1468.56, y: 2844.45, z: 0.53049, r: -59.2 })
configs.push({ name: "Foto 1944 Załęże", fileName: "1944_4.jpg", w: 3472, h: 3470, x: -219.24, y: 4885.16, z: 0.53049, r: -60 })


var leftMapIndex = 1;
var rightMapIndex = 6;


const zoomDelta = 2.0;
const translationDelta = 100;

var zoomRatio = 4.2;
var translationX = 0.0;
var translationY = 0.0;

var debug = false;

var map;


var scrollZoom = function (e) {
    e.preventDefault();
    $('.image img').addClass('with-transition');
    if (e.originalEvent.wheelDelta / 120 > 0) {
        zoomRatio *= zoomDelta;
    }
    else {
        zoomRatio /= zoomDelta;
    }
    transform();
}

var keyPressed = function (e) {
    if (e.key.match("^F"))
        return;

    e.preventDefault();

    switch (e.key) {
        case 'ArrowUp':
            $('.image img').addClass('with-transition');
            translationY += translationDelta / zoomRatio;
            break;

        case 'ArrowDown':
            $('.image img').addClass('with-transition');
            translationY -= translationDelta / zoomRatio;
            break;

        case 'ArrowRight':
            $('.image img').addClass('with-transition');
            translationX -= translationDelta / zoomRatio;
            break;

        case 'ArrowLeft':
            $('.image img').addClass('with-transition');
            translationX += translationDelta / zoomRatio;
            break;

        case '+':
            $('.image img').addClass('with-transition');
            zoomRatio *= zoomDelta;
            break;

        case '-':
            $('.image img').addClass('with-transition');
            zoomRatio /= zoomDelta;
            break;
    }

    if (debug) {
        switch (e.key) {
            case 'q':
                configs[leftMapIndex].r -= 0.1;
                console.log(configs[leftMapIndex]);
                break;

            case 'e':
                configs[leftMapIndex].r += 0.1;
                console.log(configs[leftMapIndex]);
                break;

            case 'w':
                configs[leftMapIndex].y += 3 / zoomRatio / configs[leftMapIndex].z;
                console.log(configs[leftMapIndex]);
                break;

            case 's':
                configs[leftMapIndex].y -= 3 / zoomRatio / configs[leftMapIndex].z;
                console.log(configs[leftMapIndex]);
                break;

            case 'a':
                configs[leftMapIndex].x += 3 / zoomRatio / configs[leftMapIndex].z;
                console.log(configs[leftMapIndex]);
                break;

            case 'd':
                configs[leftMapIndex].x -= 3 / zoomRatio / configs[leftMapIndex].z;
                console.log(configs[leftMapIndex]);
                break;

            case '1':
                configs[leftMapIndex].z /= 1.003;
                console.log(configs[leftMapIndex]);
                break;

            case '2':
                configs[leftMapIndex].z *= 1.003;
                console.log(configs[leftMapIndex]);
                break;
        }
    }

    transform();
}

var transform = function () {
    transformSide('left', configs[leftMapIndex]);
    transformSide('right', configs[rightMapIndex]);
}

var transformSide = function (side, conf) {
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();

    var zoom = zoomRatio * conf.z;

    var transX = (-conf.w + screenWidth) / 2;     // Allign picture's and screen's middle points
    transX += (conf.w / 2.0 - conf.x) * zoom;     // Drag city hall to middle poin
    transX += translationX * zoomRatio;           // Drag map to place that user wants to watch

    var transY = (-conf.h + screenHeight) / 2;
    transY += (conf.h / 2.0 - conf.y) * zoom;
    transY += translationY * zoomRatio;

    $('.' + side + '.image img').css('transform', ' translate3d(' + transX + 'px, ' + transY + 'px, 0px) scale(' + zoom + ') rotate(' + conf.r + 'deg)');
}

var fillComboboxes = function () {
    var $comboboxes = $('.combobox');
    $.each(configs, function (index, conf) {
        $comboboxes.append($("<option />").val(index).text(conf.name));
    });
    $('#left-combobox').val(leftMapIndex);
    $('#right-combobox').val(rightMapIndex);
    comboboxChanged();
}

var comboboxChanged = function () {
    leftMapIndex = $('#left-combobox').val();
    rightMapIndex = $('#right-combobox').val();

    $('.left.image img').attr("src", "src/img/" + configs[leftMapIndex].fileName);
    $('.right.image img').attr("src", "src/img/" + configs[rightMapIndex].fileName);

    transform();
}

var simulateKey = function (e) {
    e.key = e.data;
    keyPressed(e);
}

var startDragX, startDragY;

var startDragging = function (e) {
    e.preventDefault();
    $('.image img').removeClass('with-transition');
    startDragX = e.pageX;
    startDragY = e.pageY;
    $(document)
        .on('mousemove touchmove', dragging)
        .on('mouseup touchend', stopDragging);
}

var dragging = function (e) {
    e.preventDefault();
    translationX += (e.pageX - startDragX) / zoomRatio;
    translationY += (e.pageY - startDragY) / zoomRatio;
    startDragX = e.pageX;
    startDragY = e.pageY;

    transform();
}

var stopDragging = function (e) {
    e.preventDefault();
    $(document)
        .off('mousemove touchmove', dragging)
        .off('mouseup touchend', stopDragging);
};

var initMapSlider = function () {
    map = L.map('openmap-wrapper', {
        zoomControl: false,
        scrollWheelZoom: 'center'
    }).setView([49.8264, 22.7690], 16);
    initMap();

    $('.combobox').change(comboboxChanged);
    fillComboboxes();

    $('.openmap').on('mousewheel', scrollZoom);
    $(document).keydown(keyPressed);
    $('#openmap-wrapper').on('mousedown touchstart', startDragging);

    $('#zoom-out').bind("touchstart", "-", simulateKey);
    $('#zoom-in').bind("touchstart", "+", simulateKey);
    $('#move-up').bind("touchstart", "ArrowUp", simulateKey);
    $('#move-down').bind("touchstart", "ArrowDown", simulateKey);
    $('#move-left').bind("touchstart", "ArrowLeft", simulateKey);
    $('#move-right').bind("touchstart", "ArrowRight", simulateKey);

    transform();
}

function initMap() {
    const coord = {
        lat: 50.0373,
        lng: 22.0040
    }

    // fit map between brescia and padua
    map.fitBounds(
        L.latLngBounds(
            L.latLng(coord),
            L.latLng(coord)
        )
    );


    // add OpenStreetMaps
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>', id: 'mapbox.streets' }).addTo(map);

}