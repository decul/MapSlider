var config = [
    { town: "Rzeszów", maps: [
        { w: 2093, h: 2414, x:  993.632, y: 1132.990, z: 1.9738, r:   0.0, name: "1779-83", googleId: "1ctm1G9jqUsdGO6gGtBU91a7jS1ZHhpua" },
        { w: 5416, h: 5264, x: 2349.795, y: 2794.121, z: 0.3077, r:  -1.4, name: "1849", googleId: "1to2eWVQ7wYScRVwOiZxu4RX7O2DJ7Ywa" },
        { w: 5434, h: 4567, x: 2439.665, y: 2133.054, z: 0.3059, r:  -1.3, name: "1888", googleId: "1McZJJbSTqdfVRvwTaRuqj75M5gjCP70X" },
        { w: 1399, h: 2048, x:  726.125, y: 1065.833, z: 1.1933, r:  12.9, name: "20-to lecie m. woj.", googleId: "1P9pN30mfVarRGT8ivNprTDiFK4e74eYf" },
        { w: 4662, h: 4345, x: 2658.580, y: 2040.920, z: 0.4000, r:   0.0, name: "1944", fileName: "1944.jpg" },
        { w: 1643, h: 1853, x: 799.0740, y: 931.1710, z: 1.7260, r:  -1.0, name: "1957", fileName: "1957.jpg" },
        { w:  377, h:  317, x: 597.0400, y: -641.550, z: 1.4330, r:   2.9, name: "1954-73 Powstańców W-wy", fileName: "1954-73 powstańców.jpg" },
        { name: "2020", dynamic: true, layers: [
            { w:  760, h:   985, x:  364.202, y:  521.066, z: 5.6121, r:  0.0, name: "2020 Low resolution", fileName: "2020_small.jpg" },
            { w: 2532, h:  3281, x: 1212.104, y: 1738.038, z: 1.6833, r:  0.0, name: "2020 Przedmieścia", fileName: "2020_subs.jpg" },
            { w: 2462, h:  2239, x: 1390.483, y: 1024.922, z: 0.8409, r:  0.0, name: "2020 Centrum", fileName: "2020_center.jpg" }
        ]},
        { w: 3468, h: 3464, x: 2005.420, y: 1433.850, z: 0.5226, r: -59.2, name: "Foto 1944 Śródmieście", fileName: "1944_7.jpg" },
        { w: 3461, h: 3462, x: 1468.560, y: 2844.450, z: 0.5305, r: -59.2, name: "Foto 1944 1000-lecia", fileName: "1944_6.jpg" },
        { w: 3472, h: 3470, x: -219.240, y: 4885.160, z: 0.5305, r: -60.0, name: "Foto 1944 Załęże", fileName: "1944_4.jpg" },
        { w: 5857, h: 4783, x: 5579.760, y: -1926.25, z: 0.3140, r:  44.1, name: "Foto 1944 Dąbrowskiego", fileName: "1944_1.jpg" },
        { name: "Foto 2020", dynamic: false, layers: [
            { w: 4451, h: 11292, x: 2170.526, y: 6038.578, z: 0.4787, r: 31.3, name: "Foto 2020 skos", googleId: "1FB4rl-9_AvoK-ul_pZS59iYDnqJsd04B" },
            { w: 3213, h:  3214, x: 1806.086, y: 1585.977, z: 0.4787, r:  0.0, name: "Foto 2020 centrum", googleId: "1x57W4M-938ElmUKcU0X08uSWGL8U4fdn" }
        ]}
    ]},
    { town: "Kraków", maps: [
        { w: 7356, h: 3864, x: 3395.501, y:  294.388, z: 1.9738, r:   0.0, name: "1779-83", googleId: "1m276wNVGX1IMOX3JKAs8waPNsEaR8Ksv" },
        { w: 2475, h: 1450, x:  839.019, y:  562.863, z: 7.9439, r:   0.0, name: "2020", googleId: "1KMCT30fJzxy8Eq3vUl2jBciyqspzGsJT"}
    ]}
];


var townIndex = 0;
var leftMapIndex;
var rightMapIndex;


const zoomDelta = 1.42;
const translationDelta = 100;

var zoomRatio = 1.0;
var translationX = 0.0;
var translationY = 0.0;

var debug = false;


var scrollZoom = function (e) {
    e.preventDefault();
    $('.image img').addClass('with-transition');
    if (e.originalEvent.wheelDelta / 120 > 0) {
        changeZoom(e.pageX, e.pageY, zoomDelta);
    }
    else {
        changeZoom(e.pageX, e.pageY, 1.0 / zoomDelta);
    }
    transform();
    chooseLayers();
}

