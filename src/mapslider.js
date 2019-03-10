var configs = [];
configs.push({ name:"1888", fileName:"1888.jpg", w:2462, h:1758, x:1467, y:926, z:0.9238, r:0 });
configs.push({ name:"1944", fileName:"1944.jpg", w:4662, h:4345, x:2658.58, y:2040.92, z:0.4, r:0 });
configs.push({ name:"2012 Śródmieście", fileName:"2012 center.png", w:3072, h:2560, x:1552, y:1309, z:0.826, r:2.42 });
configs.push({ name:"2012 Przedmieścia", fileName:"2012 wide.jpg", w:3584, h:3584, x:1952.36, y:1674.21, z:8.2484, r:2.42 })
configs.push({ name:"Foto 1944 Śródmieście", fileName:"1944_7.jpg", w:3468, h:3464, x:2005.42, y:1433.85, z:0.5226, r:-59.2 })
configs.push({ name:"Foto 1944 1000-lecia", fileName:"1944_6.jpg", w:3461, h:3462, x:1468.56, y:2844.45, z:0.53049, r:-59.2 })
configs.push({ name:"Foto 1944 Załęże", fileName:"1944_4.jpg", w:3472, h:3470, x:-219.24, y:4885.16, z:0.53049, r:-60 })


var leftMapIndex = 1;
var rightMapIndex = 2;


const zoomDelta = 1.42;
const translationDelta = 100;

var zoomRatio = 1.0;
var translationX = 0.0;
var translationY = 0.0;

var debug = false;



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

var keyPressed = function(e) {
    if (e.key.match("^F"))
        return;

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

    if (debug) {
        switch(e.key) {
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

var simulateKey = function(e) {
    e.key = e.data;
    keyPressed(e);
}

var initMapSlider = function() {
    $('.combobox').change(comboboxChanged);
    fillComboboxes();

    $('.slider').on('mousewheel', scrollZoom);
    $(document).keydown(keyPressed);

    $('#zoom-out').bind("touchstart", "-", simulateKey);
    $('#zoom-in').bind("touchstart", "+", simulateKey);
    $('#move-up').bind("touchstart", "ArrowUp", simulateKey);
    $('#move-down').bind("touchstart", "ArrowDown", simulateKey);
    $('#move-left').bind("touchstart", "ArrowLeft", simulateKey);
    $('#move-right').bind("touchstart", "ArrowRight", simulateKey);

    transform();
}