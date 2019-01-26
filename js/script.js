
var on = addEventListener,
    $ = function(q) {
        return document.querySelector(q)
    },
    $$ = function(q) {
        return document.querySelectorAll(q)
    },
    $body = document.body,
    $inner = $('.inner'),
    client = (function() {
        var o = {
                browser: 'other',
                browserVersion: 0,
                os: 'other',
                osVersion: 0,
                canUse: null
            },
            ua = navigator.userAgent,
            a, i;
        a = [
            ['firefox', /Firefox\/([0-9\.]+)/],
            ['edge', /Edge\/([0-9\.]+)/],
            ['safari', /Version\/([0-9\.]+).+Safari/],
            ['chrome', /Chrome\/([0-9\.]+)/],
            ['ie', /Trident\/.+rv:([0-9]+)/]
        ];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.browser = a[i][0];
                o.browserVersion = parseFloat(RegExp.$1);
                break;
            }
        }
        a = [
            ['ios', /([0-9_]+) like Mac OS X/, function(v) {
                return v.replace('_', '.').replace('_', '');
            }],
            ['ios', /CPU like Mac OS X/, function(v) {
                return 0
            }],
            ['android', /Android ([0-9\.]+)/, null],
            ['mac', /Macintosh.+Mac OS X ([0-9_]+)/, function(v) {
                return v.replace('_', '.').replace('_', '');
            }],
            ['windows', /Windows NT ([0-9\.]+)/, null],
            ['undefined', /Undefined/, null],
        ];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.os = a[i][0];
                o.osVersion = parseFloat(a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1);
                break;
            }
        }
        var _canUse = document.createElement('div');
        o.canUse = function(p) {
            var e = _canUse.style,
                up = p.charAt(0).toUpperCase() + p.slice(1);
            return (p in e || ('Moz' + up) in e || ('Webkit' + up) in e || ('O' + up) in e || ('ms' + up) in e);
        };
        return o;
    }()),
    trigger = function(t) {
        if (client.browser == 'ie') {
            var e = document.createEvent('Event');
            e.initEvent(t, false, true);
            dispatchEvent(e);
        } else dispatchEvent(new Event(t));
    };
on('load', function() {
    setTimeout(function() {
        $body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
        setTimeout(function() {
            $body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
        }, 1625);
    }, 100);
});
var style, sheet, rule;
style = document.createElement('style');
style.appendChild(document.createTextNode(''));
document.head.appendChild(style);
sheet = style.sheet;
if (client.os == 'android') {
    (function() {
        sheet.insertRule('body::after { }', 0);
        rule = sheet.cssRules[0];
        var f = function() {
            rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
        };
        on('load', f);
        on('orientationchange', f);
        on('touchmove', f);
    })();
} else if (client.os == 'ios') {
    (function() {
        sheet.insertRule('body::after { }', 0);
        rule = sheet.cssRules[0];
        rule.style.cssText = '-webkit-transform: scale(1.0)';
    })();
    (function() {
        sheet.insertRule('body.ios-focus-fix::before { }', 0);
        rule = sheet.cssRules[0];
        rule.style.cssText = 'height: calc(100% + 60px)';
        on('focus', function(event) {
            $body.classList.add('ios-focus-fix');
        }, true);
        on('blur', function(event) {
            $body.classList.remove('ios-focus-fix');
        }, true);
    })();
} else if (client.browser == 'ie') {
    (function() {
        var x = $('body'),
            s = getComputedStyle(x, ':before');
        if (s.content == '""') {
            document.styleSheets[0].addRule('body:before', 'content: none !important;');
            x.style.backgroundImage = s.backgroundImage;
            x.style.backgroundPosition = s.backgroundPosition;
            x.style.backgroundRepeat = s.backgroundRepeat;
            x.style.backgroundSize = s.backgroundSize;
            x.style.backgroundColor = s.backgroundColor;
            x.style.backgroundAttachment = 'fixed';
        }
    })();
    (function() {
        var t, f;
        f = function() {
            var mh, h, s, xx, x, i;
            x = $('#wrapper');
            x.style.height = 'auto';
            if (x.scrollHeight <= innerHeight) x.style.height = '100vh';
            xx = $$('.container.full');
            for (i = 0; i < xx.length; i++) {
                x = xx[i];
                s = getComputedStyle(x);
                x.style.minHeight = '';
                x.style.height = '';
                mh = s.minHeight;
                x.style.minHeight = 0;
                x.style.height = '';
                h = s.height;
                if (mh == 0) continue;
                x.style.height = (h > mh ? 'auto' : mh);
            }
        };
        (f)();
        on('resize', function() {
            clearTimeout(t);
            t = setTimeout(f, 250);
        });
        on('load', f);
    })();
}
if (!client.canUse('object-fit')) {
    (function() {
        var xx = $$('.image[data-position]'),
            x, c, i, src;
        for (i = 0; i < xx.length; i++) {
            x = xx[i];
            c = x.firstChild;
            if (c.tagName != 'IMG') c = c.firstChild;
            if (c.parentNode.classList.contains('deferred')) {
                c.parentNode.classList.remove('deferred');
                src = c.getAttribute('data-src');
                c.removeAttribute('data-src');
            } else src = c.getAttribute('src');
            c.style['backgroundImage'] = 'url(\'' + src + '\')';
            c.style['backgroundSize'] = 'cover';
            c.style['backgroundPosition'] = x.dataset.position;
            c.style['backgroundRepeat'] = 'no-repeat';
            c.src = 'data:image/svg+xml;charset=utf8,' + escape('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>');
        }
    })();
    (function() {
        var xx = $$('.gallery img'),
            x, p, i, src;
        for (i = 0; i < xx.length; i++) {
            x = xx[i];
            p = x.parentNode;
            if (p.classList.contains('deferred')) {
                p.classList.remove('deferred');
                src = x.getAttribute('data-src');
            } else src = x.getAttribute('src');
            p.style['backgroundImage'] = 'url(\'' + src + '\')';
            p.style['backgroundSize'] = 'cover';
            p.style['backgroundPosition'] = 'center';
            p.style['backgroundRepeat'] = 'no-repeat';
            x.style['opacity'] = '0';
        }
    })();
}