var keyPressed = function (e) {
    if (e.key.match("^F"))
        return;

    var keyFound = true;

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
            chooseLayers();
            break;

        case '-':
            $('.image img').addClass('with-transition');
            zoomRatio /= zoomDelta;
            chooseLayers();
            break;

        default:
            keyFound = false;
            break;
    }

    if (debug && !keyFound) {
        keyFound = true;

        var editedMap = config[townIndex].maps[leftMapIndex];

        switch (e.key) {
            case 'q':
                editedMap.r -= 0.1;
                console.log(editedMap);
                break;

            case 'e':
                editedMap.r += 0.1;
                console.log(editedMap);
                break;

            case 'w':
                editedMap.y += 3 / zoomRatio / editedMap.z;
                console.log(editedMap);
                break;

            case 's':
                editedMap.y -= 3 / zoomRatio / editedMap.z;
                console.log(editedMap);
                break;

            case 'a':
                editedMap.x += 3 / zoomRatio / editedMap.z;
                console.log(editedMap);
                break;

            case 'd':
                editedMap.x -= 3 / zoomRatio / editedMap.z;
                console.log(editedMap);
                break;

            case '1':
                editedMap.z /= 1.003;
                console.log(editedMap);
                break;

            case '2':
                editedMap.z *= 1.003;
                console.log(editedMap);
                break;

            default:
                keyFound = false;
                break;
        }
    }

    if (keyFound) 
        e.preventDefault();

    transform();
}

var transform = function () {
    limitTransformations();

    var screenWidth = $(window).width();
    var screenHeight = $(window).height();

    $(".image img").each(function() {
        var map = config[townIndex].maps[$(this).attr("map")];
        if (map === undefined) 
            return;

        if ($(this).is("[layer]")) 
            map = map.layers[$(this).attr("layer")];

        var zoom = zoomRatio * map.z;

        var transX = (-map.w + screenWidth) / 2;        // Allign picture's and screen's middle points
        transX += (map.w / 2.0 - map.x) * zoom;         // Drag city hall to middle poin
        transX += translationX * zoomRatio;             // Drag map to place that user wants to watch

        var transY = (-map.h + screenHeight) / 2;
        transY += (map.h / 2.0 - map.y) * zoom;
        transY += translationY * zoomRatio;

        $(this).css('transform', ' translate3d(' + transX + 'px, ' + transY + 'px, 0px) scale(' + zoom + ') rotate(' + map.r + 'deg)');
    });
}

var changeZoom = function (mouseX, mouseY, zoomChange) {
    var prevZoom = zoomRatio;
    zoomRatio *= zoomChange;
    limitTransformations();
    var x = mouseX - $(window).width() / 2.0;
    var y = mouseY - $(window).height() / 2.0;
    translationX += x / zoomRatio - x / prevZoom;
    translationY += y / zoomRatio - y / prevZoom;
}

var limitTransformations = function () {
    if (!debug) {
        var minX = 1e6;
        var maxX = -1e6;
        var minY = 1e6;
        var maxY = -1e6;
        const minZ = 0.0625;
        const maxZ = 4.0;

        $(".image img").each(function() {
            var map = config[townIndex].maps[$(this).attr("map")];
            if (map === undefined) 
                return;
    
            if ($(this).is("[layer]")) 
                map = map.layers[$(this).attr("layer")];

            var margin = 0.0;
            if (Math.abs(map.r) > 5.0)
                margin = (Math.sqrt(map.w * map.w + map.h * map.h) - Math.min(map.w, map.h)) / 2;

            minX = Math.min(minX, (map.x - map.w - margin) * map.z);
            maxX = Math.max(maxX, (map.x + margin) * map.z);
            minY = Math.min(minY, (map.y - map.h - margin) * map.z);
            maxY = Math.max(maxY, (map.y + margin) * map.z);
        });

        if (translationX > maxX)
            translationX = maxX;
        if (translationX < minX)
            translationX = minX;

        if (translationY > maxY)
            translationY = maxY;
        if (translationY < minY)
            translationY = minY;

        if (zoomRatio > maxZ)
            zoomRatio = maxZ;
        if (zoomRatio < minZ)
            zoomRatio = minZ;
    }
}

var fillComboboxes = function () {
    townIndex = $('#town-combobox').val();

    var $comboboxes = $('.mapbox');
    $comboboxes.empty();
    $.each(config[townIndex].maps, function (index, map) {
        $comboboxes.append($("<option />").val(index).text(map.name));
    });
    if (townIndex == 0) {
        leftMapIndex = 4;
        rightMapIndex = 7;
    }
    else {
        leftMapIndex = 0;
        rightMapIndex = 1;
    }
    $('#left-combobox').val(leftMapIndex);
    $('#right-combobox').val(rightMapIndex);
    comboboxChanged({ target: $('#left-combobox')[0] });
    comboboxChanged({ target: $('#right-combobox')[0] });
}

