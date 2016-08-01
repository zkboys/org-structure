var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var assetsMap = require('./assets.json');
var config = require('./config.js')[process.env.NODE_ENV || 'development'];

var templatePath = path.join(__dirname, './template/');
var indexFile = path.join(templatePath, './index.html');
var signinFile = path.join(templatePath, './signin.html');

var resultPath = path.join(__dirname, '../views');

function generateHtml(template, resultPath) {
    var indexFileData = fs.readFileSync(template, 'utf8');
    var extname = path.extname(template);
    var basename = path.basename(template, extname);
    var fileName = basename + extname;
    var data = {
        staticFile: function (fileName) {
            var staticFileName = fileName;
            if (process.env.NODE_ENV === 'pro') {
                staticFileName = assetsMap[fileName];
            } else {
                staticFileName = fileName + '?v=' + new Date().getTime();
            }
            var result = config.publicPath + staticFileName;
            return result.replace('/./', '/');
        },
    }

    var resultHtmlData = ejs.render(indexFileData, data, {});
    fs.writeFileSync(path.join(resultPath, fileName), resultHtmlData);
    console.log('generate HTML file :' + path.join(resultPath, fileName));
}
// todo 先简单做下面写两行，如果template文件过多，可以考虑读取目录得方式，把template统一转化到views目录下，
generateHtml(indexFile, resultPath);
generateHtml(signinFile, resultPath);