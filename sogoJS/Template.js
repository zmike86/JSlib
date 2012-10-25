/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the MIT, GPL Licenses.
 *
 * Usage:
 *  var data = {
 *      index: i,
 *      user: '<strong style="color:red">糖饼</strong>',
 *      site: 'http://www.planeart.cn',
 *      weibo: 'http://weibo.com/planeart',
 *      QQweibo: 'http://t.qq.com/tangbin'  
 *    } 
 *  var template = Template.compile(htmlStr);
 *  Template.extend(Template.helper,{
 *      validate:function(){
 *           // code here
 *      }
 *  });
 *  template.render(data);
 * 
 * Description: 
 *  Due to yayaTemplate is the most fast webbrowser js template, the method render
 *  html string used it for reference.
 *
 * Date: Fri Jul,20th
 * Copyright 2012
 *
 *
 */
 ;
 define(function(require, exports, module) {
    
    var Object = require("./lang/Object"); 
    var UA = require("./UA");
    
    module.exports = (function() {
	    
	    var helper = { };   // 提供一些属性扩展     
        var _isModernBrow,  // 选择最优字符串拼接方法 boolean
            _strMethod, // 最优字符串拼接方法
            _sn, 
            _strObject, // 执行字符串方法的原对象
            temp,
            array,
            len,
            identifierstr,
            value,
            valueMap = {},
            temnum,
            temarr,
            keyword,
            render,
            keyWords = ["break","case","catch","continue","debugger","default","delete","do","else","false","finally","for","function","if","in","instanceof",
            "new","null","return","switch","this","throw","true","try","typeof","var","void","while","with","abstract","boolean","byte","char","class","const",
            "double","enum","export","extends","final","float","goto","implements","import","int","interface","long","native","package","private","protected",
            "public","short","static","super","synchronized","throws","transient","volatile","arguments","let","yield"]; 
        
        for(var i=0;i<keyWords.length;i++){
            keyword = keyWords[i];
            valueMap[keyword] = true;
        }
	    
        _isModernBrow = !!UA.browser.ie ? UA.browser.ie >=8 : true;
	    // 针对现代浏览器，对js字符串相加做了优化，性能比数组操作要好
        if (_isModernBrow) {
            _strMethod = "+=";
            _strObject = "''";
            _sn = "";
        }
	    // 针对老版本IE 在字符窜较长或操作次数较多 > 2000的情况下，数组join性能较好
        else {
            _strMethod = ".push";
            _strObject = "[]";
            _sn = ".join('')";
        }
        
	    // 传入模板字符串，返回函数体的toString结果
        /*
        {$<ul>$}
            for (var i = 0, l = list.length; i < l; i ++) { 
                {$<li>{%list[i].index%}. 用户: {%list[i].user%}/ 网站：{%list[i].site%}</li>$}
            }
        {$</ul>$}
        
	    |||
	    |||
	    |||
	    VVV

	    step1:
        {$<ul>$}
            for (var i = 0, l = list.length; i < l; i ++) { 
                {$<li>_flag0. 用户: _flag1/ 网站：_flag2</li>$}
            }
        {$</ul>$}

	    |||
	    |||
	    |||
	    VVV

	    step2:	
        _TemplateString+=("<ul>");
            for (var i = 0, l = list.length; i < l; i ++) { 
                _TemplateString+=("<li>_flag0. 用户: _flag1/ 网站：_flag2</li>");
            }
        _TemplateString+=("</ul>");

	    |||
	    |||
	    |||
	    VVV

	    step3:
        _TemplateString+=("<ul>");
            for (var i = 0, l = list.length; i < l; i ++) { 
                _TemplateString+=("<li>");
			    _TemplateString+=(list[i].index);
			    _TemplateString+=(". 用户: ");
			    _TemplateString+=(list[i].user);
			    _TemplateString+=("/ 网站：");
			    _TemplateString+=(list[i].site);
			    _TemplateString+=("</li>");
            }
        _TemplateString+=("</ul>");

	    |||
	    |||
	    |||
	    VVV
    	
	    step4:
	    "var _TemplateString=_args["_TemplateString"],
		    i=_args["i"],
		    list=_args["list"],
		    l=_args["l"],
		    _TemplateString='';
		    _TemplateString+=("<ul>");
			    for (var i = 0, l = list.length; i < l; i ++) { 
				    _TemplateString+=("<li>");
				    _TemplateString+=(list[i].index);
				    _TemplateString+=(". 用户: ");
				    _TemplateString+=(list[i].user);
				    _TemplateString+=("/ 网站：");
				    _TemplateString+=(list[i].site);
				    _TemplateString+=("</li>");
			    }
		    _TemplateString+=("</ul>");
	     return _TemplateString;"
    	
	    */

	    function compile(text) {
            temnum = -1; // 记录执行的js代码片段索引
            temarr = []; // 记录执行的js代码片段
		    // step1
            temp =  text.replace(/{\%([\s\S]*?)\%}/g, function(a,b) {

			    // 获取执行的js代码 {%  /*code here*/  %}
                temarr[++temnum] = '");_TemplateString' + _strMethod + '(' + b + ');_TemplateString' + _strMethod + '("';
                return "_flag" + temnum;
    		
		    // step2
            }).replace(/{\$([\s\S]*?)\$}/g, function(a,b) {
			    // 去掉一些换行 回车 \ 和 "
                return '_TemplateString' + _strMethod + '("' + b.replace(/("|\\|\r|\n)/g,"\\$1")+'");';
    		
		    // step3
            }).replace(/_flag(\d+)/g, function(a,b) {
			    // 替换之前埋下的钩子为要执行的js代码
                return temarr[b];

            });

		    // step4
            array = temp.replace(/"([^\\"]|\\[\s\S])*"|'([^\\']|\\[\s\S])*'/g,"")
                    .replace(/\.[\_\$\w]+/g,"")
                    .match(/[\_\$a-zA-Z]+[0-9]*/g);
            len = array.length;
            identifierstr = '';
            while(len--)
            {
                value = array[len];
                if (!valueMap[value])
                {
                    identifierstr += value + '=_args["'+value+'"],';
                    valueMap[value] = true;
                }
            }
            return "var " + identifierstr + "_TemplateString=" + _strObject + ";" + temp + " return _TemplateString" + _sn + ";";
        }
        
        return {
            helper :helper,  
            compile:function(str){
                var template = compile(str);
                return {
                    //render返回的是当前模板字符串的编译后的方法
                    render: new Function("_args", template)
                };
            },
            extend:function(target,source){
                Object.extend(target,source,true);
            }        
        };
    
    })();
 
 });