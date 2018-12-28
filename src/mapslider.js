
var sync = {}
sync["m1944m10k"] = { w:10187, h:9666, x:5738, y:4514, z:0.2, r:0 };
sync["m2012m3k"] = { w:3072, h:2560, x:1551, y:1309, z:0.826, r:2.42 };

const zoomDelta = 1.42;
const translationDelta = 100;

var zoomRatio = 1.0;
var translationX = 0.0;
var translationY = 0.0;

var scrollZoom = function(e) {
    if(e.originalEvent.wheelDelta /120 > 0) {
        zoomRatio *= zoomDelta;
    }
    else{
        zoomRatio /= zoomDelta;
    }
    transform();
}

var keyboard = function(e) {
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

        default:
            console.log(e);
            break;
    }
    transform();
}

var transform = function() {
    transformSide('left', sync["m1944m10k"]);
    transformSide('right', sync["m2012m3k"]);
    
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
    for(var conf in Object.values(sync)){
        //var conf = sync[key];
        var angle = conf.r * (Math.PI/180);
        var x = conf.w / 2 - conf.x;
        var y = conf.h / 2 - conf.y;
        conf.x = x * Math.cos(angle) - y * Math.sin(angle);
        conf.y = x * Math.sin(angle) + y * Math.cos(angle);
    }
}

var initMapSlider = function() {
    $('.slider').on('mousewheel', scrollZoom);
    $(document).keydown(keyboard);

    rotateVectors();
    transform();
}