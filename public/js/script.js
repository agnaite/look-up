$('.btn-danger').click(evt => {
  evt.preventDefault();

  $('table > tbody').empty();

  $.get('/get_products', { products: $('.products').val() }, response => {

    if (response !== '') {

      const allProducts = JSON.parse(response);
      const inStock = { products: [], caption: 'In Stock'};
      const ooStock = { products: [], caption: 'Out of Stock'};

      allProducts.forEach(product => {
        if (product.qty > 0) {
          inStock.products.push(product);
        } else {
          ooStock.products.push(product);
        }
      });

      console.log(inStock)

      const theTemplate = Handlebars.compile($("#table-template").html());
      if (inStock.products.length > 0) $('.in-stock-table').html(theTemplate(inStock));
      if (ooStock.products.length > 0) $('.oo-stock-table').html(theTemplate(ooStock));
    }
  });
});

// helpers

const sort_by_qty = products => {
  products.sort((a, b) => {
    return a.qty - b.qty;
  });
  return products
}
