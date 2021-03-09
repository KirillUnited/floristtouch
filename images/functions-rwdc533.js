var cart_ajax_url = '/shop/ajax/cartform';
var delivery_ajax_url = '/shop/ajax/delivery';

$(function () {

  console.log('%cfunctions.rwd.js called', 'color:green');
  
  var pull = $('.categories.first .current');
  var menu = $('.categories.first ul');
  var pullMainMenu = $('.menu-toggle');
  var MainMenu = $('header nav.main ul');

  $(pull).on('click', function (e) {
    e.preventDefault();
    if ($('.categories.first ul').css('display') == 'none') {
      menu.css('display', 'block');
    } else {
      menu.css('display', 'none');
    }
  });

  $(pullMainMenu).on('click', function (e) {
    e.preventDefault();
    if ($('header nav.main ul').css('display') == 'none') {
      MainMenu.css('display', 'block');
    } else {
      MainMenu.css('display', 'none');
    }
  });

  $('.menu-toggle  p.current').text($('header nav.main ul li.active a span').text());
  // $('.categories.first .current').text($('.categories.first ul li a.active').text());
  // $('.categories.first .current .activecat').text($('.categories.first ul li a.active').text());
  $('.categories.first .current .activecat').html('Select category');

  $('#top-menu h3, #top-menu .current, .jumplist.first .current').click(function () {
    $(this).parent().toggleClass('open');
  });

  /* Toggle product list list/collage view */
  $(".btn-grid").on("click", function (e) {
    var postData = {op: 'set_grid_option', grid_opt: $(this).attr('data-id')};
    $.post(
      cart_ajax_url, 
      postData, 
      function (response) {
        console.log(response);
        if (response.ok) {
          window.location.reload();
          return;
        }      
    }, "json");
  });

  /* Add item to cart */
  $(".item-form").on("submit", function (e) {
    e.preventDefault();
    var that = $(this);
    var data = $(this).serialize() + "&op=add";
    var ask_to_proceed = $(this).data("proceed-to-checkout") ? confirm("Proceed to checkout?") : true;

    var hasError = false;

    var custom_price = $(this).find('input[name="custom_price"]').val();
    var custom_price_type = $(this).find('input[name="custom_price"]').attr('type');
    var price_option = $(this).find('[name="price_option"]').val();
    var gift_card_del = $(this).find('select[name="gift_card_delivery_method"]').val();
    var min_price = parseFloat($(this).find('input[name="min_price"]').val());

    var prod_type = $(this).find('input[name="prod_type"]');
    var is_upsell = false;

    if (typeof prod_type != 'undefined' && $(prod_type).val() == 'upsell') {

      is_upsell = true;
      hasError = false;
      if (price_option == '') {
        $(this).find('.error-msg').html('Please select a price.');
        hasError = true;
      }

    } else if (custom_price == '' && price_option == '') {

      var custom_amt_type = $(this).find('input[name="custom_price"]').attr('type');
      if (custom_amt_type == 'hidden') {
        $(this).find('.error-msg').html('Please select a price.');
      } else {
        $(this).find('.error-msg').html('Please select a price or enter a custom amount.');
      }      
      hasError = true;

    } else if (price_option == '' && !(custom_price >= min_price && custom_price <= 5000)) {
      
      $(this).find('.error-msg').html("Enter a valid amount between "+ min_price +" and 5,000");
      hasError = true;

    } else if (typeof price_option == 'undefined' && custom_price_type != 'hidden' 
      && custom_price_type != 'undefined' && !isNaN(min_price) &&
      !(custom_price >= min_price && custom_price <= 5000)) {
      
      $(this).find('.error-msg').html("Enter a valid amount between "+ min_price +" and 5,000");
      hasError = true;

    } else if (gift_card_del == 'gc') {

      $(this).find('.error-msg').html("Select delivery method from list");
      hasError = true;
    }

    if (!hasError) {
      console.log('Valid form');
      data += "&is_upsell="+is_upsell;
      $.post(cart_ajax_url, data, function (response) {
        if (response.ok) {

          /* If upsell, no need to refresh page */
          if (is_upsell) {
            $('.error-msg').html('');
            var upd_count = parseInt(response.item_count);
            var msgHtml = '<div class="upg-info"><br>&#x2714;'+ upd_count +' in your basket</div>';
            var upg_info = $(that).parents('.product-info-wrapper:eq(0)').find('.upg-info');
            console.log(upg_info);            
            if (!upg_info || !upg_info.length) {   
              $(that).find('.upg-info').hide();           
              $(msgHtml).insertAfter(that);              
            } else {
              $(upg_info).html(msgHtml);
            }
            $(that).find('.upg-info').slideDown(800, 'easeInQuad');
            return;
          }          

          if (ask_to_proceed) {
            window.location.href = response.next;
          }
          return;
        } else {
          // alert(response.msg);
          $(that).find('.error-msg').html('<br/>'+response.msg);
        }        
      }, "json");
    }

    return false;
  });

  $("#cart-empty").on("click", function (e) {
    e.preventDefault();

    var customModal = new CustomModal($('#confirmModal'));
    customModal.open("Are you sure you want to remove all items from your cart?");

    customModal.confirm
      .then(
        function(resolve) {
          console.log('Empty basket?', resolve);
          customModal.close();
          if (resolve) {
            $.post(cart_ajax_url, {op: "empty"}, function (response) {
              if (response.ok) {
                location.reload();
                return;
              }
              alert(response.msg);
            }, "json");
          } else {
            return false;
          }
        },
        function(reject) {
          console.log('Confirm reject:', reject);
        }
      );
    
    return false;

    // if (!confirm("Are you sure you want to remove all items from your cart?")) {
    //   return false;
    // }

    // return false;
  });

  $(".basket-quantity select").on("change", function () {
    var _id = $(this).data("id");
    var _qty = $(this).val();

    $.post(cart_ajax_url, {op: "qty", qty: _qty, item_id: _id}, function (response) {
      if (response.ok) {
        location.reload();
        return;
      }
      alert(response.msg);
    }, "json");
  });

  $(".basket-remove").on("click", function (e) {
    e.preventDefault();
    var _id = parseInt($(this).data("id"), 10);

    var customModal = new CustomModal($('#confirmModal'));
    customModal.open("Are you sure you want to remove this item?");

    customModal.confirm
      .then(
        function(resolve) {
          console.log('Confirm resolve:', resolve);
          if (resolve) {
            $.post(cart_ajax_url, {op: "remove", remove: _id}, function (response) {
              if (response.ok) {
                customModal.close();
                location.reload();
                return;
              }
              alert(response.msg);
            }, "json");
          } else {
            customModal.disableActionBtns(false);
            customModal.close();
            return false;
          }
        },
        function(reject) {
          console.log('Confirm reject:', reject);
        }
      );
    
    return false;
  });

  function submitDiscountCode() {
    var _code = $("#discount_code").val();
    if (_code.length == 0) {
      return false;
    }

    $.post(cart_ajax_url, 
      {
        op: "code", 
        code: _code,
        email: custEmail
      }, function (response) {
      if (response.ok) {
        $('.code-error').hide();
        location.reload();
        return;
      }
      $("#discount_code").val('');
      // alert(response.msg);
      $('.code-error').html(response.msg).show();
    }, "json");
  }

  $("#submit_discount_code").on("click", function (e) {
    e.preventDefault();
    submitDiscountCode();
  });

  $("#shoppingcart").on("submit", function (e) {
    var _code = $("#discount_code").val();
    if (_code.length == 0) {
      return true;
    }

    submitDiscountCode();
    return false;
  });

  $('.basket-view').click(function () {
    $cartimage = $('#cart-image img').attr('src');
    $basketimage = $(this).parent().find('input[name="itemimage[]"]').val();

    $('#cart-image').css('background-image', 'url(../images/imageframe.png)');
    $('#cart-image img').attr('src', $basketimage);
    return false;
  });

  if ($('input[name="delivery_date"]').length) {
    // date = new Date();

    if (typeof serverDate != 'undefined') {
      date = new Date(serverDate);
    } else {
      date = new Date();
    }

    // if (typeof tz != 'undefined') {
    //   date = date.toLocaleString("en-GB", {timeZone: tz});
    // }

    console.log('Current date:', date);
    
    todaysdate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    today_str = todaysdate.toDateString();

    dd = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    mm = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    yyyy = date.getFullYear();
    $dateinput = selectDate();

    $('#dateselect').datepicker
    ({
      firstDay: 1,
      defaultDate: $dateinput,
      dateFormat: "yy-mm-dd",
      changeMonth: true,
      changeYear: true,
      gotoCurrent: false,
      beforeShowDay: removeDays,
      yearRange: yyyy + ":" + (yyyy + 2),
      onSelect: function (value, date) {
        $('input[name="delivery_date"]').val(value);
        var sel = value;
        var tdy = yyyy + '-' + mm + '-' + dd;
        console.log('Selected: ', sel);
        console.log('Today: ', tdy);
        // var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
        // var selected = new Date(date).getTime();
        var calToday = false;
        if (tdy == sel) {
          console.log('today');
          calToday = true;
          if (typeof hide_sameday_am != 'undefined') {
            console.log('hide_sameday_am:', hide_sameday_am);
            $('select[name="delivery_time"] option[value="AM"]')
              .attr('disabled', hide_sameday_am == 1);
            $('select[name="delivery_time"]').val('');
          }
        } else {
          console.log('not today');
          $('select[name="delivery_time"] option[value="AM"]')
              .attr('disabled', false);
        }
        /* For collection mandatory, populate shop time slots */
        if (typeof mandatory_collect_time != 'undefined' && 
          typeof daywise_opening_times != 'undefined' && 
          daywise_opening_times.length) {
          // console.log('Date selected', date);
          // var dayOfWeek = new Date(sel).getUTCDay() - 1;
          var dayOfWeek = new Date(sel).getDay();
          console.log('Get mandatory_collect_time for day '+ dayOfWeek);          
          mandatoryCollectionTimeopts(daywise_opening_times, dayOfWeek, calToday);
        }
      },
      onChangeMonthYear: function () {
        setTimeout(function () {
          hideToday();
        }, 0);
      }
    });

    if ($('.ui-datepicker').is(':visible')) {
      var tdy_dt = yyyy + '-' + mm + '-' + dd;
      var del_dt = '';
      if ($('input[name="delivery_date"]').length) {
        del_dt = $('input[name="delivery_date"]').val();
      }      
      if ($dateinput != "" && (tdy_dt != del_dt)) {
        hideToday();
      }
    }
  }

  $('#stockmessage a').click(function () {
    $(this).parent().find('input').click();

    return false;
  });

  $(".jump_menu").change(function () {
    var url = $(this).val();
    if (url != 'menu') window.location = $(this).val();
  });

  var w = $(window).width();
  if (w < 767) {
    $(".products .description").each(function () {
      var parent = $(this).parent();
      $(this).detach().appendTo(parent);
    });
  }

  $(window).resize(function () {
    var w = $(window).width();
    if (w >= 1024 && menu.is(':hidden')) {
      menu.show();
    }

    if (w >= 1024 && MainMenu.is(':hidden')) {
      MainMenu.show();
    }

    if (w < 767) {
      $(".products .description").each(function () {
        var parent = $(this).parent();
        $(this).detach().appendTo(parent);
      });
    } else {
      $(".products .description").each(function () {
        $(this).insertBefore($(this).siblings('form'));
      });
    }
  });

  $('.view-deliver-to-areas').off('click').on('click', function () {
    if (company_delivery_info) {
      var customModal = new CustomModal($('#deliveryAreasModal'));
      customModal.open();
    }
    return false;
  });

  $('#show_shop_opening_times').off('click').on('click', function () {
    if (shop_opening_times) {
      var customModal = new CustomModal($('#collectShopOpeningModal'));
      customModal.open();
      // alert(shop_opening_times);
    }
    return false;
  });

  $(document).on("change", ".price_option, .item_choice", function () {
    var source = $(this).attr('class');
    var container = $(this).closest(".product-item");
    // var container = $(this).parents(".product-item:eq(0)");
    var slider = container.find(".product-img");
    var image_options = slider.data("options");
    changeSlide(container, slider, image_options, $(this).val());
  });

  /* New function called when price and colour dropdowns are changed */
  function changeSlide(container, slider, image_options, select_input) {

    var overlap = [];
    var product_id = slider.data('product-id');
    var imgOptsWithAllColour = [];
    var imgOptsWithAllPrice = [];

    console.log('Image options:', image_options);
    
    var currentItemChoice = container.find('select.item_choice').val();

    if (typeof select_input != 'undefined') {
      currentItemChoice = select_input;
    }

    var globalPriceVal = container.find(".price_option option:selected").index();
    // globalPriceVal = parseInt(globalPriceVal) + 1;
    /* 'Select price' OPTION ADD: +1 not needed because of first placeholder opt */
    globalPriceVal = parseInt(globalPriceVal);

    console.log('GLOBAL price val:',globalPriceVal);
    
    if (image_options) {

      /* Check how many options are set to 'all' colour */
      imgOptsWithAllColour = image_options.filter(function(v) {
        return (v.options.length == 0);
      });

      /* Check how many options are set to 'all' price */
      imgOptsWithAllPrice = image_options.filter(function(v) {
        return (v.price_id == 0);
      });

    }
    
    console.log('Img opts with all colour', imgOptsWithAllColour);
    console.log('Img opts with all price', imgOptsWithAllPrice);

    if (image_options) {

      /* If all options are set to 'all' colour then no need to check color */
      if (imgOptsWithAllColour.length == image_options.length) {
        currentItemChoice = '';
      }    

      /* If all options are set to 'all' price */
      var isPriceAll = false;
      if (imgOptsWithAllPrice.length == image_options.length) {
        isPriceAll = true;
      }

      for (var img_num in image_options) {

        overlap[img_num] = 0;
        var options = image_options[img_num];

        if (!options) continue;

        if (!options['price_id'] && $.isEmptyObject(options['options'])) continue;

        /* If no colour dropdown is present, check for price only */
        if (!currentItemChoice && 
          options['price_id'] && options['price_id'] == globalPriceVal
          ) {
          overlap[img_num] += 1;
          continue;
        }

        /* Both colour and price dropdown are present, so check for both */
        if ($.isEmptyObject(options['options'])) {
          overlap[img_num] = -1;
        } else {
          var opt_val = currentItemChoice;

          console.log('Options:', options['options']);
          console.log('Global price val:', globalPriceVal);
          console.log('Opt val:', opt_val);

          for (var opt_id in options['options']) {
            var choice_id = options['options'][opt_id];
            /** 
             * If all are set to 'all price' then match only price. 
             * Otherwise match both choice and price. 
             *
             * old else logic choice_id == opt_val && 
             * options['price_id'] && options['price_id'] == globalPriceVal
             */
            if (isPriceAll) {            
              overlap[img_num] = (choice_id == opt_val) ? (overlap[img_num] + 1) : -1;            
            } else if (
              (choice_id == opt_val) && 
              (options['price_id'] == 0 || options['price_id'] == globalPriceVal)
            ) {
                overlap[img_num] += 1;            
            } else {
              overlap[img_num] = -1;  
            }
          }
        }
      }

      var max_overlap = Array.max(overlap);
      var img_index = overlap.indexOf(max_overlap);

      if (max_overlap != -1) {
        slider.data('royalSlider').goTo(img_index);
      }
    
    }
    
  }

  /* ------ Product image RS slider code ends ------- */

  Array.max = function (array) {
    return Math.max.apply(Math, array);
  };

  /* ------- Shop image full screen viewer ---------- */
  // img[data-enlargable]
  $(document).on('click', '.rsImg.rsMainSlideImage', function(e) {
      e.preventDefault();

      var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        console.log('Image zoom disabled for mobile');
        return;
      }

      $(this).addClass('img-enlargable');

      var src = $(this).attr('src');
      var fullScreenModal;
      function removeModal() { 
        fullScreenModal.remove(); 
        $('body').off('keyup.modal-close'); 
      }
      var fullScreenDiv = '<div></div>';
      fullScreenModal = $(fullScreenDiv).css({
        background: 'RGBA(0,0,0,.5) url('+src+') no-repeat center',
        backgroundSize: 'contain',
        width:'100%', 
        height:'100%',
        position:'fixed',
        zIndex:'10000',
        top:'0', 
        left:'0',
        cursor: 'zoom-out'
      }).click(function(){
        removeModal();
      }).appendTo('body');

      /* handling ESC */
      $('body').on('keyup.modal-close', function(e) {
        if (e.key === 'Escape') { 
          removeModal(); 
        } 
      });
    });

});


