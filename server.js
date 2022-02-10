const sirv = require('sirv');
const express = require('express');   // dont use polka, does not send SSE messages
const compression = require('compression');

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const port = parseInt(PORT) || 3000;



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

  const fs = require('fs')
  const frontMatter = require('front-matter')
  const { marked} = require('marked');
  function dynamicPages(req,res,next) {
    // -- find file
    let filePattern = __dirname + '/pages' + req.originalUrl;
    if (filePattern.endsWith('/')) { filePattern = filePattern.slice(0,-1); }
    let extensions = ['.html.js', '/index.html.js', '.json.js', '/index.json.js', '.md', '/index.md']
    let file;
    for (let ext of extensions) {
      if (fs.existsSync(filePattern + ext)) {
        file = filePattern + ext;
        break;
      }
    }
    if (!file) {
      return next();
    }

    // -- process file
    let result;
    if (file.endsWith('.md')) {
      // -- markdown
      let fm = frontMatter(fs.readFileSync(file, 'utf8'));
      Object.keys(fm.attributes).forEach(attr=>{
        fm.body = fm.body.replace(new RegExp(`{${attr}}`,'g'),fm.attributes[attr]);
      });
      result = `<!DOCTYPE html><html lang="en"><head><title>${fm.attributes.title}</title></head><body>${marked.parse(fm.body)}</body></html>`;
    } else {
      // -- .html.js or .json.js
      delete require.cache[require.resolve(file)];
      let pageFn = require(file);
      result = pageFn({req,props:'serverProps'});
    }

    // -- send result
    res.writeHeader(200, {"Content-Type": file.includes('.json') ? "application/json" : "text/html"});  
    res.write(result);  
    res.end();

  }