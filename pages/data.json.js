module.exports = function page ({req, props}) {

  return JSON.stringify({
    uno: 1,
    dos: 2
  }, null, 2);

}