function mandatoryCollectionTimeopts(daywise_opening_times, dayOfWeek, isToday) {

  console.log('Fetch timeslot for day: ', dayOfWeek);

  var sel_timeslots = daywise_opening_times.find(function(day_open) {
    return day_open.weekday == dayOfWeek
  });
  console.log('Timeslots: ', sel_timeslots);

  if (!!sel_timeslots) {
    var slots = [];
    /* for today - show same day times */
    if (isToday && sel_timeslots.hasOwnProperty('same_day_times') && 
      sel_timeslots.same_day_times.length) {
      slots = sel_timeslots.same_day_times;
    } 
    /* for other days - show times */
    else if (sel_timeslots.hasOwnProperty('times') && sel_timeslots.times.length) {
      slots = sel_timeslots.times;
    }

    /* If empty slot, use next working day's opening times */
    if (slots.length == 0) {
      console.log('no slot found, use most common one');
      var loop = 1;
      while (loop) {
        var sel_timeslots = daywise_opening_times.find(function(day_open) {
          if (day_open.weekday == (dayOfWeek + loop)) {
            return true;
          }
        });
        console.log('sel_timeslots', sel_timeslots);
        if (sel_timeslots.hasOwnProperty('times') && sel_timeslots.times.length) {
          slots = sel_timeslots.times;
          loop = 0;
          break;
        } else {
          loop++;
        }
      }
    }
    console.log('Final slots:', slots);

    $('select[name="delivery_time"]').find('option').not(':first').remove();
    if (!!slots) {
      slots.forEach(function(slot) {
        var selc = '';
        if (typeof cart_del_time !== 'undefined' && cart_del_time == slot) {
          selc = 'selected';
        }
        $('select[name="delivery_time"]').append(
          '<option value="' + slot + '" + '+selc+'>' + slot + '</option>'
        );
      });
    }
  }
}

