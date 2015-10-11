
Template.cardItem.helpers({
    layers: function(card) {
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
});

Template.cardLayer.helpers({
    isImageType: function() {
        console.log("isImageTye=", this.data, this.data.type);
        return this.data.indexOf('/') >= 0 ;
    }
});