var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var assetsMap = require('./assets.json');
var config = require('./config.js')[process.env.NODE_ENV || 'development'];

var templatePath = path.join(__dirname, './template/');

var resultPath = path.join(__dirname, '../views');

scanDir(templatePath, resultPath);

/**
 * 递归扫描文件夹下所有的文件
 * @param dirpath
 * @param resultPath
 */
function scanDir(dirpath, resultPath) {
    var views = fs.readdirSync(dirpath).sort();
    views = views.filter(function (val, index) {
        return ['.DS_Store', '.svn', '.git'].indexOf(val) === -1;
    });

    views.forEach(function (filename, index) {
        var realPath = path.join(dirpath, filename);
        var stat = fs.statSync(realPath);
        if (stat.isFile()) {
            generateHtml(realPath, resultPath);
        } else if (stat.isDirectory()) {
            scanDir(realPath, resultPath);
        }
    });
}
/**
 * 生成html文件
 * @param template
 * @param resultPath
 */
function generateHtml(template, resultPath) {
    var indexFileData = fs.readFileSync(template, 'utf8');
    var fileName = path.relative(templatePath, template);
    var dirname = path.dirname(fileName);
    // 创建文件夹，否则写文件时会报错
    makeDir(dirname, resultPath);

    var data = {
        staticFile: function (fileName) {
            var staticFileName = fileName;
            if (process.env.NODE_ENV === 'production') {
                staticFileName = assetsMap[fileName];
            } else {
                staticFileName = fileName + '?v=' + new Date().getTime();
            }
            var result = config.publicPath + staticFileName;
            return path.normalize(result);
        },
    }

    var resultHtmlData = ejs.render(indexFileData, data, {});
    fs.writeFileSync(path.join(resultPath, fileName), resultHtmlData);

    console.log('generate HTML file :' + path.join(resultPath, fileName));
}
/**
 * 创建目录，由于nodejs只能在已经存在的目录中创建目录，这里要逐级创建
 * TODO 也许有更好的方法
 * @param dirname
 * @param resultPath
 */
function makeDir(dirname, resultPath) {
    var dirs = dirname.split(path.sep);
    dirs.forEach(function (d, i) {
        var resultDir = path.join(resultPath, d);
        if (!fs.existsSync(resultDir)) {
            fs.mkdirSync(resultDir);
        }
        resultPath = path.join(resultPath, d);
    });
}
