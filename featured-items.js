/* Featured Products Section */
$(function () {
    const model = {
        carousels: [{
            selector: '.gallery-menu',
            options: {
                loop: true,
                nav: false,
                autoplay: false,
                autoplayTimeout: 5000,
                smartSpeed: 450,
                margin: 0,
                responsive: {
                    0: {
                        items: 2,
                        stagePadding: 20,
                        autoWidth: true
                    },
                    480: {
                        items: 2,
                        stagePadding: 40,
                        autoWidth: true
                    },
                    768: {
                        items: 5,
                        center: true,
                        stagePadding: 30,
                    },
                    991: {
                        items: 6
                    },
                    1200: {
                        items: 6,
                    },
                    1920: {
                        items: 6,
                    }
                }
            }
        }, {
            selector: '.gallery-carousel',
            options: {
                loop: false,
                // navText: ['<svg class="zds-icon RC794g _98USAM DlJ4rT H3jvU7" height="1em" width="1em" focusable="false" fill="currentColor" viewBox="0 0 24 24" aria-hidden="false" aria-labelledby="arrow-left-5uip1" role="img"><title id="arrow-left-5uip1">arrow-left</title><path d="M22.8 11.25H1.95l7.72-7.72A.75.75 0 008.6 2.47L.66 10.41c-.88.88-.88 2.3 0 3.18l7.94 7.94a.75.75 0 001.06 0c.3-.3.3-.77 0-1.06l-7.72-7.72H22.8a.75.75 0 000-1.5z"></path></svg>', '<svg class="zds-icon RC794g _98USAM DlJ4rT H3jvU7" height="1em" width="1em" focusable="false" fill="currentColor" viewBox="0 0 24 24" aria-hidden="false" aria-labelledby="arrow-right-zmmc4" role="img"><title id="arrow-right-zmmc4">arrow-right</title><path d="M.44 12c0 .41.34.75.75.75h20.87l-7.72 7.72a.75.75 0 001.06 1.06l7.94-7.94c.88-.88.88-2.3 0-3.18L15.4 2.47a.75.75 0 00-1.06 1.06l7.72 7.72H1.2a.75.75 0 00-.75.75z"></path></svg>'],
                navText: ['<i class="icofont-simple-left"></i>', '<i class="icofont-simple-right"></i>'],
                nav: true,
                dots: false,
                autoplay: false,
                autoplayTimeout: 5000,
                smartSpeed: 600,
                margin: 20,
                lazyLoad: false,
                // onTranslate: toggleCarouselControlAnime,
                // onTranslated: toggleCarouselControlAnime,
                responsive: {
                    0: {
                        items: 2
                    },
                    768: {
                        items: 3
                    },
                    991: {
                        items: 3
                    },
                    1200: {
                        items: 4
                    },
                    1920: {
                        items: 4
                    }
                }

            }
        }]
    }
    if (typeof $.fn.owlCarousel == 'function') {
        for (const { selector, options } of model.carousels) {
            $(selector).owlCarousel(options);
        }
    }

    // $(".royalSlider").royalSlider({
    //     // options go here
    //     // as an example, enable keyboard arrows nav
    //     imageScaleMode: none
    // });  

    function toggleCarouselControlAnime() {
        const control = $(this.$element).find('.owl-nav');

        control.toggleClass('fadeout');
    }
});