var comboboxChanged = function (e) {
    var mapIndex = e.target.value;
    var imgHolder;

    if (e.target.id === "left-combobox") 
        imgHolder = $('.left.image');
    else 
        imgHolder = $('.right.image');

    imgHolder.empty();

    var map = config[townIndex].maps[mapIndex];

    if (map.hasOwnProperty("layers")) {
        $(map.layers).each(function(layerIndex) {
            imgHolder.append($("<img src=" + imgURL(this) + " map=" + mapIndex + " layer=" + layerIndex + ">"));
        })
    }
    else {
        imgHolder.append($("<img src=" + imgURL(map) + " map=" + mapIndex + ">"));
    }

    leftMapIndex = $('#left-combobox').val();
    transform();
}

var imgURL = function (map) {
    if (map.hasOwnProperty("googleId")) {
        return "https://drive.google.com/uc?export=download&id=" + map.googleId;
    }
    else {
        return "'src/img/" + map.fileName + "'";
    }
}

var chooseLayers = function () {
    $("img[layer]").each(function() {
        var map = config[townIndex].maps[$(this).attr("map")];
        if (map.dynamic) {
            var layerIndex = parseInt($(this).attr("layer"));
            if (layerIndex > 0) {
                if (map.layers[layerIndex - 1].z * zoomRatio >= 1.5)
                    $(this).css('opacity', '1.0');
                else 
                    $(this).css('opacity', '0.0');
            }
        }
    });
}

var simulateKey = function (e) {
    e.key = e.data;
    keyPressed(e);
}

var startDragX, startDragY, startDragZ;

var startDragging = function (e) {
    e.preventDefault();
    $('.image img').removeClass('with-transition');
    var input = getInput(e);
    startDragX = input.x;
    startDragY = input.y;
    startDragZ = input.z;
    $(document)
        .on('mousemove touchmove', dragging)
        .on('mouseup touchend', stopDragging);
}

var dragging = function (e) {
    e.preventDefault();
    var input = getInput(e);
    if (startDragZ != 0) {
        changeZoom(input.x, input.y, input.z / startDragZ);
        chooseLayers();
    }
    translationX += (input.x - startDragX) / zoomRatio;
    translationY += (input.y - startDragY) / zoomRatio;
    
    startDragX = input.x;
    startDragY = input.y;
    startDragZ = input.z;

    transform();
}

var stopDragging = function (e) {
    e.preventDefault();
    $(document)
        .off('mousemove touchmove', dragging)
        .off('mouseup touchend', stopDragging);
};

var getInput = function (e) {
    if (typeof e.pageX != "undefined") {
        return {
            x: e.pageX,
            y: e.pageY,
            z: 0
        }
    }
    else {
        if (e.touches.length == 1) {
            var t = e.touches[0];
            return {
                x: t.pageX,
                y: t.pageY,
                z: 0
            }
        }
        else if (e.touches.length == 2) {
            var t = e.touches;
            var dx = t[0].pageX - t[1].pageX;
            var dy = t[0].pageY - t[1].pageY;
            return {
                x: (t[0].pageX + t[1].pageX) / 2,
                y: (t[0].pageY + t[1].pageY) / 2,
                z: Math.sqrt(dx * dx + dy * dy)
            }
        }
    }
}

var initMapSlider = function () {
    var $combobox = $('#town-combobox');
    $.each(config, function (index, group) {
        $combobox.append($("<option />").val(index).text(group.town));
    });
    fillComboboxes();
    $('.mapbox').change(comboboxChanged);
    $('#town-combobox').change(fillComboboxes);

    $('.slider').on('mousewheel', scrollZoom);
    $(document).keydown(keyPressed);
    $('#image-container').on('mousedown touchstart', startDragging);

    $(".screen-divider").css("left", "0%");
    $(".left.image").css("width", "0%");
    $(window).on("load", slideSlider)
}

var slideSlider = function() {
    setTimeout(() => {
        $(".screen-divider").css("transition-duration", "1.2s");
        $(".left.image").css("transition-duration", "1.2s");
        $(".screen-divider").css("left", "50%");
        $(".left.image").css("width", "50%");
        setTimeout(() => {
            $(".screen-divider").css("transition-duration", "");
            $(".left.image").css("transition-duration", "");
        }, 1200);
    }, 1000);
}