function hideToday() {
  $('.ui-datepicker .ui-datepicker-today .ui-state-highlight').removeClass('ui-state-highlight');
  $('.ui-datepicker .ui-datepicker-today .ui-state-active').removeClass('ui-state-active');
  $('.ui-datepicker .ui-datepicker-today').removeClass('ui-datepicker-current-day');
  $('.ui-datepicker .ui-datepicker-today').removeClass('ui-datepicker-today');
}

function selectDate() {
  // preselect the date on the calendar if one has been selected on submitting the form
  $daterequired = $('input[name="delivery_date"]').val();

  if ($daterequired != "") {
    $datesplit = $daterequired.split("-");
    $dateday = $datesplit[2];
    $datemonth = $datesplit[1];
    $dateyear = $datesplit[0];

    return new Date($dateyear, $datemonth - 1, $dateday, 0, 0, 0);
  }
}

function removeDays(calendardate) {
  if (calendardate < todaysdate) return [false];

  if ((calendardate.toDateString() == today_str) && delivery_today == false) return [false];

  var caldate = calendardate.getDate();
  var calmon = calendardate.getMonth();
  var calyear = calendardate.getFullYear();
  var result = true;
  var changed = false;

  for (var i = 0; i < excluded_dates.length; i++) {
    var exdate = excluded_dates[i];
    if (exdate[2] && exdate[3]) {
      if (caldate == exdate[0] && calmon == exdate[1] && (calyear == exdate[2] || exdate[2] == 1971)) {
        if (exdate[3] == 'closed') {
          result = result && false;
        } else {
          result = result || true;
        }
        changed = true;
      }
    } else {
      if (caldate == exdate[0] && calmon == exdate[1]) return [false];
    }
  }
  if (changed) return [result];

  if (available_days != '') {
    // available_days defined in checkout page template
    var daysopen = available_days.split(",");

    daynum = calendardate.getDay();
    for (var i = 0; i < daysopen.length; i++) {
      if (daysopen[i] == daynum) return [true];
    }
  }

  return [false];
}

