(this["webpackJsonpsimple-stock"]=this["webpackJsonpsimple-stock"]||[]).push([[0],{12:function(e,t,n){e.exports=n(24)},17:function(e,t,n){},23:function(e,t,n){},24:function(e,t,n){"use strict";n.r(t);var o=n(0),c=n.n(o),a=n(9),r=n.n(a),i=(n(17),n(11)),u=n(5),s=n(2),m=n(10),l=n.n(m),b=n(3),f=n(4);function d(e){var t=e.item,n=Object(o.useState)(!1),a=Object(s.a)(n,2),r=a[0],i=a[1],m=Object(o.useState)(!1),l=Object(s.a)(m,2),d=l[0],h=l[1],E=Object(o.useState)(t.name),v=Object(s.a)(E,2),x=v[0],p=v[1];function O(){e.onEdit(Object(u.a)({},t,{name:x})),h(!1)}return c.a.createElement("li",{className:"box-contents-item",onMouseEnter:function(){return i(!0)},onMouseLeave:function(){return i(!1)}},d?c.a.createElement("input",{className:"edit-input",value:x,autoFocus:!0,onKeyDown:function(e){13===e.keyCode&&O()},onChange:function(e){return p(e.target.value)}}):t.name,r?d?c.a.createElement("div",{className:"box-contents-item-controls"},c.a.createElement(b.a,{icon:f.a,onClick:function(){h(!1)},className:"box-contents-item-control remove"}),c.a.createElement(b.a,{icon:f.b,onClick:function(){return O()},className:"box-contents-item-control confirm"})):c.a.createElement("div",{className:"box-contents-item-controls"},c.a.createElement(b.a,{icon:f.g,onClick:e.onRemove,className:"box-contents-item-control remove"}),c.a.createElement(b.a,{icon:f.c,onClick:function(){p(t.name),h(!0)},className:"box-contents-item-control edit"})):"")}function h(e){var t=e.box,n=e.onRemoveItem,a=e.onEditItem,r=e.onAddItem,i=Object(o.useState)(!1),u=Object(s.a)(i,2),m=u[0],l=u[1];return c.a.createElement("div",{className:"box-contents box-".concat(t.number)},c.a.createElement("h3",{className:"box-contents-name",onMouseEnter:function(){return l(!0)},onMouseLeave:function(){return l(!1)}},"Box ",t.number,m?c.a.createElement("div",{className:"box-contents-item-controls"},c.a.createElement(b.a,{icon:f.e,onClick:function(){return r({name:"Nuevo"})},className:"box-contents-item-control add"})):""),c.a.createElement("ul",{className:"box-contents-list"},t.items.map((function(e,o){return c.a.createElement(d,{item:e,key:"box-contents-item-".concat(t.number,"-").concat(o),onRemove:function(){return n(t,e)},onEdit:function(n){return a(t,e,n)}})}))))}var E=function(e){var t=Object(o.useState)(""),n=Object(s.a)(t,2),a=n[0],r=n[1],i=Object(o.useState)(!1),u=Object(s.a)(i,2),m=u[0],l=u[1];function d(t){r(t),e.onChange(t)}return c.a.createElement("div",{className:"filter"},c.a.createElement("input",{className:"filter-input",value:a,onChange:function(e){return d(e.target.value)},onFocus:function(){return l(!0)},onBlur:function(){return l(!1)},placeholder:"Filter..."}),c.a.createElement("button",{className:"filter-clear-button"+(m?" filter-clear-button-focus":""),onClick:function(){return d("")}},c.a.createElement(b.a,{icon:f.d})))};function v(e){var t=e.boxes,n=e.onBoxSelected,a=Object(o.useState)(null),r=Object(s.a)(a,2),i=r[0],u=r[1];return c.a.createElement("div",{className:"boxes"},t.map((function(e){return c.a.createElement("button",{key:"box-".concat(e.number),className:"box box-".concat(e.number," ").concat(i===e.number?"selected":""),onClick:function(){var t=i===e.number?null:e.number;u(t),n(t)}},e.number)})))}var x=function(){return c.a.createElement(b.a,{icon:f.f,className:"spin"})},p=(n(23),"https://simple-stock-service.herokuapp.com"),O=function(){var e,t=Object(o.useState)(void 0),n=Object(s.a)(t,2),a=n[0],r=n[1],m=Object(o.useState)(""),b=Object(s.a)(m,2),f=b[0],d=b[1],O=Object(o.useState)(null),j=Object(s.a)(O,2),N=j[0],k=j[1];function g(e){return!e||/^\s*$/.test(e)}function y(e,t){return new l.a(e,{shouldSort:!0,findAllMatches:!0,threshold:.4,location:0,distance:100,maxPatternLength:32,minMatchCharLength:1,keys:["name","items.name"]}).search(t)}function S(e,t){fetch("".concat(p,"/boxes/").concat(e.number,"/items/").concat(a.find((function(t){return t.number===e.number})).items.indexOf(t)),{method:"DELETE"}).then((function(n){if(!n.ok)throw Error(n.statusText);r(null===a||void 0===a?void 0:a.map((function(n){return n.number===e.number?Object(u.a)({},n,{items:n.items.filter((function(e){return e!==t}))}):n})))}))}return Object(o.useEffect)((function(){fetch(p+"/boxes").then((function(e){return e.json()})).then((function(e){return e.sort((function(e,t){return e.number-t.number}))})).then((function(e){return r(e)}))}),[]),a&&(e=N?a.filter((function(e){return e.number===N})):a,e=g(f)?e:e.map((function(e){return Object(u.a)({},e,{items:y(e.items,f)})})),e=g(f)?e:y(e,f)),c.a.createElement("section",{className:"container"},c.a.createElement("header",{className:"header"},c.a.createElement("div",{className:"nav-bar"},c.a.createElement(E,{onChange:function(e){return d(e)}}),void 0===a?c.a.createElement(x,null):c.a.createElement(v,{boxes:a,onBoxSelected:function(e){return k(e)}}))),c.a.createElement("main",{className:"main"},void 0===e?c.a.createElement(x,null):0===e.length?c.a.createElement("div",{className:"boxes-empty"},"No hay nada que coincida :'("):e.map((function(e){return c.a.createElement(h,{box:e,key:"box-contents-".concat(e.number),onRemoveItem:S,onEditItem:function(e,t,n){return function(e,t,n){fetch("".concat(p,"/boxes/").concat(e.number,"/items/").concat(a.find((function(t){return t.number===e.number})).items.indexOf(t)),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then((function(o){if(!o.ok)throw Error(o.statusText);r(null===a||void 0===a?void 0:a.map((function(o){return o.number===e.number?Object(u.a)({},o,{items:o.items.map((function(e){return e===t?n:e}))}):o})))}))}(e,t,n)},onAddItem:function(t){return function(e,t){fetch("".concat(p,"/boxes/").concat(e.number,"/items"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(n){if(!n.ok)throw Error(n.statusText);r(null===a||void 0===a?void 0:a.map((function(n){return n===e?Object(u.a)({},e,{items:[].concat(Object(i.a)(e.items),[t])}):n})))}))}(e,t)}})}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(c.a.createElement(O,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[12,1,2]]]);
//# sourceMappingURL=main.ddd77add.chunk.js.map