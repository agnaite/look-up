$(document).ready(function() {

  $('.close').on('click', () => {
    closeFlash();
  })

  // On click of search
  $('.btn-search').click(evt => {
    evt.preventDefault();

    closeFlash();
    loading(true);
    const products = $('.products').val().replace(/ /g,'');

    if (validateInput(products)) {
      const theTemplate = Handlebars.compile($("#table-template").html());

      clearTables();

      $.get('/get_products', { products: products }, response => {

        if (response !== '') {
          const allProducts = JSON.parse(response);

          const inStock = filterOutOfStock(allProducts)[0];
          const ooStock = filterOutOfStock(allProducts)[1];

          sortByQty(inStock.products);

          $('.load-img').css('display', 'none');

          if (inStock.products.length > 0) $('.in-stock-table').html(theTemplate(inStock));
          if (ooStock.products.length > 0) $('.oo-stock-table').html(theTemplate(ooStock));

          $('.btn-sort').on('click', reverseRows);
        }
        else {
          flash('No products found!');
          loading(false);
        }
      });
    }
  });

  // helpers

  const validateInput = input => {
    const alphaExp = /^\d+(,\d+)*$/;

    if (input.match(alphaExp)) {
      return true;
    } else {
      loading(false);
      flash('Invalid format. Example: "143249,142593".');
      return false;
    }
  }

  const closeFlash = () => {
    $('.flash-container').attr('hidden', true);
  }

  const flash = msg => {
    $('.flash-container').removeAttr('hidden');
    $('.flash').html(msg)
    $('.products').focus();
  }

  const sortByQty = (products) => {
    products.sort((a, b) => {
      return b.qty - a.qty;
    });
    return products
  }

  const filterOutOfStock = allProducts => {
    let inStock = { products: [], caption: 'In Stock', sort: true};
    let ooStock = { products: [], caption: 'Out of Stock'};

    allProducts.forEach(product => {
      if (product.qty > 0) {
        inStock.products.push(product);
      } else {
        ooStock.products.push(product);
      }
    });
    return [inStock, ooStock];
  }

  const updateSortIcon = () => {
    if ($('.btn-sort i').hasClass('fa-sort-numeric-desc')) {
      $('.btn-sort').html('<i class="fa fa-sort-numeric-asc" aria-hidden="true"></i>');
    } else {
      $('.btn-sort').html('<i class="fa fa-sort-numeric-desc" aria-hidden="true"></i>');
    }
  }

  const reverseRows = () => {
    const table = $('.in-stock-table tbody');
    for (let i = 0; i < table.length; i++) {
      let rows = table[i].rows;
      for (let j = 0; j < rows.length; j++) {
        rows[j].parentNode.insertBefore(rows[rows.length-1], rows[j]);
      }
    }
    updateSortIcon();
  }

  const clearTables = () => {
    $('.in-stock-table').html('');
    $('.oo-stock-table').html('');
  }

  const loading = status => {
    status ? $('.load-img').css('display', 'block') : $('.load-img').css('display', 'none');
  }
});
