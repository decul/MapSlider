var configs = [];
configs.push({ name:"1888 mapa 2k", fileName:"1888 map 2k.png", w:2462, h:1758, x:1467, y:926, z:0.9238, r:0 });
configs.push({ name:"1944 mapa 10k", fileName:"1944 map 10k.jpg", w:10187, h:9666, x:5738, y:4514, z:0.2, r:0 });
configs.push({ name:"2012 mapa Śródmieście", fileName:"2012 map center.png", w:3072, h:2560, x:1552, y:1309, z:0.826, r:2.42 });
configs.push({ name:"2012 mapa szeroka", fileName:"2012 map wide.png", w:3584, h:3584, x:1952.36, y:1674.21, z:8.2484, r:2.42 })
configs.push({ name:"1944 foto Śródmieście", fileName:"1944_7 foto center.png", w:3480, h:3532, x:1989, y:1462, z:0.5226, r:-59.2 })
configs.push({ name:"1944 foto 1000-lecia", fileName:"1944_6.png", w:3461, h:3515, x:1445.8, y:2857.39, z:0.53049, r:-59.2 })
configs.push({ name:"1944 foto Załęże", fileName:"1944_4.png", w:3532, h:3470, x:-187.24, y:4881.7, z:0.53049, r:-60 })
configs.push({ name:"1944 foto Zalesie", fileName:"1944_8.png", w:3467, h:3470, x:270.17, y:-1042.51, z:0.59981 , r:-58.1 })


var leftMapIndex = 7;
var rightMapIndex = 3;


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

var initMapSlider = function() {
    $('.combobox').change(comboboxChanged);
    fillComboboxes();

    $('.slider').on('mousewheel', scrollZoom);
    $(document).keydown(keyboard);

    transform();
}