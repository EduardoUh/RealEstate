/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/showMap.js":
/*!***************************!*\
  !*** ./src/js/showMap.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// || (logical or)  operator evaluates wheter left side is truty or \r\n// falsy because, in this case values are not boolean are string \r\n// instead (empty string or some value string), ?? (nulish coaleshing)\r\n// operator evaluates if left side is null of undefined that's why \r\n// we don't use it here\r\n\r\n// this is an IIFE (Immediately invoked function expressions)\r\n(function () {\r\n    const pLat = document.querySelector('#lat').textContent;\r\n    const pLng = document.querySelector('#lng').textContent;\r\n    const address = document.querySelector('#address').textContent;\r\n    const title = document.querySelector('#title').textContent;\r\n    const map = L.map('map').setView([pLat, pLng], 16);\r\n\r\n    // el bjeto L contiene toda la información de leaftlet\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map);\r\n\r\n    // add pin\r\n    L.marker([pLat, pLng])\r\n        .addTo(map)\r\n        .bindPopup(`${title}, ${address}`)\r\n\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/showMap.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/showMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;