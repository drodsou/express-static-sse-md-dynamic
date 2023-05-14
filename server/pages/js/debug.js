document.addEventListener('dblclick',ev=>{
  // -- reload whole page
  location.reload()

  // -- or just reload css
  //document.querySelector('head > link').href = '/style.css?' + Date.now()
});