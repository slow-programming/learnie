Session.setDefault('itemId', 0);
Session.setDefault('layers', []);

var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

Template.newCard.onRendered(function() {
});

// Will be called when user dragging an element
var _move_elem = function(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        var left = x_pos - x_elem;
        var top = y_pos - y_elem;

        if( left < 0 ) left = 0;
        if( top < 0 ) top = 0;

        if( left > 640 ) left = 640;
        if( top > 480 ) top = 480;

        selected.style.left = left + 'px';
        selected.style.top = top + 'px';
    }
}

// Destroy the object when we are done
var _destroy = function() {
    if(selected) {
        var id = selected.id;
        var matchResult;

        if(id.indexOf('text') >= 0) {
            id = id.match(/[^text_]/g);
        } else {
            id = id.match(/[^image_]/g);
        }

        id = id.join('');

        var layers = Session.get('layers');
        layers[id].itemLeft = selected.style.left;
        layers[id].itemTop = selected.style.top;
        Session.set('layers', layers);
    }
    selected = null;
}

var _drag_init = function(elem) {
    // Store the object of the element which needs to be moved
    selected = elem;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

document.onmousemove = _move_elem;
document.onmouseup = _destroy;

var addTextItem = function(id) {
    CKEDITOR.disableAutoInline = true;
    var editor = CKEDITOR.inline( 'text_' + id );
    $('#text_' + id).mousedown(function() {
        _drag_init(this);
        return true;
    });

    var layers = Session.get('layers');
    layers[id].type = 'text';
    layers[id].data = editor.getData();
    Session.set('layers', layers);

    editor.on('change', function() {
        var layers = Session.get('layer');
        layers[id].data = editor.getData();
        Session.set('layer', layer);
    });
}

var addImageItem = function(id) {
    $('#image_' + id).mousedown(function() {
        _drag_init(this);
        return true;
    });

    var layers = Session.get('layers');
    layers[id].type = 'image';
    layers[id].url = '';
    Session.set('layers', layers);
}

var addSlider = function(id) {
    this.$('#slider_' + id).noUiSlider({
        start: [0, 0],
        behaviour: 'drag-tap',
        connect: true,
        step: 1,
        range: {
            'min': 0,
            'max': 10
        }
    }).on('slide', function(ev, val) {
    }).on('change', function(ev, val) {
        // round off values on 'change' event
        var layers = Session.get('layers');
        layers[id].frameBegin = Number(val[0]);
        layers[id].frameEnd = Number(val[1]);
        Session.set('layers', layers);
    });
}

var addNewLayer = function(id) {
    var layers = Session.get('layers');
    layers.push({
        itemLeft: '0px',
        itemTop: '0px',
        frameBegin: 0,
        frameEnd: 0
    });
    Session.set('layers', layers);
}

var itemView = function(e) {
    console.log(e);
}

Template.newCard.helpers({
});

Template.newCard.events({
    'click .save-card': function() {
        var lesson = Lessons.findOne();
        var layers = Session.get('layers');
        var card = {
            order: lesson.cards | 0,
            lessonId: lesson._id,
            layers: layers
        }
        Cards.insert(card);
        Lessons.update(lesson._id, {$inc: {cards: 1}});

        Session.set('itemId', 0);
        Session.set('layers', []);

        Router.go('lessonShow', {_id:lesson._id});
    },
    'click .new-text': function() {
        var id = Session.get('itemId');
        var textItem = '<div class="text-item" id="text_' + id + '" contenteditable="true">Text' + id + '</div>';
        var slider = '<div id="slider_' + id + '"></div>';
        $('.preview').append(textItem);
        $('#slider').append(slider);

        addNewLayer(id);
        addTextItem(id);
        addSlider(id);

        Session.set('itemId', id+1);
    },
    'click .new-image': function() {
        var id = Session.get('itemId');
        var imageItem = '<div class="image-item" id="image_' + id + '">Image' + id + '</div>';;
        var slider = '<div id="slider_' + id + '"></div>';
        $('.preview').append(imageItem);
        $('#slider').append(slider);

        addNewLayer(id);
        addImageItem(id);
        addSlider(id);

        Session.set('itemId', id+1);
    }
});
