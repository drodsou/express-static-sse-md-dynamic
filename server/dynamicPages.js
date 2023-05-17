import fsProm from 'fs/promises'
import frontMatter from 'front-matter';
import {marked} from 'marked';

import layout from '#root/server/comp/layout.js';

import {dir} from '#root/server/lib/dirutil.js';
const pagesDir = process.cwd() +  '/server/pages';
const pagesFiles = dir(pagesDir)

const dynExtensions = ['.html.js', '/index.html.js', '.json.js', '/index.json.js', '.md', '/index.md']

export default async function dynamicPages (req,res,next) {
    // -- find file
    // let filePattern = pagesDir + req.originalUrl;
    let filePattern = pagesDir + req.path;
    if (filePattern.endsWith('/')) { filePattern = filePattern.slice(0,-1); }
    // console.log('filePattern', filePattern)
    let file;
    for (let ext of dynExtensions) {
      
      // -- prevent static download of files with dynamic extensions (server side code)
      if (filePattern.endsWith(ext)) {
        return res.sendStatus(404).end()
      }

      // -- normal dynamic process, try each extension
      if (pagesFiles.includes(filePattern + ext)) {
        
      // if (fs.existsSync(filePattern + ext)) {
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
      let fm = frontMatter(await fsProm.readFile(file, 'utf8'));
      Object.keys(fm.attributes).forEach(attr=>{
        fm.body = fm.body.replace(new RegExp(`{${attr}}`,'g'),fm.attributes[attr]);
      });
      // TODO: use comp/layout
      // result = `<!DOCTYPE html><html lang="en"><head><title>${fm.attributes.title}</title></head><body>${marked.parse(fm.body)}</body></html>`;
      result = layout({title:fm.attributes.title, body: marked.parse(fm.body)})
    } else {
      // -- .html.js or .json.js
      // delete require.cache[require.resolve(file)];
      let pageFn = (await import('file://' + file + '?' + Date.now() )).default; // skip cache (no need to reboot server)
      // let pageFn = (await import('file://' + file)).default; // cache (need to reboot server)
      result = await pageFn({req, props:req.query});
    }

    // -- send result
    res.writeHeader(200, {"Content-Type": file.includes('.json') ? "application/json" : "text/html"});  
    res.write(file.includes('.json') ? JSON.stringify(result,null,2) :  result);  
    res.end();

  }