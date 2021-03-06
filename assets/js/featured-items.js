/* Featured Products Section */
$(function () {
    const model = {
        carousels: [{
            selector: '.gallery-style .gallery-menu',
            options: {
                loop: true,
                nav: false,
                autoplay: false,
                autoplayTimeout: 5000,
                smartSpeed: 450,
                margin: 40,
                autoWidth: true,
                onDragged: function () {
                    $('body').css('overflow', 'auto');
                },
                onDrag: function () {
                    $('body').css('overflow', 'hidden');
                },
                responsive: {
                    0: {
                        items: 2,
                        stagePadding: 20,
                        margin: 20
                    },
                    480: {
                        items: 2,
                        stagePadding: 40,
                        margin: 25
                    },
                    768: {
                        items: 5,
                        stagePadding: 30,
                        margin: 30
                    },
                    991: {
                        items: 6
                    },
                    1200: {
                        items: 6
                    },
                    1920: {
                        items: 6
                    }
                }
            }
        }, {
            selector: '.gallery-style .gallery-carousel',
            options: {
                loop: false,
                navText: ['<i class="icofont-simple-left"></i>', '<i class="icofont-simple-right"></i>'],
                nav: true,
                dots: false,
                autoplay: false,
                autoplayTimeout: 5000,
                smartSpeed: 600,
                margin: 20,
                lazyLoad: false,
                onDragged: function () {
                    $('body').css('overflow', 'auto');
                },
                onDrag: function () {
                    $('body').css('overflow', 'hidden');
                },
                responsive: {
                    0: {
                        items: 2,
                        slideBy: 2,
                        nav: false,
                        margin: 12
                    },
                    768: {
                        items: 3,
                        slideBy: 3
                    },
                    991: {
                        items: 3,
                        slideBy: 3
                    },
                    1200: {
                        items: 4,
                        slideBy: 4
                    },
                    1920: {
                        items: 4,
                        slideBy: 4
                    }
                }

            }
        }]
    }
    if (typeof $.fn.owlCarousel == 'function') {
        for (const { selector, options } of model.carousels) {
            $(selector).owlCarousel(options);

            // disable scroll
            $(selector).on('drag.owl.carousel', function (event) {
                document.ontouchmove = function (e) {
                    console.log('drag')
                    e.preventDefault();
                }
            });
    
            // enable scroll
            $(selector).on('dragged.owl.carousel', function (event) {
                document.ontouchmove = function (e) {
                    console.log('dragged')
                    return true;
                }
            });
        }
    }
});
