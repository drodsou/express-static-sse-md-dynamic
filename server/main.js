import express from 'express';   // dont use polka, does not send SSE messages
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import helmet from "helmet";
import compression from 'compression';
import sirv from 'sirv';
import cors from 'cors';
//import morgan from 'morgan';  // logger, maybe winston ?

import dynamicPages from './dynamicPages.js';
import redirectToSlash from '#root/server/lib/redirectToSlash.js';

import {dbConnect} from './db/sqlite/connect.js';

dotenv.config()
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const port = parseInt(PORT || '3000');

const db = dbConnect();

console.log(`listening in http://localhost:${port}`);

const srv = express() 

// -- BOILERLATE

// -- behind reverse proxy ?
// app.set('trust proxy', '127.0.0.1');
// app.use(morgan('dev'))
srv.use(helmet());
// srv.use(cors())
srv.use(express.json())
srv.use(express.urlencoded({extended: false}))
// status check
srv.get('/status', (req,res)=> res.sendStatus(200).end());	

// -- debug
// srv.use((req,res,next)=>{
// 	console.log('url:', req.path, req.query)
// 	next()
// })


  // SSE
srv.get('/sse', function(req, res) {
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

srv.use(
	  redirectToSlash,
		// compression({ threshold: 0 }),
    dynamicPages,
		sirv('server/pages', { dev })
	)

srv.listen(port, err => {
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

  