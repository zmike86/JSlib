/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the GPL Licenses.
 *
 * Date: Fri Jul,20th
 * Copyright 2012
 *
 * Usage: if (UA.engine.webkit != 0){
 *            // your code
 *		  }     
 *		  if (UA.browser.ie != 0){ ... }
 *		  if (UA.system.ipad){ ... }
 *
 * 
 * Description: 
 *     code deprived from Nicholas.zakas           
 *
 */
;
define(function(require, exports, module) {
    
    // renderer engine detection
    var engine = {
        ie:0,
        gecko:0,
        webkit:0,
        khtml:0,
        opera:0,
        ver:null
    };
    
    // web browser detection
    var browser = {
        ie:0,
        firefox:0,
        safari:0,
        konq:0,
        opera:0,
        chrome:0,
        ver:null       
    };
    
    // OS
    var system = {
        win:false,
        mac:false,
        x11:false,
        
        // portable device
        iphone:false,
        ipod:false,
        ipad:false,
        ios:false,
        android:false,
        nokiaN:false,
        winMobile:false,
        
        // game system
        wii:false,
        ps:false
    };
    
    // detecting
    var ua = navigator.userAgent;
    if(window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
        
    } else if(/AppleWebKit\/(\S+)/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        
        //confirm chrome or safari
        if(/Chrome\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);   
                     
        } else if(/Version\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);  
        
        } else {
            // confirm the foggy version 
            var safariVersion = 1;
            if(engine.webkit < 100) {
                safariVersion = 1;
            
            } else if(engine.webkit < 312) {
                safariVersion = 1.2;
            
            } else if(engine.webkit < 412) {
                safariVersion = 1.3;
            
            } else{
                safariVersion = 2;
            }
            
            browser.safari = browser.ver = safariVersion;
        
        }
    } else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);            
    
    } else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver); 
        
        // confirm if it's firefox or not
        if(/Firefox\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);              
        }           
    
    } else if(/MSIE ([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);        
    }
    
    // detect web browser
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    
    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    // detect windows OS
    if(system.win) {
        if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if(RegExp["$1"] == "NT") {
                switch(RegExp["$2"]) {
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;                        
                }
            } else if(RegExp["$1"] == "9x") {
                system.win = "ME";
            } else{
                system.win = RegExp["$1"];
            }
        }
    }
    
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    
    // windows mobile
    if(system.win == "CE") {
        system.winMobile = system.win;
    } else if(system.win == "Ph") {
        if(/Windos Phone OS (\d+.\d+)/.test(ua)) {
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }
    
    //detect ios
    if(system.mac && ua.indexOf("Mobile") > -1) {
        if(/CPU (?:iPhone)?OS (\d+_\d+)/.test(ua)) {
            system.ios = parseFloat(RegExp.$1.replace("_","."));
        } else{
            system.ios = 2; //guess the result
        }
    }
    
    //detect android
    if(/Android (\d+\.\d+)/.test(ua)) {
        system.android = parseFloat(RegExp.$1);
    }
    
    // game system
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    
    module.exports = {
        engine :engine,
        browser:browser,
        system :system
    };

});