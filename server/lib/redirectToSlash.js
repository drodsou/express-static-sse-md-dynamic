/**
Rdirects localhost/folder to localhost/folder/, so imports './index.js' work properly
*/
export default function (req, res, next)  {
  if (req.path.slice(-1) === '/' || req.path.includes('.')) { return next(); }

  const query = req.url.slice(req.path.length)
  res.redirect(301, req.path + '/' + query)
}