$.ajax({
    method: "GET",
    url: "http://recipio.herokuapp.com/recipes",
    data: {
      recipe: "ham_mustard_omelette"
    }
  })
  .done(function(msg) {
    console.log(msg);
  });
