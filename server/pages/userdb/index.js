let btn = document.querySelector('button')
let div = document.querySelector('.result')
// btn.addEventListener('click',()=>btn.innerText = parseInt(btn.innerText)+1)



btn.addEventListener('click',async ()=>{
  let res = await fetchJson ('data')
  div.innerHTML = '<pre>' + JSON.stringify(res,null,2) + '</pre>';
  
});




async function fetchJson (url, args={}) {
  if (url.slice(-1) !== '/') url += '/';
  let query = new URLSearchParams(args).toString()
  if (query)  query = '?' + query;
  try { 
    let res = await fetch(url + query)
    // let txt = await res.text()
    let json = await res.json();
    return json;
  } catch (e) {
    return { error: e.message, rows : []}
  }
}