(function() {
    "use strict";
    function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }
        return _typeof(obj);
    }
    function styleInject(css, ref) {
        if (ref === void 0) ref = {};
        var insertAt = ref.insertAt;
        if (!css || typeof document === "undefined") {
            return;
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        var style = document.createElement("style");
        style.type = "text/css";
        if (insertAt === "top") {
            if (head.firstChild) {
                head.insertBefore(style, head.firstChild);
            } else {
                head.appendChild(style);
            }
        } else {
            head.appendChild(style);
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
    var css_248z = ".alert{display:block;position:relative;word-wrap:break-word;word-break:break-word;padding:.75rem 1.25rem!important;margin-bottom:1rem!important}.alert>*{max-width:100%}.alert>:first-child{margin-top:0}.alert>:last-child{margin-bottom:0}.alert:before{content:unset!important}.alert+.alert{margin-top:-.25rem!important}.alert p{margin-top:.5rem;margin-bottom:.5rem}.alert .title{display:flex;align-items:center;flex-wrap:wrap;font-weight:600;margin:0}.icon{display:inline-block;width:16px;height:16px;background-repeat:no-repeat;margin-right:.5rem}.alert.callout{border:1px solid #eee;border-left-width:.25rem;border-radius:.25rem;background:var(--background)}.alert.callout.note{border-left-color:#17a2b8!important}.alert.callout.note .title{color:#17a2b8}.alert.callout.note .icon-note{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' fill='%2317a2b8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8 16A8 8 0 108 0a8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 100-2 1 1 0 000 2z'/%3E%3C/svg%3E\")}.alert.callout.tip{border-left-color:#28a745!important}.alert.callout.tip .title{color:#28a745}.alert.callout.tip .icon-tip{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 352 512' fill='%2328a745' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0026.64 14.28h61.71a31.99 31.99 0 0026.64-14.28l17.09-25.69a31.989 31.989 0 005.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z'/%3E%3C/svg%3E\")}.alert.callout.warning{border-left-color:#f0ad4e!important}.alert.callout.warning .title{color:#f0ad4e}.alert.callout.warning .icon-warning{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 17 16' fill='%23f0ad4e' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8.982 1.566a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 00-.9.995l.35 3.507a.552.552 0 001.1 0l.35-3.507A.905.905 0 008 5zm.002 6a1 1 0 100 2 1 1 0 000-2z'/%3E%3C/svg%3E\")}.alert.callout.attention{border-left-color:#dc3545!important}.alert.callout.attention .title{color:#dc3545}.alert.callout.attention .icon-attention{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' fill='%23dc3545' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z'/%3E%3Cpath fill-rule='evenodd' d='M11.354 4.646a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708l6-6a.5.5 0 01.708 0z'/%3E%3C/svg%3E\")}.alert.flat{border-radius:.125rem;color:#383d41;background-color:#e2e3e5;border:1px solid #d6d8db}.alert.flat.note{color:#02587f;background-color:#cdeefd;border-color:#b4e6fc}.alert.flat.note .title{color:#01354d}.alert.flat.note .icon-note{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' fill='%2301354d' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8 16A8 8 0 108 0a8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 100-2 1 1 0 000 2z'/%3E%3C/svg%3E\")}.alert.flat.tip{color:#285b2a;background-color:#dbefdc;border-color:#c9e7cb}.alert.flat.tip .title{color:#18381a}.alert.flat.tip .icon-tip{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 352 512' fill='%2318381a' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0026.64 14.28h61.71a31.99 31.99 0 0026.64-14.28l17.09-25.69a31.989 31.989 0 005.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z'/%3E%3C/svg%3E\")}.alert.flat.warning{color:#852d12;background-color:#ffddd3;border-color:#ffc9ba}.alert.flat.warning .title{color:#581e0c}.alert.flat.warning .icon-warning{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 17 16' fill='%23581e0c' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8.982 1.566a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 00-.9.995l.35 3.507a.552.552 0 001.1 0l.35-3.507A.905.905 0 008 5zm.002 6a1 1 0 100 2 1 1 0 000-2z'/%3E%3C/svg%3E\")}.alert.flat.attention{color:#7f231c;background-color:#fdd9d7;border-color:#fcc2bf}.alert.flat.attention .title{color:#551713}.alert.flat.attention .icon-attention{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' fill='%23551713' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z'/%3E%3Cpath fill-rule='evenodd' d='M11.354 4.646a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708l6-6a.5.5 0 01.708 0z'/%3E%3C/svg%3E\")}";
    styleInject(css_248z);
    (function() {
        var CONFIG = {
            style: "callout",
            note: {
                label: "Note",
                icon: "icon-note",
                className: "note"
            },
            tip: {
                label: "Tip",
                icon: "icon-tip",
                className: "tip"
            },
            warning: {
                label: "Warning",
                icon: "icon-warning",
                className: "warning"
            },
            attention: {
                label: "Attention",
                icon: "icon-attention",
                className: "attention"
            },
            typeMappings: {
                info: "note",
                danger: "attention"
            }
        };
        function mergeObjects(obj1, obj2) {
            var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            for (var property in obj2) {
                try {
                    if (obj2[property].constructor === Object && level < 1) {
                        obj1[property] = mergeObjects(obj1[property], obj2[property], level + 1);
                    } else {
                        obj1[property] = obj2[property];
                    }
                } catch (e) {
                    obj1[property] = obj2[property];
                }
            }
            return obj1;
        }
        var install = function install(hook, vm) {
            var options = mergeObjects(CONFIG, vm.config["flexible-alerts"] || vm.config.flexibleAlerts);
            var findSetting = function findAlertSetting(input, key, fallback, callback) {
                var match = (input || "").match(new RegExp("".concat(key, ":(([\\s\\w\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF-]*))")));
                if (!match) {
                    return callback ? callback(fallback) : fallback;
                }
                return callback ? callback(match[1]) : match[1];
            };
            hook.afterEach(function(html, next) {
                var modifiedHtml = html.replace(/<\s*blockquote[^>]*>(?:<p>|[\S\n]*)?\[!(\w*)((?:\|[\w*:[\s\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF-]*)*?)\]([\s\S]*?)(?:<\/p>)?<\s*\/\s*blockquote>/g, function(match, key, settings, value) {
                    if (!options[key.toLowerCase()] && options.typeMappings[key.toLowerCase()]) {
                        key = options.typeMappings[key.toLowerCase()];
                    }
                    var config = options[key.toLowerCase()];
                    if (!config) {
                        return match;
                    }
                    var style = findSetting(settings, "style", options.style);
                    var isIconVisible = findSetting(settings, "iconVisibility", "visible", function(value) {
                        return value !== "hidden";
                    });
                    var isLabelVisible = findSetting(settings, "labelVisibility", "visible", function(value) {
                        return value !== "hidden";
                    });
                    var label = findSetting(settings, "label", config.label);
                    var icon = findSetting(settings, "icon", config.icon);
                    var className = findSetting(settings, "className", config.className);
                    if (_typeof(label) === "object") {
                        var foundLabel = Object.keys(label).filter(function(key) {
                            return vm.route.path.indexOf(key) > -1;
                        });
                        if (foundLabel && foundLabel.length > 0) {
                            label = label[foundLabel[0]];
                        } else {
                            isLabelVisible = false;
                            isIconVisible = false;
                        }
                    }
                    var iconTag = '<span class="icon '.concat(icon, '"></span>');
                    var titleTag = '<p class="title">'.concat(isIconVisible ? iconTag : "").concat(isLabelVisible ? label : "", "</p>");
                    return '<div class="alert '.concat(style, " ").concat(className, '">\n            ').concat(isIconVisible || isLabelVisible ? titleTag : "", "\n            <p>").concat(value, "</p>\n          </div>");
                });
                next(modifiedHtml);
            });
        };
        window.$docsify = window.$docsify || {};
        window.$docsify.plugins = [].concat(install, window.$docsify.plugins);
    })();
})();