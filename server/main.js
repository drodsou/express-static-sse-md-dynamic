import sirv from 'sirv';
import express from 'express';   // dont use polka, does not send SSE messages
import compression from 'compression';

import dynamicPages from './dynamicPages.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const port = parseInt(PORT || '3000');



console.log(`listening in http://localhost:${port}`);

express() 
  // SSE
	.get('/sse', function(req, res) {
		res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    })

    sseCountdown(res, 5);

    https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
    req.on('close', () => {
      console.log(`sse Connection closed`);
    });
		
	})

	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
    dynamicPages
	)

	.listen(port, err => {
		if (err) console.log('error', err);
	});


	/// ------
	
	function sseCountdown(res, count) {
		res.write("data: " + count + "\n\n")
		if (count)
			setTimeout(() => sseCountdown(res, count-1), 1000)
		else
			res.end()
	}


  // -- dynamic /pages middleware

  