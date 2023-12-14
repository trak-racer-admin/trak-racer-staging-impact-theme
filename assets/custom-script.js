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

function checkAndSetAvailability() {
  if ($(".gpo-swatches.image-swatches").length === 0) {
    return;
  }

  clearInterval(findGPO);

  $(".gpo-form__group .gpo-label").append('<span class="availability" style="display:none;"></span>');

  $('.gpo-swatches.image-swatches').each(function () {
    const $input = $(this).find("input");
    const productHandle = $input.attr("gpo-data-product-handle");
    const productVarId = $input.attr("gpo-data-variant-id");

    if (productHandle !== "" && productHandle !== undefined) {
      getProductAvailability(productHandle, productVarId);
    }
  });
}

let findGPO = setInterval(checkAndSetAvailability, 100);

setTimeout(function () {
  clearInterval(findGPO);
}, 50000);

function getProductAvailability(p_Handle, p_variant) {
  const product_url = p_variant !== ""
    ? `${location.origin}/products/${p_Handle}?variant=${p_variant}`
    : `${location.origin}/products/${p_Handle}`;

  $.ajax({
    url: product_url,
    type: "GET",
    success: function (data) {
      const Product_Availability = $(data).find(".Product_Availability .product_qty").data("productqty");
      const Product_restock = $(data).find(".product-info__inventory span.active_variant").data("warning");
      const $productElement = $(`[gpo-data-product-handle=${p_Handle}]`);
      $productElement.attr('data-available', Product_Availability > 0);
      $productElement.attr('data-restock', Product_restock == 'Pending restock' ? true : false);
    },
    error: function (error) {
      console.error("Error fetching product information:", error);
    },
  });
}

$(document).on('click', '.gpo-swatches.image-swatches input', function () {
  const $input = $(this);
  const productAvailable = $input.data("available");
  const productRestock = $input.data("restock");
  const availabilityDIV = $input.closest(".gpo-form__group").find(".availability");

  // restock | available | unavailable
  if ($input.prop('checked')) {
    if (productRestock === true) {
      $input.removeClass('available unavailable').addClass('restock').show();
      availabilityDIV.text('Pending Restock').removeClass('available unavailable').addClass('restock').show();
    } else if (productAvailable === true) {
      $input.removeClass('restock unavailable').addClass('available').show();
      availabilityDIV.text('In stock').removeClass('restock unavailable').addClass('available').show();
    } else if (productAvailable === false) {
      $input.removeClass('restock available').addClass('unavailable').show();
      availabilityDIV.text('Preorder').removeClass('restock available').addClass('unavailable').show();
    } else {
      $input.removeClass('restock available unavailable');
      availabilityDIV.text('').removeClass('restock available unavailable').hide();
    }
  } else {
    $input.removeClass('restock available unavailable');
    availabilityDIV.text('').removeClass('restock available unavailable').hide();
  }
});

$(".product-info .product-info__inventory").appendTo(".product-info  .product-info__variant-picker .h-stack");