function removeDaysDeliverySchedule(calendardate) {

  if (calendardate < todaysdate) return [false, 'past-date'];

  var today_cls = '';
  if ((calendardate.toDateString() == today_str)) {
    today_cls = 'calendar-today-date';
  }

  var caldate = calendardate.getDate();
  var calmon = calendardate.getMonth();
  var calyear = calendardate.getFullYear();
  var result = true;
  var changed = false;

  /* Calendar date format m/d/y */

  var calm = parseInt(calendardate.getMonth()) + 1, 
      cald = calendardate.getDate(), 
      caly = calendardate.getFullYear();

  if (cald < 10) cald = '0' + cald.toString();
  if (calm < 10) calm = '0' + calm.toString();

  var calMDY = calm + '/' + cald +'/' + caly;

  /* Today's date format m/d/y */

  // var m = parseInt(date.getMonth()) + 1, 
  //     d = date.getDate(), 
  //     y = date.getFullYear();

  // if (d < 10) d = '0' + d.toString();
  // if (m < 10) m = '0' + m.toString();

  // var tmpDate = m + '/' + d + '/' + y;

  console.log('Cal date', calMDY);

  if (closedDates.indexOf(calMDY) != -1) {
    console.log('Closed date', calMDY);
    return [true, 'calendar-closed-date '+today_cls, 'Not available'];
  }
  if (openDates.indexOf(calMDY) != -1) {
    return [true, 'calendar-open-date '+today_cls, 'Available'];
  }

  // console.log('Comparing dates: ', calMDY)
  if (excluded_dates.indexOf(calMDY) != -1) {
    return [true, 'calendar-closed-date '+today_cls, 'Not available'];
  }

  if (available_days != '') {
    var daysopen = available_days.split(",");
    daynum = calendardate.getDay();
    for (var i = 0; i < daysopen.length; i++) {
      if (daysopen[i] == daynum) {
        return [true, 'calendar-selectable-date '+today_cls, 'Available'];
      }
    }
  }
  return [true, 'calendar-closed-date '+today_cls, 'Not available'];
  // return [true, 'calendar-selectable-date '+today_cls, 'Not available'];
}

