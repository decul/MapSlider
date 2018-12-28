var configs = [];
configs.push({ name:"1888 mapa 2k", fileName:"1888 map 2k.png", w:2462, h:1758, x:1467, y:926, z:0.9238, r:0 });
configs.push({ name:"1944 mapa 10k", fileName:"1944 map 10k.jpg", w:10187, h:9666, x:5738, y:4514, z:0.2, r:0 });
configs.push({ name:"2012 mapa 3k", fileName:"2012 map 3k.png", w:3072, h:2560, x:1552, y:1309, z:0.826, r:2.42 });


var leftMapIndex = 0;
var rightMapIndex = 1;


const zoomDelta = 1.42;
const translationDelta = 100;

var zoomRatio = 1.0;
var translationX = 0.0;
var translationY = 0.0;



var scrollZoom = function(e) {
    e.preventDefault();
    if(e.originalEvent.wheelDelta /120 > 0) {
        zoomRatio *= zoomDelta;
    }
    else{
        zoomRatio /= zoomDelta;
    }
    transform();
}

var keyboard = function(e) {
    e.preventDefault();
    switch(e.key) {
        case 'ArrowUp':
            translationY += translationDelta / zoomRatio;
            break;

        case 'ArrowDown':
            translationY -= translationDelta / zoomRatio;
            break;

        case 'ArrowRight':
            translationX -= translationDelta / zoomRatio;
            break;

        case 'ArrowLeft':
            translationX += translationDelta / zoomRatio;
            break;

        case '+':
            zoomRatio *= zoomDelta;
            break;

        case '-':
            zoomRatio /= zoomDelta;
            break;
    }
    transform();
}

var transform = function() {
    transformSide('left', configs[leftMapIndex]);
    transformSide('right', configs[rightMapIndex]);
}

var transformSide = function(side, conf) {
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();

    var zoom = zoomRatio * conf.z;

    var transX = (-conf.w + screenWidth) / 2;     // Allign picture's and screen's middle points
    transX += (conf.w / 2.0 - conf.x) * zoom;     // Drag city hall to middle poin
    transX += translationX * zoomRatio;                // Drag map to place that user wants to watch

    var transY = (-conf.h + screenHeight) / 2;
    transY += (conf.h / 2.0 - conf.y) * zoom;
    transY += translationY * zoomRatio;

    $('.' + side + '.image img').css('transform', ' translate3d(' + transX + 'px, ' + transY + 'px, 0px) scale(' + zoom + ') rotate(' + conf.r + 'deg)');
}

var rotateVectors = function() {
    $.each(configs, function(conf) {
        var angle = conf.r * (Math.PI/180);
        var x = conf.w / 2 - conf.x;
        var y = conf.h / 2 - conf.y;
        conf.x = conf.w / 2 - (x * Math.cos(angle) - y * Math.sin(angle));
        conf.y = conf.h / 2 - (x * Math.sin(angle) + y * Math.cos(angle));
    });
}

var fillComboboxes = function() {
    var $comboboxes = $('.combobox');
    $.each(configs, function(index, conf) {
        $comboboxes.append($("<option />").val(index).text(conf.name));
    });
    $('#left-combobox').val(leftMapIndex);
    $('#right-combobox').val(rightMapIndex);
    comboboxChanged();
}

var comboboxChanged = function() {
    leftMapIndex = $('#left-combobox').val();
    rightMapIndex = $('#right-combobox').val();

    $('.left.image img').attr("src", "src/img/" + configs[leftMapIndex].fileName);
    $('.right.image img').attr("src", "src/img/" + configs[rightMapIndex].fileName);

    transform();
}

var initMapSlider = function() {
    $('.combobox').change(comboboxChanged);
    fillComboboxes();

    $('.slider').on('mousewheel', scrollZoom);
    $(document).keydown(keyboard);

    rotateVectors();
    transform();
}