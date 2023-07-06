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

/***/ "./src/js/updateState.js":
/*!*******************************!*\
  !*** ./src/js/updateState.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const buttons = document.querySelectorAll('.update-state');\r\n    const token = document.querySelector('meta[name=\"csrf-token\"').getAttribute(\"content\");\r\n\r\n    buttons.forEach(button => button.addEventListener('click', async e => {\r\n        const { propertyId } = e.target.dataset;\r\n        const url = `/properties/${propertyId}`;\r\n\r\n        try {\r\n            const res = await fetch(url, {\r\n                method: 'PUT',\r\n                // headers are allways sent before the request\r\n                headers: {\r\n                    // Name it this wat because csrf spects the token with that name\r\n                    'CSRF-Token': token\r\n                }\r\n            });\r\n\r\n            const data = await res.json();\r\n\r\n            const { newState } = data;\r\n\r\n            if (newState) {\r\n                /* \r\n                    bg-green-100 text-green-800\r\n                    bg-yellow-100 text-yellow-800\r\n                */\r\n                e.target.classList.add('bg-green-100', 'text-green-800');\r\n                e.target.classList.remove('bg-yellow-100', 'text-yellow-800');\r\n                e.target.textContent = 'Published';\r\n            }\r\n            else {\r\n                e.target.classList.add('bg-yellow-100', 'text-yellow-800');\r\n                e.target.classList.remove('bg-green-100', 'text-green-800');\r\n                e.target.textContent = 'Not Published';\r\n            }\r\n        }\r\n        catch (e) {\r\n            console.log(e);\r\n        }\r\n    })\r\n    );\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/updateState.js?");

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
/******/ 	__webpack_modules__["./src/js/updateState.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;