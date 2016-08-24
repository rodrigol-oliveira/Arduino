# Arduino
Node to save and display Arduino data

### MySQL
`mysql -u root -p`

`source reset.sql`

### NodeJS
`npm install` 

`nodemon index.js`

### Browser
`localhost:3000`

`localhost:3000/save?temperatura=13`

`localhost:3000/dashboard`

### EJS template language
`http://www.embeddedjs.com/`

### Comandos Git
`git clone https://github.com/rodrigol-oliveira/Arduino.git`  
para baixar o pacote 

`git pull`  
para baixar atualizações

`git status`  
para listar os arquivos modificados

`git add .`  
para adicionar os arquivos modificados

`git commit -m 'mensagem do commit'`  
para fazer um commit

`git push`  
para enviar os ajustes para o Github

============================

> encodeURIComponent("http://examplé.org/rosé?rosé=rosé")
'http%3A%2F%2Fexampl%C3%A9.org%2Fros%C3%A9%3Fros%C3%A9%3Dros%C3%A9'

$ npm install urlencode
var urlencode = require('urlencode');

console.log(urlencode('苏千')); // default is utf8 
console.log(urlencode('苏千', 'gbk')); // '%CB%D5%C7%A7' 
 
// decode gbk 
urlencode.decode('%CB%D5%C7%A7', 'gbk'); // '苏千' 
 
// parse gbk querystring 
urlencode.parse('nick=%CB%D5%C7%A7', {charset: 'gbk'}); // {nick: '苏千'} 

============================

