Session.setDefault('slider', [0, 0]);

Session.setDefault('itemId', 0);

Session.setDefault('card', {});

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
        var id = 0;

        if(selected.id.indexOf('text')) {
            Number(selected.id.match(/[^text_]/g));
        } else {
            Number(selected.id.match(/[^image_]/g));
        }

        var card = Session.get('card');
        card[id].left = selected.style.left;
        card[id].top = selected.style.top;
        Session.set('card', card);
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

    var card = Session.get('card');
    card[id].type = 'text';
    card[id].text = editor.getData();
    Session.set('card', card);

    editor.on('change', function() {
        var card = Session.get('card');
        card[id].text = editor.getData();
        Session.set('card', card);
    });
}

var addImageItem = function(id) {
    $('#image_' + id).mousedown(function() {
        _drag_init(this);
        return true;
    });

    var card = Session.get('card');
    card[id].type = 'image';
    card[id].url = '';
    Session.set('card', card);
}

var addSlider = function(id) {
    this.$('#slider_' + id).noUiSlider({
        start: [0, 0],
        behaviour: 'drag-tap',
        connect: true,
        range: {
            'min': 0,
            'max': 10
        }
    }).on('slide', function(ev, val) {
        // set real values on 'slide' event
        Session.set('slider', val);
    }).on('change', function(ev, val) {
        // round off values on 'change' event
        var card = Session.get('card');
        card[id].start = val[0];
        card[id].end = val[1];
        Session.set('card', card);
    });
}

var addNewLayer = function(id) {
    var card = Session.get('card');
    card[id] = {
        left: 0,
        top: 0,
        start: 0,
        end: 0
    };
    Session.set('card', card);
}

var itemView = function(e) {
    console.log(e);
}

Template.newCard.helpers({
    slider: function() {
        return Session.get('slider');
    }
});

Template.newCard.events({
    'click .save-card': function() {
        var card = Session.get('card');
        console.log(card);
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
