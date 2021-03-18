// Sticky Header on scroll

function autoscrollHeader() {
    const body = document.body;
    const header = document.querySelector('header');
    const navMenu = document.querySelector('.primary-nav-wrapper');
    const scrollUp = "scroll-up";
    const scrollDown = "scroll-down";
    let lastScroll = 0;
     
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      const menu = document.querySelector(".page-header");
      if (currentScroll < header.offsetHeight) {
        body.classList.remove(scrollUp);
        return;
      }
      if (currentScroll > header.offsetHeight) {
        if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        // down
        body.classList.remove(scrollUp);
        body.classList.add(scrollDown);  
        // console.log(header.offsetHeight);
        }
        if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
          // up
          body.classList.remove(scrollDown);
          body.classList.add(scrollUp);
        }
      }
      lastScroll = currentScroll;
    });
  }
  function autoscrollTrigger() {
    var w = window.innerWidth;
      if (w > 1023) {
        autoscrollHeader();
      }
  }
  autoscrollTrigger();  
  

  // mobile menu (mmenu)
  function mobileMenu() {
      document.addEventListener(
          "DOMContentLoaded", () => {
              const menu = new Mmenu( ".primary-nav-wrapper", {
                  // options
                  slidingSubmenus: false,
                  "extensions": [
                      "popup"
                   ],
                   "navbars": [
                          {
                             "position": "bottom",
                             "content": [
                                typeof socialMediaPHPcode != 'undefined' ? socialMediaPHPcode : ''
                             ]
                          }
                       ]
              });
              const api = menu.API;
              const panel = document.querySelector( ".submenu-div" );
              api.openPanel( panel );
              document.querySelector( "#my-open-button" )
                  .addEventListener(
                      "click", ( evnt ) => {
                          evnt.preventDefault();
                          api.open();
                          api.close();
                      }
                  );

              /* Close menu box on submenu click */
              panel.querySelectorAll('li').forEach((liElm) => {
                liElm.addEventListener(
                    "click", () => {
                      api.open();
                      api.close();
                    }
                  );
              });
                  
            }
        );
    }
   
function maxWidthWrapper() {
                if ($(":root").css('--max-width') != null) { 
                    console.log("max-width = predefined width");
                
                } 
                else { 
                    console.log("max-width = 100%");
                $("#wrapper").addClass("full-width-wrapper");
                }
            }
            maxWidthWrapper();
    
    function resizeFunction() {
      var windowWidth = window.innerWidth;
      if (windowWidth < 1023) {
        mobileMenu();
        // calculation for panel height in mobile viewport
          window.onresize = window.onload = function() {
          var headerOffestHeight = document.querySelector('header').offsetHeight;
          var panelNew = document.querySelector('.mm-menu_popup');
          var bottomSocialIconsHeight = document.querySelector('.mm-navbars_bottom').offsetHeight;
          var width = window.innerWidth;
          var height = window.innerHeight;
          panelNew.style.width = width + "px";
          // panelNew.style.height = (height - bottomSocialIconsHeight) + "px";
          panelNew.style.height = (height - headerOffestHeight + 10) + "px";
          // panelNew.style.height = height  + "px";
        }
      }
    }
    resizeFunction();


