! function(a, b) {
    "use strict";

    function c() {
        return b
    }
    "function" == typeof define && define.amd ? define("tinysort", c) : a.tinysort = b
}(this, function() {
    "use strict";

    function a(a, d) {
        function h() {
            0 === arguments.length ? q({}) : b(arguments, function(a) {
                q(z(a) ? {
                    selector: a
                } : a)
            }), n = G.length
        }

        function q(a) {
            var b = !!a.selector,
                d = b && ":" === a.selector[0],
                e = c(a || {}, p);
            G.push(c({
                hasSelector: b,
                hasAttr: !(e.attr === g || "" === e.attr),
                hasData: e.data !== g,
                hasFilter: d,
                sortReturnNumber: "asc" === e.order ? 1 : -1
            }, e))
        }

        function r() {
            b(a, function(a, b) {
                B ? B !== a.parentNode && (H = !1) : B = a.parentNode;
                var c = G[0],
                    d = c.hasFilter,
                    e = c.selector,
                    f = !e || d && a.matchesSelector(e) || e && a.querySelector(e),
                    g = f ? E : F,
                    h = {
                        elm: a,
                        pos: b,
                        posn: g.length
                    };
                D.push(h), g.push(h)
            }), A = E.slice(0)
        }

        function s() {
            E.sort(t)
        }

        function t(a, c) {
            var d = 0;
            for (0 !== o && (o = 0); 0 === d && n > o;) {
                var g = G[o],
                    h = g.ignoreDashes ? l : k;
                if (b(m, function(a) {
                        var b = a.prepare;
                        b && b(g)
                    }), g.sortFunction) d = g.sortFunction(a, c);
                else if ("rand" == g.order) d = Math.random() < .5 ? 1 : -1;
                else {
                    var i = f,
                        p = y(a, g),
                        q = y(c, g),
                        r = "" === p || p === e,
                        s = "" === q || q === e;
                    if (p === q) d = 0;
                    else if (g.emptyEnd && (r || s)) d = r && s ? 0 : r ? 1 : -1;
                    else {
                        if (!g.forceStrings) {
                            var t = z(p) ? p && p.match(h) : f,
                                u = z(q) ? q && q.match(h) : f;
                            if (t && u) {
                                var v = p.substr(0, p.length - t[0].length),
                                    w = q.substr(0, q.length - u[0].length);
                                v == w && (i = !f, p = j(t[0]), q = j(u[0]))
                            }
                        }
                        d = p === e || q === e ? 0 : q > p ? -1 : p > q ? 1 : 0
                    }
                }
                b(m, function(a) {
                    var b = a.sort;
                    b && (d = b(g, i, p, q, d))
                }), d *= g.sortReturnNumber, 0 === d && o++
            }
            return 0 === d && (d = a.pos > c.pos ? 1 : -1), d
        }

        function u() {
            var a = E.length === D.length;
            if (H && a) I ? E.forEach(function(a, b) {
                a.elm.style.order = b
            }) : B.appendChild(v());
            else {
                var b = G[0],
                    c = b.place,
                    d = "org" === c,
                    e = "start" === c,
                    f = "end" === c,
                    g = "first" === c,
                    h = "last" === c;
                if (d) E.forEach(w), E.forEach(function(a, b) {
                    x(A[b], a.elm)
                });
                else if (e || f) {
                    var i = A[e ? 0 : A.length - 1],
                        j = i.elm.parentNode,
                        k = e ? j.firstChild : j.lastChild;
                    k !== i.elm && (i = {
                        elm: k
                    }), w(i), f && j.appendChild(i.ghost), x(i, v())
                } else if (g || h) {
                    var l = A[g ? 0 : A.length - 1];
                    x(w(l), v())
                }
            }
        }

        function v() {
            return E.forEach(function(a) {
                C.appendChild(a.elm)
            }), C
        }

        function w(a) {
            var b = a.elm,
                c = i.createElement("div");
            return a.ghost = c, b.parentNode.insertBefore(c, b), a
        }

        function x(a, b) {
            var c = a.ghost,
                d = c.parentNode;
            d.insertBefore(b, c), d.removeChild(c), delete a.ghost
        }

        function y(a, b) {
            var c, d = a.elm;
            return b.selector && (b.hasFilter ? d.matchesSelector(b.selector) || (d = g) : d = d.querySelector(b.selector)), b.hasAttr ? c = d.getAttribute(b.attr) : b.useVal ? c = d.value || d.getAttribute("value") : b.hasData ? c = d.getAttribute("data-" + b.data) : d && (c = d.textContent), z(c) && (b.cases || (c = c.toLowerCase()), c = c.replace(/\s+/g, " ")), c
        }

        function z(a) {
            return "string" == typeof a
        }
        z(a) && (a = i.querySelectorAll(a)), 0 === a.length && console.warn("No elements to sort");
        var A, B, C = i.createDocumentFragment(),
            D = [],
            E = [],
            F = [],
            G = [],
            H = !0,
            I = a.length && (d === e || d.useFlex !== !1) && -1 !== getComputedStyle(a[0].parentNode, null).display.indexOf("flex");
        return h.apply(g, Array.prototype.slice.call(arguments, 1)), r(), s(), u(), E.map(function(a) {
            return a.elm
        })
    }

    function b(a, b) {
        for (var c, d = a.length, e = d; e--;) c = d - e - 1, b(a[c], c)
    }

    function c(a, b, c) {
        for (var d in b)(c || a[d] === e) && (a[d] = b[d]);
        return a
    }

    function d(a, b, c) {
        m.push({
            prepare: a,
            sort: b,
            sortBy: c
        })
    }
    var e, f = !1,
        g = null,
        h = window,
        i = h.document,
        j = parseFloat,
        k = /(-?\d+\.?\d*)\s*$/g,
        l = /(\d+\.?\d*)\s*$/g,
        m = [],
        n = 0,
        o = 0,
        p = {
            selector: g,
            order: "asc",
            attr: g,
            data: g,
            useVal: f,
            place: "org",
            returns: f,
            cases: f,
            forceStrings: f,
            ignoreDashes: f,
            sortFunction: g,
            useFlex: f,
            emptyEnd: f
        };
    return h.Element && function(a) {
        a.matchesSelector = a.matchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector || a.webkitMatchesSelector || function(a) {
            for (var b = this, c = (b.parentNode || b.document).querySelectorAll(a), d = -1; c[++d] && c[d] != b;);
            return !!c[d]
        }
    }(Element.prototype), c(d, {
        loop: b
    }), c(a, {
        plugin: d,
        defaults: p
    })
}());