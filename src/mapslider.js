var configs = [
    { w: 2462, h: 1758, x: 1467.000, y:  926.000, z: 0.9238, r:   0.0, name: "1888", fileName: "1888.jpg" },
    { w: 4662, h: 4345, x: 2658.580, y: 2040.920, z: 0.4000, r:   0.0, name: "1944", fileName: "1944.jpg" },
    { w: 1643, h: 1853, x: 799.0740, y: 931.1710, z: 1.7260, r:  -1.0, name: "1957", fileName: "1957.jpg" },
    { name: "2020", dynamic: true, layers: [
        { w:  760, h:   985, x:  364.202, y:  521.066, z: 5.6121, r:  0.0, name: "2020 Low resolution", fileName: "2020_small.jpg" },
        { w: 2532, h:  3281, x: 1212.104, y: 1738.038, z: 1.6833, r:  0.0, name: "2020 Przedmieścia", fileName: "2020_subs.jpg" },
        { w: 2462, h:  2239, x: 1390.483, y: 1024.922, z: 0.8409, r:  0.0, name: "2020 Centrum", fileName: "2020_center.jpg" }
    ]},
    { w:  377, h:  317, x: 597.0400, y: -641.550, z: 1.4330, r:   2.9, name: "1954-73 Powstańców W-wy", fileName: "1954-73 powstańców.jpg" },
    { w: 3468, h: 3464, x: 2005.420, y: 1433.850, z: 0.5226, r: -59.2, name: "Foto 1944 Śródmieście", fileName: "1944_7.jpg" },
    { w: 3461, h: 3462, x: 1468.560, y: 2844.450, z: 0.5305, r: -59.2, name: "Foto 1944 1000-lecia", fileName: "1944_6.jpg" },
    { w: 3472, h: 3470, x: -219.240, y: 4885.160, z: 0.5305, r: -60.0, name: "Foto 1944 Załęże", fileName: "1944_4.jpg" },
    { w: 5857, h: 4783, x: 5579.760, y: -1926.25, z: 0.3140, r:  44.1, name: "Foto 1944 Dąbrowskiego", fileName: "1944_1.jpg" },
    { name: "Foto 2020", dynamic: false, layers: [
        { w: 4451, h: 11292, x: 2170.526, y: 6038.578, z: 0.4787, r: 31.3, name: "Foto 2020 skos", googleId: "1FB4rl-9_AvoK-ul_pZS59iYDnqJsd04B" },
        { w: 3213, h:  3214, x: 1806.086, y: 1585.977, z: 0.4787, r:  0.0, name: "Foto 2020 centrum", googleId: "1x57W4M-938ElmUKcU0X08uSWGL8U4fdn" }
    ]}
];


const minX = -2233.0;
const maxX = 2055.0;
const minY = -2615.0;
const maxY = 2941.0;
const minZ = 0.0625;
const maxZ = 4.0;


var leftMapIndex = 1;
var rightMapIndex = 3;


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
            chooseLayers();
            break;

        case '-':
            $('.image img').addClass('with-transition');
            zoomRatio /= zoomDelta;
            chooseLayers();
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
    limitTransformations();

    var screenWidth = $(window).width();
    var screenHeight = $(window).height();

    $(".image img").each(function() {
        var conf = configs[$(this).attr("map")];
        if ($(this).is("[layer]")) 
            conf = conf.layers[$(this).attr("layer")];

        var zoom = zoomRatio * conf.z;

        var transX = (-conf.w + screenWidth) / 2;     // Allign picture's and screen's middle points
        transX += (conf.w / 2.0 - conf.x) * zoom;     // Drag city hall to middle poin
        transX += translationX * zoomRatio;           // Drag map to place that user wants to watch

        var transY = (-conf.h + screenHeight) / 2;
        transY += (conf.h / 2.0 - conf.y) * zoom;
        transY += translationY * zoomRatio;

        $(this).css('transform', ' translate3d(' + transX + 'px, ' + transY + 'px, 0px) scale(' + zoom + ') rotate(' + conf.r + 'deg)');
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
    var $comboboxes = $('.combobox');
    $.each(configs, function (index, conf) {
        $comboboxes.append($("<option />").val(index).text(conf.name));
    });
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

    var config = configs[mapIndex];

    if (config.hasOwnProperty("layers")) {
        $(config.layers).each(function(layerIndex) {
            imgHolder.append($("<img src=" + imgURL(this) + " map=" + mapIndex + " layer=" + layerIndex + ">"));
        })
    }
    else {
        imgHolder.append($("<img src=" + imgURL(config) + " map=" + mapIndex + ">"));
    }

    leftMapIndex = $('#left-combobox').val();
    transform();
}

var imgURL = function (conf) {
    if (conf.hasOwnProperty("googleId")) {
        return "https://drive.google.com/uc?export=download&id=" + conf.googleId;
    }
    else {
        return "'src/img/" + conf.fileName + "'";
    }
}

var chooseLayers = function () {
    $("img[layer]").each(function() {
        var map = configs[$(this).attr("map")];
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
    $('.combobox').change(comboboxChanged);
    fillComboboxes();

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