"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeExternalConstants = void 0;

require("isomorphic-unfetch");

var _constants = require("../constants");

var _retryFetch = require("./retryFetch");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var initializeExternalConstants = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var apiKey, networkName, url, fetchOptions, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            apiKey = _ref.apiKey, networkName = _ref.networkName;
            url = "".concat(_constants.CLOUD_URI, "/developer");
            fetchOptions = {
              headers: {
                'api-key': apiKey || 'anonymous',
                'api-version': !networkName ? _constants.API_VERSION : "".concat(_constants.API_VERSION, "-").concat(networkName)
              }
            };
            _context.next = 5;
            return (0, _retryFetch.retryFetch)(url, fetchOptions);

          case 5:
            response = _context.sent;
            _context.next = 8;
            return response.json();

          case 8:
            return _context.abrupt("return", _context.sent);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initializeExternalConstants(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.initializeExternalConstants = initializeExternalConstants;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9leHRlcm5hbC1jb25zdGFudHMudHMiXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUV4dGVybmFsQ29uc3RhbnRzIiwiYXBpS2V5IiwibmV0d29ya05hbWUiLCJ1cmwiLCJDTE9VRF9VUkkiLCJmZXRjaE9wdGlvbnMiLCJoZWFkZXJzIiwiQVBJX1ZFUlNJT04iLCJyZXNwb25zZSIsImpzb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRU8sSUFBTUEsMkJBQTJCO0FBQUEsc0VBQUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ3pDQyxZQUFBQSxNQUR5QyxRQUN6Q0EsTUFEeUMsRUFFekNDLFdBRnlDLFFBRXpDQSxXQUZ5QztBQU9uQ0MsWUFBQUEsR0FQbUMsYUFPMUJDLG9CQVAwQjtBQVFuQ0MsWUFBQUEsWUFSbUMsR0FRcEI7QUFDbkJDLGNBQUFBLE9BQU8sRUFBRTtBQUNQLDJCQUFXTCxNQUFNLElBQUksV0FEZDtBQUVQLCtCQUFlLENBQUNDLFdBQUQsR0FDWEssc0JBRFcsYUFFUkEsc0JBRlEsY0FFT0wsV0FGUDtBQUZSO0FBRFUsYUFSb0I7QUFBQTtBQUFBLG1CQWlCbEIsNEJBQVdDLEdBQVgsRUFBZ0JFLFlBQWhCLENBakJrQjs7QUFBQTtBQWlCbkNHLFlBQUFBLFFBakJtQztBQUFBO0FBQUEsbUJBbUI1QkEsUUFBUSxDQUFDQyxJQUFULEVBbkI0Qjs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQTNCVCwyQkFBMkI7QUFBQTtBQUFBO0FBQUEsR0FBakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2lzb21vcnBoaWMtdW5mZXRjaCdcbmltcG9ydCB7IENvbnN0YW50cywgTmV0d29yayB9IGZyb20gJ3NyYy90eXBlcydcbmltcG9ydCB7IENMT1VEX1VSSSwgQVBJX1ZFUlNJT04gfSBmcm9tICcuLi9jb25zdGFudHMnXG5pbXBvcnQgeyByZXRyeUZldGNoIH0gZnJvbSAnLi9yZXRyeUZldGNoJ1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZUV4dGVybmFsQ29uc3RhbnRzID0gYXN5bmMgKHtcbiAgYXBpS2V5LFxuICBuZXR3b3JrTmFtZSxcbn06IHtcbiAgYXBpS2V5Pzogc3RyaW5nXG4gIG5ldHdvcmtOYW1lPzogTmV0d29ya1xufSk6IFByb21pc2U8Q29uc3RhbnRzPiA9PiB7XG4gIGNvbnN0IHVybCA9IGAke0NMT1VEX1VSSX0vZGV2ZWxvcGVyYFxuICBjb25zdCBmZXRjaE9wdGlvbnMgPSB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ2FwaS1rZXknOiBhcGlLZXkgfHwgJ2Fub255bW91cycsXG4gICAgICAnYXBpLXZlcnNpb24nOiAhbmV0d29ya05hbWVcbiAgICAgICAgPyBBUElfVkVSU0lPTlxuICAgICAgICA6IGAke0FQSV9WRVJTSU9OfS0ke25ldHdvcmtOYW1lfWAsXG4gICAgfSxcbiAgfVxuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlGZXRjaCh1cmwsIGZldGNoT3B0aW9ucylcblxuICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpXG59XG4iXX0=