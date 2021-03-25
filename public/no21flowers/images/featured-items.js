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
                lazyLoad: true,
                onDragged: function () {
                    $('body').css('overflow', 'auto');
                },
                onDrag: function () {
                    $('body').css('overflow', 'hidden');
                },
                items: 9,
                // onInitialized: fixOwl,
                // onRefreshed: fixOwl
                // slideBy: 4,
                // responsive: {
                //     0: {
                //         items: 2,
                //         margin: 20
                //     },
                //     480: {
                //         items: 2,
                //         margin: 25
                //     },
                //     768: {
                //         items: 5,
                //         margin: 30
                //     },
                //     991: {
                //         items: 6
                //     },
                //     1200: {
                //         items: 6
                //     },
                //     1920: {
                //         items: 6
                //     }
                // }
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
        
        // $(model.carousels[0].selector).owlCarousel(model.carousels[0].options);
        // $(model.carousels[0].selector).trigger('refresh.owl.carousel');
        // $(model.carousels[1].selector).owlCarousel(model.carousels[1].options);
        for (const { selector, options } of model.carousels) {
            // $(selector).owlCarousel(options).trigger('refresh.owl.carousel');
            const promise = new Promise((resolve, reject) => {
                $(selector).owlCarousel(options);
                resolve();
            });

            promise.then(() => {
                setTimeout(() => {
                    $(selector).trigger('refresh.owl.carousel');                    
                }, 50);
            });

            // disable scroll
            $(selector).on('drag.owl.carousel', function (event) {
                document.ontouchmove = function (e) {
                    e.preventDefault();
                } 
            });
    
            // enable scroll
            $(selector).on('dragged.owl.carousel', function (event) {
                document.ontouchmove = function (e) {
                    return true;
                }
            });
        }
    }

    function fixOwl(){
        // var $stage = $('.owl-stage'),
        //     stageW = $stage.width(),
        //     $el = $('.owl-item'),
        //     elW = 0;
        // $el.each(function() {
        //     elW += $(this).width()+ +($(this).css("margin-right").slice(0, -2))
        // });
        // if ( elW > stageW ) {
        //     $stage.width( elW );
        // };
        // $('.gallery-style .gallery-menu').trigger( 'refresh.owl.carousel' );
        var owlData = $(this.$element).data('owl.carousel');
        console.log(this, owlData);
        $('.gallery-style .gallery-menu').trigger('change.owl.carousel', {
            mouseDrag: false,
            touchDrag: false,
            pullDrag: false
          });
    }
});
