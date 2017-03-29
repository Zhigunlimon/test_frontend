$(document).foundation();
Foundation.Orbit.defaults.dataSwipe = true;

$(document).ready(function() {
  var sort = "sort";
  var shuffle = "shuffle";

  $submit = $('#options_submit');

  // simple input
  var input = $('#input_text');

  $('#output').on('click', function(e){
    var text = input.val();
    $('.output').append(`<p>${text}</p>`);
    input.val('');
  });


  // autocomplete input
  var opts = ['sort', 'shuffle'];

  $('.options--results').append(optsList(opts));
  $('.options-list > li:first').addClass('option--active');

  var active = $('.option--active');

  function matchOptions(input) {
    var exp = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
    return opts.filter(function(opt) {
      if (opt.match(exp)) {
        return exp;
      }
    });
  }

  function changeInput(val) {
    var res = matchOptions(val);
    $('.options-list > li').remove();
    $('.options-list').append(optsFiltered(res));
    $('.options-list > li').removeClass('option--active option--highlighted');
    $('.options-list').find(`li:contains('${res[0]}')`).addClass('option--active option--highlighted');
  }

  function optsFiltered(arr) {
    return (
      arr.map(function(opt) {
        return `<li>${opt}</li>`
      }).join(' ')
    );
  }

  var opts_field = $("#autocomplete_example");
  var opts_search = $('#opts_search');
  var opts_wrap = $('.options--container');

  opts_field.val(opts[0]);

  opts_field.focus(function() {
    opts_wrap.show();
  });

  $("body").click(function(e) {
    if ((e.target.id !== ('autocomplete_example')) && (e.target.id !== ('opts_search')) ) {
      opts_wrap.hide();
      opts_field.removeClass('open');
    }
  });

  opts_field.focus(function(e) {
    $(this).blur();
  });

  opts_field.click(function(e) {
    opts_search.focus();
    $(this).addClass('open');
  });

  opts_search.on('keydown', function() {
    changeInput($(this).val());
  });

  opts_search.on('keyup keypress', function(e) {
    var key = e.keyCode || e.which;
    if (key === 13) {
      e.preventDefault();

      if ($.inArray($(this).val().toLowerCase(), opts) > -1) {
        opts_field.val($(this).val());
        opts_wrap.hide();
        opts_search.val('');
        opts_field.removeClass('open');
      }

      else {
        return false;
      }
    }
  });


  function optsList(arr) {
    return "<ul class='options-list'>" +
      arr.map(function(opt) {
        return `<li>${opt}</li>`;
      }).join(' ') +
    "</ul>"
  }

  $('.options-list li').click(function() {
    opts_field.empty().val($(this).html());

    $('.options-list > li.option--active').removeClass('option--active');
    $(this).addClass('option--active');

    $(".option--highlighted").removeClass();
    $(this).addClass("option--highlighted");
  });

  $('.options-list > li').hover(function() {
    $(".option--highlighted").removeClass();
    $(this).addClass("option--highlighted");
  });

  // pivot algorithm
  function swap(items, firstIndex, secondIndex){

    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
  }

  function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;

    while (i <= j) {
      while (items[i] < pivot) {
        i++;
      }

      while (items[j] > pivot) {
        j--;
      }

      if (i <= j) {
        swap(items, i, j);
        i++;
        j--;
      }
    }
    return i;
  }

  function quickSort(items, left, right) {
    var index;

    if (items.length > 1) {
      index = partition(items, left, right);

      if (left < index - 1) {
          quickSort(items, left, index - 1);
      }

      if (index < right) {
          quickSort(items, index, right);
      }
    }
    return items;
  }

  function shuffleOptions(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // Animated items

  var output = $("#pivot .items");
  var arr = [14, 25, 255, 26, 13, 24];

  $.each(arr, function(i, item) {
      output.append(`<div data-id=${i}><button type="button" class="item">${item}</button></div>`);
  });


  $submit.click(function() {
    $(this).prop("disabled", true);
    opt = opts_field.val();

    switch (opt) {
      case 'sort':
        sortAnimation();
        break;
      case 'shuffle':
        shuffleAnimation();
    }
  });

  function sortAnimation() {
    var a = arr.slice();
    var result = quickSort(a, 0, arr.length - 1);

    setTimeout(function() {
      $.each(result, function(index, item) {
        if (item < arr[index]) {
          $(`.item:contains(${arr[index]})`).animate({
             top: "-20"
          }, 300, function(){}).addClass('active');
        }
      });

      setTimeout(function(){
        $('.item').animate({
           top: "0"
        }, 300, function(){}).addClass('active');

        $('.item').animate({ opacity: 0}, 300, function() {
          $.each(result, function(index, item) {
            $(`[data-id="${index}"] > .item`).html(item);
          });
        });

        setTimeout(function() {
          $('.item').css({ opacity: 1}, 100, function(){});
          $('.item').animate({
             top: "-20"
          }, 1000, function(){}).addClass('active');

          setTimeout(function() {
            $('#options_submit').removeAttr('disabled');
            $('.item').animate({
               top: "0"
            }, 5000, function(){
              $submit.removeAttr("disabled");
            });
          }, 1);
        }, 1000);
      }, 2000);
    }, 2000);
  }

  function shuffleAnimation() {
    setTimeout(function() {
      $.each(shuffleOptions(arr), function(index, item) {
        $(`[data-id="${index}"] > .item`).html(item);
      });

      $('.item').animate({
         top: "-20"
      }, 300, function(){}).addClass('active');

      setTimeout(function() {
        $('.item').animate({
           top: "0"
        }, 200, function() {
          $submit.removeAttr("disabled");
        });
      }, 500);

    }, 300);
  }
});

