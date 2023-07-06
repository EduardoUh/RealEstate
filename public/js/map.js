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

/***/ "./src/js/map.js":
/*!***********************!*\
  !*** ./src/js/map.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// || (logical or)  operator evaluates wheter left side is truty or \r\n// falsy because, in this case values are not boolean are string \r\n// instead (empty string or some value string), ?? (nulish coaleshing)\r\n// operator evaluates if left side is null of undefined that's why \r\n// we don't use it here\r\n\r\n// this is an IIFE (Immediately invoked function expressions)\r\n(function () {\r\n    // Seleccionar los inputs y párrafos que van a guardar los valores\r\n    const pAddress = document.querySelector('.address');\r\n    const iAddress = document.querySelector('#address');\r\n    const iLat = document.querySelector('#lat');\r\n    const iLng = document.querySelector('#lng');\r\n    // 20.2027946, -89.2875277 coordenadas de tekax, no las uso porque leaflet no tiene imagenes de tekax\r\n    const lat = iLat.value || 34.040967; // 20.67444163271174;\r\n    const lng = iLng.value || -118.1618621; // -103.38739216304566;\r\n    // toma como valor el div con el id map que está en create.pug\r\n    const map = L.map('map').setView([lat, lng], 16);\r\n    let marker;\r\n\r\n    // utilizar provider y geocoder\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n    // el bjeto L contiene toda la información de leaftlet\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map);\r\n\r\n    // añadir pin\r\n    marker = new L.marker([lat, lng], {\r\n        // que el pin pueda moverse\r\n        draggable: true,\r\n        // que el mapa se centre al mover el pin\r\n        autoPan: true\r\n    })\r\n        .addTo(map)\r\n\r\n    // detectar el movimiento del pin y leer latitud y longitud\r\n\r\n    marker.on('moveend', (e) => {\r\n        // marker tomara el valor de a donde se esté colocand el pin\r\n        marker = e.target;\r\n        // console.log(marker);\r\n        // obtenemos las coordenadas del pin\r\n        const position = marker.getLatLng();\r\n        // console.log(position);\r\n        // hacer que el mapa se centre de acuerdo a la posición del pin\r\n        map.panTo(new L.LatLng(position.lat, position.lng));\r\n        // obtener coordenadas y nombre de la calle al soltar el pin\r\n        geocodeService.reverse().latlng(position, 15).run((error, result) => {\r\n            console.log(result);\r\n            console.log(result?.latlng?.lat);\r\n            console.log(result?.latlng?.lng);\r\n            // console.log(error);\r\n            // añadir un popup al hacer click en el ping\r\n            marker.bindPopup(result.address.LongLabel);\r\n\r\n            /* document.querySelector('.address').textContent = result?.address?.Address ?? '';\r\n            document.querySelector('#address').value = result?.address?.Address ?? '';\r\n            document.querySelector('#lat').value = result?.latlng?.lat ?? '';\r\n            document.querySelector('#lng').value = result?.latlng?.lng ?? ''; */\r\n            pAddress.textContent = result?.address?.Address ?? '';\r\n            iAddress.value = result?.address?.Address ?? '';\r\n            iLat.value = result?.latlng?.lat ?? '';\r\n            iLng.value = result?.latlng?.lng ?? '';\r\n        });\r\n    });\r\n\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/map.js?");

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
/******/ 	__webpack_modules__["./src/js/map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;