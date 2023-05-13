import fs from 'fs';
import fsProm from 'fs/promises'
import frontMatter from 'front-matter';
import {marked} from 'marked';

const __dirname = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'); 

/** @type {(d:string) => string[]} */
const dir = (d) => fs.readdirSync(d, {withFileTypes:true})
  .map(f=>f.isDirectory() ? dir(d + '/' + f.name) : d + '/' + f.name)
  .flat();

const pages = dir(__dirname + 'pages')
console.log(pages)

export default async function dynamicPages (req,res,next) {
  console.log('dyn', req.originalUrl)
    // -- find file
    let filePattern = __dirname + 'pages' + req.originalUrl;
    if (filePattern.endsWith('/')) { filePattern = filePattern.slice(0,-1); }
    let extensions = ['.html.js', '/index.html.js', '.json.js', '/index.json.js', '.md', '/index.md']
    let file;
    for (let ext of extensions) {
      if (pages.includes(filePattern + ext)) {
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
      result = `<!DOCTYPE html><html lang="en"><head><title>${fm.attributes.title}</title></head><body>${marked.parse(fm.body)}</body></html>`;
    } else {
      // -- .html.js or .json.js
      // delete require.cache[require.resolve(file)];
      // let pageFn = (await import('file://' + file + '?' + Date.now() )).default; // + '?' +  Date.now()).default;
      let pageFn = (await import('file://' + file)).default; // + '?' +  Date.now()).default;
      result = pageFn({req,props:'serverProps'});
    }

    // -- send result
    res.writeHeader(200, {"Content-Type": file.includes('.json') ? "application/json" : "text/html"});  
    res.write(result);  
    res.end();

  }