/* Exception details - delivery calendar */
function removeDaysDetailsDelivery(calendardate) {

  if (calendardate < todaysdate) return [false, 'past-date'];

  var today_cls = '';
  if ((calendardate.toDateString() == today_str)) {
    today_cls = 'calendar-today-date';
  }

  var caldate = calendardate.getDate();
  var calmon = calendardate.getMonth();
  var calyear = calendardate.getFullYear();
  var result = true;
  var changed = false;

  /* Calendar date format m/d/y */

  var calm = parseInt(calendardate.getMonth()) + 1, 
      cald = calendardate.getDate(), 
      caly = calendardate.getFullYear();

  if (cald < 10) cald = '0' + cald.toString();
  if (calm < 10) calm = '0' + calm.toString();

  var calMDY = calm + '/' + cald +'/' + calyear;

  console.log('Cal date', calMDY);

  if (closedDatesDelivery.indexOf(calMDY) != -1) {
    console.log('Closed delivery date', calMDY);
    return [true, 'calendar-closed-date '+today_cls, 'Not available'];
  }
  if (openDatesDelivery.indexOf(calMDY) != -1) {
    return [true, 'calendar-open-date '+today_cls, 'Available'];
  }

  if (available_delivery_days != '') {
    var daysopen = available_delivery_days.split(",");
    daynum = calendardate.getDay();
    for (var i = 0; i < daysopen.length; i++) {
      if (daysopen[i] == daynum) {
        return [true, 'calendar-selectable-date '+today_cls, 'Available'];
      }
    }
  }
  return [true, 'calendar-closed-date '+today_cls, 'Not available'];
}

