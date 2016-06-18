'use strict';

// 仅在构建时使用，运行时无需引入
var path = require('path');
var fs = require('fs');
var colors = require('colors');
var kitx = require('kitx');

var md5 = function (content) {
    return kitx.md5(content, 'hex').slice(24);
};
var viewsDir = path.join(__dirname, '../views/');
var staticDir = path.join(__dirname, '../public/');

var staticFilesName = scanDir(viewsDir);
var staticFilesMap = {};
staticFilesName.forEach(function (fileName) {
    var fileMap = fileNameMap(staticDir, fileName);
    staticFilesMap[fileMap[0]] = fileMap[1];
});

var assetsPath = path.join(__dirname, '../assets.json');
fs.writeFileSync(assetsPath, JSON.stringify(staticFilesMap));
console.log(staticFilesMap);
console.log(colors.magenta("assets.json is here: "), colors.cyan(assetsPath));

function fileNameMap(basedir, realPath) {
    var extname = path.extname(realPath);
    var basename = path.basename(realPath, extname);
    var dirname = path.dirname(realPath);
    var file = fs.readFileSync(path.join(basedir, realPath));
    var hashed = md5(file);
    var hashedFileName = `${dirname}/${basename}.${hashed}${extname}`;
    fs.writeFileSync(path.join(basedir, hashedFileName), file);
    return [realPath, hashedFileName];
}

/**
 * 根据文件内容，扫描文件
 * @param fileContent
 * @returns {Array}
 */
function scanFile(fileContent) {
    var patt = /staticFile\([\s\S]*?\)/gm;
    var argPatt = /staticFile\(['"]([^'"]+)['"][^\)]*?\)/g;

    var retVal = [];

    var block;
    while ((block = patt.exec(fileContent)) !== null) {
        var find = block[0];
        if (find) {
            var arg;
            while ((arg = argPatt.exec(find)) !== null) {
                var src = arg[1];
                retVal.push(src);
            }
        }
    }
    return retVal;
};

/**
 * 扫描指定目录，生成合并压缩映射关系数组
 *
 * @param {String} dirpath The dir path
 */
function scanDir(dirpath) {
    var views = fs.readdirSync(dirpath).sort();
    var combo = [];

    views = views.filter(function (val, index) {
        return ['.DS_Store', '.svn', '.git'].indexOf(val) === -1;
    });

    views.forEach(function (filename, index) {
        var realPath = path.join(dirpath, filename);
        var stat = fs.statSync(realPath);
        if (stat.isFile()) {
            var section = fs.readFileSync(realPath, 'utf8');
            combo = combo.concat(scanFile(section));
        } else if (stat.isDirectory()) {
            combo = combo.concat(scanDir(realPath));
        }
    });

    return combo;
};
/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
function uniqueArray(arr) {
    var n = [];
    for (var i = 0; i < arr.length; i++) {
        if (n.indexOf(arr[i]) == -1) {
            n.push(arr[i]);
        }
    }
    return n;
}
