$(document).ready(function() {

  // simple input
  var input = $('#input_text');

  $('#output').click(function(e){
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
    //opts_search.val(res[0]);
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

  opts_field.val(opts[0]);

  opts_field.focus(function() {
    $('.options--container').show();
  });

  $("body").click(function(e) {
    if ((e.target.id !== ('autocomplete_example')) && (e.target.id !== ('opts_search')) ) {
      $('.options--container').hide();
    }
  });

  opts_field.focus(function(e) {
    $(this).blur();
  });

  opts_field.click(function(e) {
    opts_search.focus();
  });

  opts_search.on('keydown', function() {
    changeInput($(this).val());
  });

  function optsList(arr) {
    return "<ul class='options-list'>" +
      arr.map(function(opt) {
        return `<li>${opt}</li>`;
      }).join(' ') +
    "</ul>"
  }

  $('.options-list > li').click(function() {
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


  // Animated items

  var output = $(".items");
  var arr = [14, 25, 255, 12, 13, 24];

  $.each(arr, function(i, item) {
      output.append(`<div data-id=${i}><button type="button" class="item">${item}</button></div>`);
  });


  $('#options_submit').click(function() {
    var a = arr.slice();
    var result = quickSort(a, 0, arr.length - 1);

    $.each(result, function(index, item) {
      if (item < arr[index]) {
        $(`.item:contains(${arr[index]})`).animate({
           top: "-20"
        }, 1000, function(){}).addClass('active');
      }
    });

    setTimeout(function(){
      $('.item').removeAttr('style').removeClass('active');

      $.each(result, function(index, item) {
        $(`[data-id="${index}"] > .item`).html(item);
      });

      setTimeout(function() {
        $('.item').animate({
           top: "-20"
        }, 1000, function(){}).addClass('active');

        setTimeout(function() {
          $('.item.active').removeClass('active').removeAttr('style');

        }, 5000);
      }, 1000);
    }, 3000);
  });

  function sortAnimation(res) {
    var result = res.slice();

    $.each(result, function(index, item) {
      setTimeout($(this), 5000);

      if (item < arr[index]) {
        $(`[data-id="${index}"] > .item`).html(item);
      }
    });
  }
});