/* Exception details - collection calendar */
function removeDaysDetailsCollection(calendardate) {

  if (calendardate < todaysdate) return [false, 'past-date'];

  var today_cls = '';
  if ((calendardate.toDateString() == today_str)) {
    today_cls = 'calendar-today-date';
  }

  var caldate = calendardate.getDate();
  var calmon = calendardate.getMonth();
  var calyear = calendardate.getFullYear();
  var result = true;
  var changed = false;

  /* Calendar date format m/d/y */

  var calm = parseInt(calendardate.getMonth()) + 1, 
      cald = calendardate.getDate(), 
      caly = calendardate.getFullYear();

  if (cald < 10) cald = '0' + cald.toString();
  if (calm < 10) calm = '0' + calm.toString();

  var calMDY = calm + '/' + cald +'/' + calyear;

  console.log('Cal date', calMDY);
  if (closedDatesCollection.indexOf(calMDY) != -1) {
    return [true, 'calendar-closed-date '+today_cls, 'Not available'];
  }
  if (openDatesCollection.indexOf(calMDY) != -1) {
    return [true, 'calendar-open-date '+today_cls, 'Available'];
  }

  if (available_collect_days != '') {
    var daysopen = available_collect_days.split(",");
    daynum = calendardate.getDay();
    for (var i = 0; i < daysopen.length; i++) {
      if (daysopen[i] == daynum) {
        return [true, 'calendar-selectable-date '+today_cls, 'Available'];
      }
    }
  }
  return [true, 'calendar-closed-date '+today_cls, 'Not available'];
}

