$.post('https://apps.fhict.nl/api/v1/people/me?callback=?',function(data,textStatus,jqXHR){
  console.log(data);
});
// OUTPUT:
// XMLHttpRequest cannot load https://apps.fhict.nl/api/v1/people/me?callback=?.
// No 'Access-Control-Allow-Origin' header is present on the requested resource.
// Origin 'http://localhost:9000' is therefore not allowed access.


$.getJSON('https://apps.fhict.nl/api/v1/people/me?callback=?',function(data,textStatus,jqXHR){
  console.log(data);
});
// OUTPUT:
// Status Code:405 Method Not Allowed
