(function () {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  //I'm adding this section so I don't have to keep updating this pen every year :-)
  //remove this if you don't need it
  let today = new Date(),
    dd = String(today.getDate()).padStart(2, "0"),
    mm = String(today.getMonth() + 1).padStart(2, "0"),
    yyyy = today.getFullYear(),
    nextYear = yyyy + 1,
    dayMonth = "12/31/",
    birthday = dayMonth + yyyy;

  today = mm + "/" + dd + "/" + yyyy;
  if (today > birthday) {
    birthday = dayMonth + nextYear;
  }
  //end

  // Check if the element with id "countdown" exists
  var countdownDiv = document.getElementById("countdown");

  const countDown = new Date(birthday).getTime();
  if (countdownDiv !== null) {
    console.log("#countdown exists in the DOM");
    const x = setInterval(function () {
      const now = new Date().getTime(),
        distance = countDown - now;

      (document.getElementById("days").innerText = Math.floor(distance / day)),
        (document.getElementById("hours").innerText = Math.floor(
          (distance % day) / hour
        )),
        (document.getElementById("minutes").innerText = Math.floor(
          (distance % hour) / minute
        )),
        (document.getElementById("seconds").innerText = Math.floor(
          (distance % minute) / second
        ));

      //do something later when date is reached
      if (distance < 0) {
        document.getElementById("headline").innerText = "Giveaway Ends!";
        document.getElementById("countdown").style.display = "none";
        document.getElementById("content").style.display = "block";
        clearInterval(x);
      }
      //seconds
    }, 0);
  }
})();

$().ready(function () {
  $(".slick-carousel").slick({
    arrows: true,
    dots: true,
    slidesToShow: 3,
    infinite: true,

    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          autoplay: true,
        },
      },
    ],
  });

  $(".custom_featured_product .product_data .product_gallery").slick({
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
  });

  $(".magnific_YT_video").magnificPopup({
    type: "iframe",
    closeOnBgClick: false,
    iframe: {
      markup:
        '<div class="mfp-iframe-scaler">' +
        '<div class="mfp-close"></div>' +
        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
        '<div class="mfp-title">Some caption</div>' +
        "</div>",
    },
    callbacks: {
      markupParse: function (template, values, item) {
        values.title = item.el.attr("title");
      },
    },
    removalDelay: 300,
    mainClass: "mfp-fade",
  });
});

function formateThePrice(data) {
  let moneyFormat = theme.moneyFormat;
  let price = (data / 100).toFixed(2);
  let formattedPrice = moneyFormat.replace('{{amount}}', price);
  return formattedPrice;
}

// Add to cart js For Shopify 
function addToCart_Ajax(data, callback) {
  jQuery.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: {
      items: data,
    },
    dataType: "json",
    success: function () {
      console.log("Data added successfully - selling_plan");
      if (callback && typeof callback === "function") {
        callback();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error adding data to cart:", error);
    },
  });
}
$(document).on('click', '.product_list .product_item input', function () {
  // $(this).closest('.product_list').find('input').data('checked', false);
  let isChecked = $(this).data('checked');
  // console.log("isChecked == ", isChecked)
  let productTitle = $(this).val();
  let productPrice = formateThePrice($(this).data('product_price'));
  let $upsellProductGroup = $(this).closest('.upsell_product_group');
  // debugger

  // Toggle the checked state
  $(this).data('checked', !isChecked);
  // console.log("after chnage == ", !isChecked)
  // Update the UI based on the checked state
  if (!isChecked) {
    // console.log("Trueeeeeeeeeeee")
    $(this).prop('checked', true);
    $upsellProductGroup.find('.selected_values').text(productTitle);
    $upsellProductGroup.find('.addOn').text(`(+ ${productPrice})`);
  } else {
    // console.log("falseeeeeeeeee")
    $(this).prop('checked', false);
    $upsellProductGroup.find('.selected_values').text('');
    $upsellProductGroup.find('.addOn').text('');
  }
});
$(document).on('click', '.product-template button.custom_addToCart', function () {
  let products = [];
  $(".product_list .product_item input:checked").each(function () {
    let variant_id = $(this).data("variant-id");
    let existingProduct = products.find(product => product.id === variant_id);
    if (!existingProduct) {
      products.push({ "id": variant_id, "quantity": 1 });
    }
  });
  addToCart_Ajax(products, function () {
    $("body.product-template buy-buttons.buy-buttons button.button").click();
  });
});