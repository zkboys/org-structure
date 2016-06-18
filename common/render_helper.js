/*!
 * nodeclub - common/render_helpers.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var MarkdownIt = require('markdown-it');
var _ = require('lodash');
var config = require('../config');
var validator = require('validator');
var jsxss = require('xss');
var multiline = require('multiline')
var kitx = require('kitx');
var fs = require('fs');
var path = require('path');
var asstes = require('../assets');

var md5 = function (content) {
    return kitx.md5(content, 'hex').slice(24);
};
// Set default options
var md = new MarkdownIt();

md.set({
    html: true,        // Enable HTML tags in source
    xhtmlOut: false,        // Use '/' to close single tags (<br />)
    breaks: false,        // Convert '\n' in paragraphs into <br>
    linkify: true,        // Autoconvert URL-like text to links
    typographer: true,        // Enable smartypants and other sweet transforms
});

md.renderer.rules.fence = function (tokens, idx) {
    var token = tokens[idx];
    var language = token.info && ('language-' + token.info) || '';
    language = validator.escape(language);

    return '<pre class="prettyprint ' + language + '">'
        + '<code>' + validator.escape(token.content) + '</code>'
        + '</pre>';
};

md.renderer.rules.code_block = function (tokens, idx /*, options*/) {
    var token = tokens[idx];

    return '<pre class="prettyprint">'
        + '<code>' + validator.escape(token.content) + '</code>'
        + '</pre>';
};

var myxss = new jsxss.FilterXSS({
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        // 让 prettyprint 可以工作
        if (tag === 'pre' && name === 'class') {
            return name + '="' + jsxss.escapeAttrValue(value) + '"';
        }
    }
});

exports.markdown = function (text) {
    return '<div class="markdown-text">' + myxss.process(md.render(text || '')) + '</div>';
};

exports.escapeSignature = function (signature) {
    return signature.split('\n').map(function (p) {
        return _.escape(p);
    }).join('<br>');
};

exports.staticFile = function (filePath) {
    if (filePath.indexOf('http') === 0 || filePath.indexOf('//') === 0) {
        return filePath;
    }
    if (process.env.NODE_ENV === 'production') {
        var hashedfilePath = asstes[filePath];
        return config.site_static_host + hashedfilePath;
    }
    var queryString = new Date().getTime();
    return config.site_static_host + filePath + '?v=' + queryString;
};

exports.tabName = function (tab) {
    var pair = _.find(config.tabs, function (pair) {
        return pair[0] === tab;
    });
    if (pair) {
        return pair[1];
    }
};

exports.proxy = function (url) {
    return url;
    // 当 google 和 github 封锁严重时，则需要通过服务器代理访问它们的静态资源
    // return '/agent?url=' + encodeURIComponent(url);
};

// 为了在 view 中使用
exports._ = _;
exports.multiline = multiline;