function loadRSSlider() {

  if ($('.product-img')[0]) {

    $(".product-img:not('.lazy')").royalSlider({
      autoHeight: true,
      transitionType: 'fade',
      transitionSpeed: 550,
      controlNavigation: 'thumbnails',
      arrowsNav: true,
      visibleNearby: {
        navigateByCenterClick: true,
      },
      arrowsNavHideOnTouch: false,
      arrowsNavAutoHide: false,
      imageScaleMode: 'fill',
      imageAlignCenter: false,
      loop: false,
      loopRewind: true,
      keyboardNavEnabled: true,
      allowCSS3: true,
      randomizeSlides: false,
      numImagesToPreload: 4,
      usePreloader: true,
      autoPlay: {
        // autoplay options go here
        delay: 2800,
        enabled: false
      },
      thumbs: {
        appendSpan: true,
        arrows: false,
        firstMargin: false
      },
      /* Prevent on click navigation */
      navigateByClick: false 
    });

    /* ------ Product image RS slider code starts ------- */

    $(".product-img:not('.lazy')").each(function () {
      $(this).data('royalSlider').ev.on('rsAfterSlideChange', function (event) {
        var slider = event.currentTarget.slider;
        var img_num = event.currentTarget.currSlideId;
        var options = slider.data('options');
        var container = slider.closest('.product-item');
        var img_options = options[img_num];
        var product_id = slider.data('product-id');

        console.log('Image options pid ' + product_id);
        console.log('Img options', img_options);

        if (img_options) {

          var currentItemChoice = container.find('select.item_choice').val();
          
          if (img_options['price_id'] && img_options['price_id'] != 0) {
            // var parse_opt_id  = parseInt(img_options['price_id']);
            /* 'Select price' OPTION ADD: +1 added */
            var parse_opt_id  = parseInt(img_options['price_id']) + 1;
            console.log('parse_opt_id', parse_opt_id)
            // var price_id_data = $(".price_option option:nth-child("+parse_opt_id+")").val();
            var hdn_pid       =   $('input[type="hidden"][name="pid"][value="'+product_id+'"]');          
            var price_id_data =   $(hdn_pid).parents('form:eq(0)').find(".price_option option:nth-child("+parse_opt_id+")").val();
            container.find('select[name="price_option"]').val(price_id_data);
          }

          if (img_options['options']) {
            var prod_selects = container.find('.item-form .item_choice');
            for (var opt_id in img_options['options']) {
              var choice_id = img_options['options'][opt_id];
              var opt_id = '#product-option-' + product_id + '-' + opt_id;
              $(opt_id).val(choice_id);
              prod_selects = prod_selects.not(opt_id);
            }
            prod_selects.each(function () {
              $(this).val('');
            });
          }
        }
      });

      hide_slider_thumbs_if_single_image($(this));
    });
  }
}

