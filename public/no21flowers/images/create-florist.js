$(document).ready(function () {

   var validationRules = {
      'tenant_name': {'required': true, 'field': 'Florist name', 'pattern': ""},
      'tenant_phone': {'required': true, 'field': 'Telephone number', 'pattern': "^[0-9]*$"},
      'domain' : {'required': false, 'field': 'Domain', 'pattern': "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})"},
      'tenant_email'  : {'required': true, 'field': 'Contact email', 'pattern': "^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"},
   };

   /* Function Runs on form submit */
   $(".submit_btn").click(function (e) {

      e.preventDefault();
      console.log($('.regform').serialize());
      return;
   });

   /* Function Runs On NEXT Button Click */
   $(".next_btn").click(function () { 

      var inputField = $(this).parents('fieldset').find('input.text_field');
      var fieldName = $(inputField).attr('name');
      var err = '';
      var req = validationRules[fieldName].required;
      var pattern = validationRules[fieldName].pattern;

      $('.err-msg').remove();
      $(inputField).removeClass('input-err');

      /* Required validation */
      if (req && $(inputField).val() == '') {
         err = validationRules[fieldName].field + ' is required.';
         $("<p class='err-msg'>"+ err +"</p>").insertAfter(inputField);
         $(inputField).addClass('input-err');         
         return false;
      } 
      /* Pattern match regex */
      else if (pattern != '') {
         console.log($(inputField).val());
         console.log(new RegExp(pattern));
         var check = new RegExp(pattern).test($(inputField).val());
         console.log(check);
         if (!check) {
            err = validationRules[fieldName].field + ' is invalid.';
            $("<p class='err-msg'>"+ err +"</p>").insertAfter(inputField);
            $(inputField).addClass('input-err');         
            return false;
         }        
      }

      $(inputField).removeClass('input-err');
      $('.err-msg').remove();

      $(this).parents('fieldset:eq(0)').next('fieldset').fadeIn('slow');
      $(this).parents('fieldset:eq(0)').css({
         'display': 'none'
      });
      // Adding Class Active To Show Steps Forward;
      $('.active').next().addClass('active');
   });

   /* Function Runs On PREVIOUS Button Click */
   $(".pre_btn").click(function () { 
      $(this).parents('fieldset:eq(0)').prev('fieldset').fadeIn('slow');
      $(this).parents('fieldset:eq(0)').css({
         'display': 'none'
      });
      // Removing Class Active To Show Steps Backward;
      $('.active:last').removeClass('active');
   });
});