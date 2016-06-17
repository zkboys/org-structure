/*
 * 生成第三方引用的文件
 * */
var fs = require('fs');
var path = require('path');
var crypto = require("crypto");

function getAllLibrary(library) {
    var libraries = [];
    var jsFiles = [];
    var cssFiles = [];
    var favicon = '';
    for (var i = 0; i < library.length; i++) {
        var fromName = library[i].from;
        var toName = fileNameWithMd5(fromName);
        if (path.extname(toName) === '.js') {
            jsFiles.push(toName);
        }
        if (path.extname(toName) === '.css') {
            cssFiles.push(toName);
        }
        if (toName.indexOf('favicon') > -1) { // FIXME 这个实现约束太多，不太好
            favicon = toName;
        }

        libraries.push({
            from: fromName,
            to: toName,
        });
    }
    return {
        library: libraries,
        jsFiles: jsFiles,
        cssFiles: cssFiles,
        favicon: favicon,
    };
}
exports.getAllLibrary = getAllLibrary;


function fileNameWithMd5(filePath) {
    var file = fs.readFileSync(filePath);
    var fileName = path.basename(filePath);
    var fileMd5 = md5(file);
    var fileNames = fileName.split('.');
    var md5Position = fileNames.length - 1;
    if (fileName.indexOf('.min') > -1) {
        md5Position = fileNames.length - 2;
    }
    fileNames.splice(md5Position, 0, fileMd5);
    return fileNames.join('.');
}

function md5(buf) {
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
}
