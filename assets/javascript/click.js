$("#pinned_bizzcard1").on("click", function() {
  $("#pinned_bizzcard1").appendTo("#left-side");
});

$("#pinned_bizzcard2").on("click", function() {
  $("#pinned_bizzcard2").appendTo("#left-side");
});

$("#pinned_bizzcard3").on("click", function() {
  $("#pinned_bizzcard3").appendTo("#left-side");
});


$(".card-body").on('click', 'button', function(){
  console.log('hi');
  let rowId = $(this).attr('row-id'); //Pull the attribute from your button
  let tr =  $(this).parent().parent(); //Define the TR itself
  tr.remove();

});
