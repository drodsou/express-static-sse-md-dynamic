import fs from 'fs';

/** @type {(importMetaUrl:string) => string} */
export function __dirname (importMetaUrl) {
  return new URL('.', importMetaUrl).pathname
    .replace(/^\/([A-Z]:)/,'$1')  // in windows, remove first /
    .slice(0,-1)  // remove last /
    
}

/** @type {(importMetaUrl:string) => string} */
export function __filename (importMetaUrl) {
  return new URL('', importMetaUrl).pathname.replace(/^\/([A-Z]:)/,'$1');
}

/** @type {(d:string) => string[]} */
export function dir (d) {
  return fs.readdirSync(d, {withFileTypes:true})
  .map(f=>f.isDirectory() ? dir(d + '/' + f.name) : d + '/' + f.name)
  .flat();
}
