"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arweaveMock = exports.apiNearMock = void 0;

var _nock = _interopRequireDefault(require("nock"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiNearMock = (0, _nock["default"])("".concat(_constants.API_BASE_NEAR_TESTNET, "/api/rest"));
exports.apiNearMock = apiNearMock;
var arweaveMock = (0, _nock["default"])('https://arweave.net');
exports.arweaveMock = arweaveMock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cFRlc3QudHMiXSwibmFtZXMiOlsiYXBpTmVhck1vY2siLCJBUElfQkFTRV9ORUFSX1RFU1RORVQiLCJhcndlYXZlTW9jayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRU8sSUFBTUEsV0FBVyxHQUFHLGdDQUFRQyxnQ0FBUixlQUFwQjs7QUFDQSxJQUFNQyxXQUFXLEdBQUcsc0JBQUsscUJBQUwsQ0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbm9jayBmcm9tICdub2NrJ1xuaW1wb3J0IHsgQVBJX0JBU0VfTkVBUl9URVNUTkVUIH0gZnJvbSAnLi9jb25zdGFudHMnXG5cbmV4cG9ydCBjb25zdCBhcGlOZWFyTW9jayA9IG5vY2soYCR7QVBJX0JBU0VfTkVBUl9URVNUTkVUfS9hcGkvcmVzdGApXG5leHBvcnQgY29uc3QgYXJ3ZWF2ZU1vY2sgPSBub2NrKCdodHRwczovL2Fyd2VhdmUubmV0JylcbiJdfQ==