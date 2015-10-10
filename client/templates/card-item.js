Template.cardItem.helpers({
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