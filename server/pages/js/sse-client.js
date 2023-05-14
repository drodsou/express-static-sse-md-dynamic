
 const app = {

  state : {
    sseData: 'data...',
    sseState: 'state...'
  },

  update() {
    document.querySelector('#sse-data').textContent = app.state.sseData;
    document.querySelector('#sse-state').textContent = app.state.sseState;
  }
}
 

// client side only
// var sseSource = new window.EventSource('/sse')
var sseSource = new window.EventSource('/sse')

sseSource.addEventListener('message', function(e) {
  app.state.sseData = e.data;
  app.update();
}, false);

sseSource.addEventListener('open', function(e) {
  app.state.sseState = "Connected"
  app.update();
}, false)

sseSource.addEventListener('error', function(e) {
  if (e.eventPhase == window.EventSource.CLOSED) sseSource.close();

  if (e.target.readyState == window.EventSource.CLOSED) {
    app.state.sseState = 'Disconnected'
    app.update();
  }
  else if (e.target.readyState == window.EventSource.CONNECTING) {
    app.state.sseState = "Connecting";
    app.update();
  }
}, false)
 