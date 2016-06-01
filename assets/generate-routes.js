/*
* 递归同步抓取src/page  下所有一Routes.js命名的文件，最终生成src/page/allRoutes.js文件
* */
var fs = require('fs');
var path = require('path');
var pagePath = path.join(__dirname, './src/page');
var imports = [];
var routesNames = [];
getRoutes(pagePath);
var fileString = imports.join('\n');
fileString += '\nexport default [].concat(\n    ';
fileString += routesNames.join(',\n    ');
fileString += '\n);\n';
fs.writeFileSync(path.join(__dirname, './src/page/AllRoutes.js'), fileString);

function getRoutes(filePath, fileName) {
    var stat = fs.statSync(filePath);
    var isDir = stat.isDirectory();
    if (isDir) {
        var files = fs.readdirSync(filePath)
        if (files && files.length) {
            files.forEach(function (fn) {
                var fp = path.join(filePath, fn);
                getRoutes(fp, fn);
            });
        }
    } else {
        if (fileName === 'Routes.js') {
            var pathName = filePath.replace(pagePath, '');
            var routesPath = '.'+pathName;
            pathName = pathName.replace('.js', '');
            pathName = pathName.split('/');
            var pName = '';
            pathName.forEach(function (p) {
                if(p){
                    var ps = p.split('-');
                    ps.forEach(function (v) {
                        pName += v.replace(/(\w)/, function (v) {
                            return v.toUpperCase()
                        });
                    });
                }
            });
            console.log(routesPath);
            routesNames.push(pName);
            imports.push("import " + pName + " from '"+routesPath+"';");
        }
    }
}

