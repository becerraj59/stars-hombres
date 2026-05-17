/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/CartContext.js":
/*!****************************!*\
  !*** ./lib/CartContext.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CartProvider: () => (/* binding */ CartProvider),\n/* harmony export */   useCart: () => (/* binding */ useCart)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n// lib/CartContext.js\n\n\nconst CartContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nfunction CartProvider({ children }) {\n    const [cart, setCart] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    // Load from localStorage on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        try {\n            const saved = localStorage.getItem(\"stars_cart\");\n            if (saved) setCart(JSON.parse(saved));\n        } catch  {}\n    }, []);\n    // Persist to localStorage\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        localStorage.setItem(\"stars_cart\", JSON.stringify(cart));\n    }, [\n        cart\n    ]);\n    function addToCart(item) {\n        // item: { sku, productId, productSlug, productName, size, color, colorHex, price, image }\n        setCart((prev)=>{\n            const existing = prev.find((c)=>c.sku === item.sku);\n            if (existing) {\n                return prev.map((c)=>c.sku === item.sku ? {\n                        ...c,\n                        quantity: c.quantity + 1\n                    } : c);\n            }\n            return [\n                ...prev,\n                {\n                    ...item,\n                    quantity: 1\n                }\n            ];\n        });\n    }\n    function removeFromCart(sku) {\n        setCart((prev)=>prev.filter((c)=>c.sku !== sku));\n    }\n    function updateQuantity(sku, quantity) {\n        if (quantity <= 0) {\n            removeFromCart(sku);\n            return;\n        }\n        setCart((prev)=>prev.map((c)=>c.sku === sku ? {\n                    ...c,\n                    quantity\n                } : c));\n    }\n    function clearCart() {\n        setCart([]);\n    }\n    const total = cart.reduce((sum, item)=>sum + item.price * item.quantity, 0);\n    const itemCount = cart.reduce((sum, item)=>sum + item.quantity, 0);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CartContext.Provider, {\n        value: {\n            cart,\n            addToCart,\n            removeFromCart,\n            updateQuantity,\n            clearCart,\n            total,\n            itemCount\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\germi\\\\Downloads\\\\proyecto stars\\\\stars-hombres\\\\stars-hombres\\\\lib\\\\CartContext.js\",\n        lineNumber: 55,\n        columnNumber: 5\n    }, this);\n}\nfunction useCart() {\n    const ctx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CartContext);\n    if (!ctx) throw new Error(\"useCart must be used within CartProvider\");\n    return ctx;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvQ2FydENvbnRleHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEscUJBQXFCOztBQUNpRDtBQUV0RSxNQUFNSSw0QkFBY0osb0RBQWFBLENBQUM7QUFFM0IsU0FBU0ssYUFBYSxFQUFFQyxRQUFRLEVBQUU7SUFDdkMsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdOLCtDQUFRQSxDQUFDLEVBQUU7SUFFbkMsa0NBQWtDO0lBQ2xDQyxnREFBU0EsQ0FBQztRQUNSLElBQUk7WUFDRixNQUFNTSxRQUFRQyxhQUFhQyxPQUFPLENBQUM7WUFDbkMsSUFBSUYsT0FBT0QsUUFBUUksS0FBS0MsS0FBSyxDQUFDSjtRQUNoQyxFQUFFLE9BQU0sQ0FBQztJQUNYLEdBQUcsRUFBRTtJQUVMLDBCQUEwQjtJQUMxQk4sZ0RBQVNBLENBQUM7UUFDUk8sYUFBYUksT0FBTyxDQUFDLGNBQWNGLEtBQUtHLFNBQVMsQ0FBQ1I7SUFDcEQsR0FBRztRQUFDQTtLQUFLO0lBRVQsU0FBU1MsVUFBVUMsSUFBSTtRQUNyQiwwRkFBMEY7UUFDMUZULFFBQVEsQ0FBQ1U7WUFDUCxNQUFNQyxXQUFXRCxLQUFLRSxJQUFJLENBQUMsQ0FBQ0MsSUFBTUEsRUFBRUMsR0FBRyxLQUFLTCxLQUFLSyxHQUFHO1lBQ3BELElBQUlILFVBQVU7Z0JBQ1osT0FBT0QsS0FBS0ssR0FBRyxDQUFDLENBQUNGLElBQ2ZBLEVBQUVDLEdBQUcsS0FBS0wsS0FBS0ssR0FBRyxHQUFHO3dCQUFFLEdBQUdELENBQUM7d0JBQUVHLFVBQVVILEVBQUVHLFFBQVEsR0FBRztvQkFBRSxJQUFJSDtZQUU5RDtZQUNBLE9BQU87bUJBQUlIO2dCQUFNO29CQUFFLEdBQUdELElBQUk7b0JBQUVPLFVBQVU7Z0JBQUU7YUFBRTtRQUM1QztJQUNGO0lBRUEsU0FBU0MsZUFBZUgsR0FBRztRQUN6QmQsUUFBUSxDQUFDVSxPQUFTQSxLQUFLUSxNQUFNLENBQUMsQ0FBQ0wsSUFBTUEsRUFBRUMsR0FBRyxLQUFLQTtJQUNqRDtJQUVBLFNBQVNLLGVBQWVMLEdBQUcsRUFBRUUsUUFBUTtRQUNuQyxJQUFJQSxZQUFZLEdBQUc7WUFDakJDLGVBQWVIO1lBQ2Y7UUFDRjtRQUNBZCxRQUFRLENBQUNVLE9BQVNBLEtBQUtLLEdBQUcsQ0FBQyxDQUFDRixJQUFPQSxFQUFFQyxHQUFHLEtBQUtBLE1BQU07b0JBQUUsR0FBR0QsQ0FBQztvQkFBRUc7Z0JBQVMsSUFBSUg7SUFDMUU7SUFFQSxTQUFTTztRQUNQcEIsUUFBUSxFQUFFO0lBQ1o7SUFFQSxNQUFNcUIsUUFBUXRCLEtBQUt1QixNQUFNLENBQUMsQ0FBQ0MsS0FBS2QsT0FBU2MsTUFBTWQsS0FBS2UsS0FBSyxHQUFHZixLQUFLTyxRQUFRLEVBQUU7SUFDM0UsTUFBTVMsWUFBWTFCLEtBQUt1QixNQUFNLENBQUMsQ0FBQ0MsS0FBS2QsT0FBU2MsTUFBTWQsS0FBS08sUUFBUSxFQUFFO0lBRWxFLHFCQUNFLDhEQUFDcEIsWUFBWThCLFFBQVE7UUFBQ0MsT0FBTztZQUFFNUI7WUFBTVM7WUFBV1M7WUFBZ0JFO1lBQWdCQztZQUFXQztZQUFPSTtRQUFVO2tCQUN6RzNCOzs7Ozs7QUFHUDtBQUVPLFNBQVM4QjtJQUNkLE1BQU1DLE1BQU1wQyxpREFBVUEsQ0FBQ0c7SUFDdkIsSUFBSSxDQUFDaUMsS0FBSyxNQUFNLElBQUlDLE1BQU07SUFDMUIsT0FBT0Q7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL3N0YXJzLWhvbWJyZXMvLi9saWIvQ2FydENvbnRleHQuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvQ2FydENvbnRleHQuanNcbmltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcblxuY29uc3QgQ2FydENvbnRleHQgPSBjcmVhdGVDb250ZXh0KG51bGwpXG5cbmV4cG9ydCBmdW5jdGlvbiBDYXJ0UHJvdmlkZXIoeyBjaGlsZHJlbiB9KSB7XG4gIGNvbnN0IFtjYXJ0LCBzZXRDYXJ0XSA9IHVzZVN0YXRlKFtdKVxuXG4gIC8vIExvYWQgZnJvbSBsb2NhbFN0b3JhZ2Ugb24gbW91bnRcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2F2ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc3RhcnNfY2FydCcpXG4gICAgICBpZiAoc2F2ZWQpIHNldENhcnQoSlNPTi5wYXJzZShzYXZlZCkpXG4gICAgfSBjYXRjaCB7fVxuICB9LCBbXSlcblxuICAvLyBQZXJzaXN0IHRvIGxvY2FsU3RvcmFnZVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdGFyc19jYXJ0JywgSlNPTi5zdHJpbmdpZnkoY2FydCkpXG4gIH0sIFtjYXJ0XSlcblxuICBmdW5jdGlvbiBhZGRUb0NhcnQoaXRlbSkge1xuICAgIC8vIGl0ZW06IHsgc2t1LCBwcm9kdWN0SWQsIHByb2R1Y3RTbHVnLCBwcm9kdWN0TmFtZSwgc2l6ZSwgY29sb3IsIGNvbG9ySGV4LCBwcmljZSwgaW1hZ2UgfVxuICAgIHNldENhcnQoKHByZXYpID0+IHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nID0gcHJldi5maW5kKChjKSA9PiBjLnNrdSA9PT0gaXRlbS5za3UpXG4gICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgcmV0dXJuIHByZXYubWFwKChjKSA9PlxuICAgICAgICAgIGMuc2t1ID09PSBpdGVtLnNrdSA/IHsgLi4uYywgcXVhbnRpdHk6IGMucXVhbnRpdHkgKyAxIH0gOiBjXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHJldHVybiBbLi4ucHJldiwgeyAuLi5pdGVtLCBxdWFudGl0eTogMSB9XVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVGcm9tQ2FydChza3UpIHtcbiAgICBzZXRDYXJ0KChwcmV2KSA9PiBwcmV2LmZpbHRlcigoYykgPT4gYy5za3UgIT09IHNrdSkpXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVRdWFudGl0eShza3UsIHF1YW50aXR5KSB7XG4gICAgaWYgKHF1YW50aXR5IDw9IDApIHtcbiAgICAgIHJlbW92ZUZyb21DYXJ0KHNrdSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzZXRDYXJ0KChwcmV2KSA9PiBwcmV2Lm1hcCgoYykgPT4gKGMuc2t1ID09PSBza3UgPyB7IC4uLmMsIHF1YW50aXR5IH0gOiBjKSkpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhckNhcnQoKSB7XG4gICAgc2V0Q2FydChbXSlcbiAgfVxuXG4gIGNvbnN0IHRvdGFsID0gY2FydC5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgaXRlbS5wcmljZSAqIGl0ZW0ucXVhbnRpdHksIDApXG4gIGNvbnN0IGl0ZW1Db3VudCA9IGNhcnQucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0ucXVhbnRpdHksIDApXG5cbiAgcmV0dXJuIChcbiAgICA8Q2FydENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgY2FydCwgYWRkVG9DYXJ0LCByZW1vdmVGcm9tQ2FydCwgdXBkYXRlUXVhbnRpdHksIGNsZWFyQ2FydCwgdG90YWwsIGl0ZW1Db3VudCB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0NhcnRDb250ZXh0LlByb3ZpZGVyPlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VDYXJ0KCkge1xuICBjb25zdCBjdHggPSB1c2VDb250ZXh0KENhcnRDb250ZXh0KVxuICBpZiAoIWN0eCkgdGhyb3cgbmV3IEVycm9yKCd1c2VDYXJ0IG11c3QgYmUgdXNlZCB3aXRoaW4gQ2FydFByb3ZpZGVyJylcbiAgcmV0dXJuIGN0eFxufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDYXJ0Q29udGV4dCIsIkNhcnRQcm92aWRlciIsImNoaWxkcmVuIiwiY2FydCIsInNldENhcnQiLCJzYXZlZCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiYWRkVG9DYXJ0IiwiaXRlbSIsInByZXYiLCJleGlzdGluZyIsImZpbmQiLCJjIiwic2t1IiwibWFwIiwicXVhbnRpdHkiLCJyZW1vdmVGcm9tQ2FydCIsImZpbHRlciIsInVwZGF0ZVF1YW50aXR5IiwiY2xlYXJDYXJ0IiwidG90YWwiLCJyZWR1Y2UiLCJzdW0iLCJwcmljZSIsIml0ZW1Db3VudCIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VDYXJ0IiwiY3R4IiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/CartContext.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_CartContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/CartContext */ \"./lib/CartContext.js\");\n// pages/_app.js\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_CartContext__WEBPACK_IMPORTED_MODULE_2__.CartProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\germi\\\\Downloads\\\\proyecto stars\\\\stars-hombres\\\\stars-hombres\\\\pages\\\\_app.js\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\germi\\\\Downloads\\\\proyecto stars\\\\stars-hombres\\\\stars-hombres\\\\pages\\\\_app.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGdCQUFnQjs7QUFDYztBQUNtQjtBQUVsQyxTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ2xELHFCQUNFLDhEQUFDSCwwREFBWUE7a0JBQ1gsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdGFycy1ob21icmVzLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhZ2VzL19hcHAuanNcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xuaW1wb3J0IHsgQ2FydFByb3ZpZGVyIH0gZnJvbSAnLi4vbGliL0NhcnRDb250ZXh0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPENhcnRQcm92aWRlcj5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L0NhcnRQcm92aWRlcj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbIkNhcnRQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();