function hide_slider_thumbs_if_single_image(image_container) {
  var count = image_container.find('.rsSlide').length;
  if (count < 2) {
    image_container.find('.rsNav.rsThumbs').addClass('hidden');
  }
}

console.log('%cfunctions-rwd loaded loadRSSlider', 'color:red', typeof loadRSSlider);

/* ------ Textarea auto resize code ------ */

function initAutoResize() {

  document.querySelectorAll('[data-autoresize]').forEach(function (element) {
    element.style.boxSizing = 'border-box';
    element.style.resize = 'none';
    var offset = element.offsetHeight - element.clientHeight;
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + offset + 'px';
    console.log('Init textarea height:');
    console.log(element.scrollHeight, offset);
    element.removeAttribute('data-autoresize');
  });
}
  
function addAutoResize() {

  document.querySelectorAll('[data-autoresize]').forEach(function (element) {
    element.style.boxSizing = 'border-box';
    element.style.resize = 'none';
    var offset = element.offsetHeight - element.clientHeight;
    element.addEventListener('input', function (event) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + offset + 'px';
      console.log('Textarea height:');
      console.log(event.target.scrollHeight, offset);
    });
    element.addEventListener('click', function (event) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + offset + 'px';
      console.log('Textarea height:');
      console.log(event.target.scrollHeight, offset);
    });
    element.removeAttribute('data-autoresize');
  });
}

/* -------------- Custom Modal JS code ---------------- */

function CustomModal(modal) {

  this.modal = modal;

  this.open = function(contentHtml) {
    $('body').addClass('modal-open');
    if (typeof contentHtml != 'undefined') {
      $(this.modal).find('p.body').html(contentHtml);
    }
    $(this.modal).css('display', 'block');
  }

  this.close = function() {
    $(this.modal).css('display', 'none');
    $('body').removeClass('modal-open');
  }

  this.disableActionBtns = function(is_disabled) {
    $(this.modal).find('.button').attr('disabled', is_disabled);
    $(this.modal).find('input[type="button"]').attr('disabled', is_disabled);
  }

  var modalRef   = $(this.modal);
  var actionBtns = this.disableActionBtns;

  this.confirm = new Promise(function(resolve) {
    $(modalRef).find('.button').on('click', function() {
      actionBtns(true);
      var yesCls = 'yes-btn';
      var noCls  = 'no-btn';
      var resp = false;
      console.log('Button clicked:', $(this));
      if ($(this).hasClass(yesCls)) {
        resp = true;
      }
      resolve(resp);
    });
  });

  /* yes, no, cancel */
  this.confirm3 = new Promise(function(resolve) {
    $(modalRef).find('.button').on('click', function() {
      actionBtns(true);
      var val = $(this).attr('data-val');
      switch (val) {
        case 'yes': resolve(val);
          break;
        case 'no': resolve(val);
          break;
        case 'cancel':
        default: resolve(false);
          break;
      }
    });
  });

  /* Order actions - mark as complete, print order */
  this.orderActions = new Promise(function(resolve) {
    $(modalRef).find('.button').on('click', function() {
      actionBtns(true);
      var val = $(this).attr('data-val');
      switch (val) {
        case 'complete': resolve(val);
          break;
        case 'reopen': resolve(val);
          break;
        case 'print': resolve(val);
          break;
        default: resolve(false);
          break;
      }
    });
  });
}

/* When the user clicks on <span> (x), close the modal */
$('.modal-content .close').on('click', function() {
  $(".modal").css('display', 'none');
  $('body').removeClass('modal-open');
});

/* When the user clicks anywhere outside of the modal, close it */
$(window).on('click', function(event) {
  if (event.target.className == 'modal' || event.target.className == 'close') {
    $(".modal").css('display', 'none');
    $('body').removeClass('modal-open');
  }
});

/* When esc key is pressed, close modal */
$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    $(".modal").css('display', 'none');
    $('body').removeClass('modal-open');
  }
});

/* Product quantity increment/decrement JS */

function increaseValue(max_qty) {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  if (value < max_qty) { value++; }   
  document.getElementById('number').value = value;
}

function decreaseValue(max_qty) {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value <= 1 ? value = 1 : '';
  if (value > 1) value--;
  document.getElementById('number').value = value;
}