const urlStart = 'https://www.dollskill.com/api/v1/catalog/products/';
const urlEnd = '/?op=get_size_attributes';

$('.btn-danger').click(evt => {
  evt.preventDefault();
  const input = $('.products').val();

  $.get('/get_products', { products: input }, response => {
    console.log(response);
  });
});


