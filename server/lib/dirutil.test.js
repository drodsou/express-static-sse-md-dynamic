import {__dirname,__filename, dir} from './dirutil.js';

console.warn('WARN: manual test required')

console.log(__dirname(import.meta.url))
console.log(__filename(import.meta.url))
console.log(dir(__dirname(import.meta.url)))

