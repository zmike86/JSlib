﻿/* * YayaTemplate - A fast javascript template engine * https://github.com/zinkey/YayaTemplate * @copyright yaya&jihu * 2012 MIT License */(function (name, factory, context) {      'use strict';       // cmd    if (typeof module != 'undefined' && module.exports) {          module.exports = factory();      //amd    } else if (typeof context["define"] === "function" && context["define"].amd) {          define(name,factory);      // 直接anchor    } else {          context[name] = factory();      }	})("YayaTemplate",function(){    'use strict';        var _isModernBrow,  // 选择最优字符串拼接方法 boolean        _strMethod, // 最优字符串拼接方法        _sn,         _strObject, // 执行字符串方法的原对象        temp,        array,        len,        identifierstr,        value,        valuemap,        temnum,        temarr,        keyword,        render;    if (typeof document === "object" && typeof navigator === "object") {        _isModernBrow = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document || + RegExp['$1']) >=8 : true;    }    else{        _isModernBrow = true;    }	// 针对现代浏览器，对js字符串相加做了优化，性能比数组操作要好    if (_isModernBrow) {        _strMethod = "+=";        _strObject = "''";        _sn = "";    }	// 针对老版本IE 在字符窜较长或操作次数较多 > 2000的情况下，数组join性能较好    else {        _strMethod = ".push";        _strObject = "[]";        _sn = ".join('')";    }	// 判断是否js关键字,包含了ECMA-262    function isKeyword(id) {        keyword = false;        switch (id.length) {        case 2:            keyword = (id === 'if') || (id === 'in') || (id === 'do');            break;        case 3:            keyword = (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try') || (id === 'let');            break;        case 4:            keyword = (id === 'this') || (id === 'else') || (id === 'case') || (id === 'void') || (id === 'with') ||(id === 'enum');            break;        case 5:            keyword = (id === 'while') || (id === 'break') || (id === 'catch') || (id === 'throw') || (id === 'const') || (id === 'yield') || (id === 'class') || (id === 'export') || (id === 'import') || (id === 'super');            break;        case 6:            keyword = (id === 'return') || (id === 'typeof') || (id === 'delete') || (id === 'switch') || (id === 'public') || (id === 'static');            break;        case 7:            keyword = (id === 'default') || (id === 'finally') || (id === 'package') || (id === 'private') || (id === 'extends');            break;        case 8:            keyword = (id === 'function') || (id === 'continue') || (id === 'debugger');            break;        case 9:            keyword = (id === 'interface') || (id === 'protected');            break;        case 10:            keyword = (id === 'instanceof') || (id === 'implements');            break;        }        return keyword;    }    	// 传入模板字符串，返回函数体的toString结果    /*    {$<ul>$}        for (var i = 0, l = list.length; i < l; i ++) {             {$<li>{%list[i].index%}. 用户: {%list[i].user%}/ 网站：{%list[i].site%}</li>$}        }    {$</ul>$}    	|||	|||	|||	VVV	step1:    {$<ul>$}        for (var i = 0, l = list.length; i < l; i ++) {             {$<li>YayaTemplateFLAG0. 用户: YayaTemplateFLAG1/ 网站：YayaTemplateFLAG2</li>$}        }    {$</ul>$}	|||	|||	|||	VVV	step2:	    _YayaTemplateString+=("<ul>");        for (var i = 0, l = list.length; i < l; i ++) {             _YayaTemplateString+=("<li>YayaTemplateFLAG0. 用户: YayaTemplateFLAG1/ 网站：YayaTemplateFLAG2</li>");        }    _YayaTemplateString+=("</ul>");	|||	|||	|||	VVV	step3:    _YayaTemplateString+=("<ul>");        for (var i = 0, l = list.length; i < l; i ++) {             _YayaTemplateString+=("<li>");			_YayaTemplateString+=(list[i].index);			_YayaTemplateString+=(". 用户: ");			_YayaTemplateString+=(list[i].user);			_YayaTemplateString+=("/ 网站：");			_YayaTemplateString+=(list[i].site);			_YayaTemplateString+=("</li>");        }    _YayaTemplateString+=("</ul>");	|||	|||	|||	VVV		step4:	"var _YayaTemplateString=_YayaTemplateObject["_YayaTemplateString"],		i=_YayaTemplateObject["i"],		list=_YayaTemplateObject["list"],		l=_YayaTemplateObject["l"],		_YayaTemplateString='';		_YayaTemplateString+=("<ul>");			for (var i = 0, l = list.length; i < l; i ++) { 				_YayaTemplateString+=("<li>");				_YayaTemplateString+=(list[i].index);				_YayaTemplateString+=(". 用户: ");				_YayaTemplateString+=(list[i].user);				_YayaTemplateString+=("/ 网站：");				_YayaTemplateString+=(list[i].site);				_YayaTemplateString+=("</li>");			}		_YayaTemplateString+=("</ul>");	 return _YayaTemplateString;"		*/	function analyze(text) {        temnum = -1; // 记录执行的js代码片段索引        temarr = []; // 记录执行的js代码片段		// step1        temp =  text.replace(/{\%([\s\S]*?)\%}/g, function(a,b) {			// 获取执行的js代码 {%  /*code here*/  %}            temarr[++temnum] = '");_YayaTemplateString' + _strMethod + '(' + b + ');_YayaTemplateString' + _strMethod + '("';            return "YayaTemplateFLAG" + temnum;				// step2        }).replace(/{\$([\s\S]*?)\$}/g, function(a,b) {			// 去掉一些换行 回车 \ 和 "            return '_YayaTemplateString' + _strMethod + '("' + b.replace(/("|\\|\r|\n)/g,"\\$1")+'");';				// step3        }).replace(/YayaTemplateFLAG(\d+)/g, function(a,b) {			// 替换之前埋下的钩子为要执行的js代码            return temarr[b];        });		// step4        array = temp.replace(/"([^\\"]|\\[\s\S])*"|'([^\\']|\\[\s\S])*'/g,"").replace(/\.[\_\$\w]+/g,"").match(/[\_\$a-zA-Z]+[0-9]*/g);        len = array.length;        valuemap = {};        identifierstr = '';        while(len--)        {            value = array[len];            if (!valuemap[value] && !isKeyword(value))            {                identifierstr += value + '=_YayaTemplateObject["'+value+'"],';                valuemap[value] = true;            }        }        return "var " + identifierstr + "_YayaTemplateString=" + _strObject + ";" + temp + " return _YayaTemplateString" + _sn + ";";    }	// 提供一些属性扩展	var helper = {		};    return function(str){		//render返回的是当前模板字符串的编译后的方法        return {            render: new Function("_YayaTemplateObject", analyze(str)),			helper: helper        };    };},this);