
var layers;

Template.cardItem.helpers({
    layers: function(card) {
        layers = card.layers;
        console.log(layers);
        return card.layers;
    }
});

Template.cardItem.onRendered(function() {
  $('#carousel').slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    adaptiveHeight: true
  });
    var card = this.data;
    var frame = 0;
    console.log(layers);
    var interval = setInterval(function() {

        for (var i in layers) {
            var layer = layers[i];
            var visible = layer.framesBegin <= frame && layer.framesEnd > frame;
            console.log("layer", layer, frame, i, layer.framesBegin, layer.framesEnd, visible);
            if (visible) {
                $('.layer-' + i).show();
            } else {
                $('.layer-' + i).hide();
            }
        }
        ++ frame;
        if (frame == 10) clearInterval(interval);
    }, 1000);
});

Template.cardLayer.helpers({
    isImageType: function() {
        console.log("isImageTye=", this.data, this.data.type);
        return this.data.indexOf('/') >= 0 ;
    }
});