export default function layout (props) {
  return `<!DOCTYPE html>
<html lang="${props.lang || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${props.title || 'Title'}</title>
  <link rel="stylesheet" href="/style.css?${Date.now()}" />
  <script src="/js/debug.js"></script>
</head>
<body>
<nav>
  <a href="/">HOME</a>
  <a href="/dyn">DYN</a>
  <a href="/data">DATA</a>
  <a href="/mark">MARK</a>
  <a href="/database">DB</a>
  <a href="/priv/priv1">PRIVATE!</a>
  <a href="/auth/logout">LOGOUT</a>
</nav>
 ${props.body}

 <script type="module" src="index.js?${Date.now()}"> </script>
</body>

</html>
`
}


// <script>document.body.addEventListener('click',ev=>(console.log(ev.target.tagName), ev.target.tagName === 'BODY' && location.reload()))</script