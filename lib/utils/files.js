"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMimeType = exports.getFileExtension = exports.correctFileType = void 0;

var _constants = require("../constants");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var correctFileType = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file) {
    var fileExtension;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!file.type.includes('svg')) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", setMimeType(_constants.MIME_TYPES.svg, file));

          case 2:
            fileExtension = getFileExtension(file.name);

            if (fileExtension) {
              _context.next = 5;
              break;
            }

            throw new Error(_constants.ERROR_MESSAGES.fileNoExtension);

          case 5:
            if (!(fileExtension === 'glb')) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", setMimeType(_constants.MIME_TYPES.glb, file));

          case 7:
            if (!(fileExtension === 'gltf')) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", setMimeType(_constants.MIME_TYPES.gltf, file));

          case 9:
            return _context.abrupt("return", file);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function correctFileType(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.correctFileType = correctFileType;

var setMimeType = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(type, file) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = File;
            _context2.t1 = Blob;
            _context2.next = 4;
            return file.arrayBuffer();

          case 4:
            _context2.t2 = _context2.sent;
            _context2.t3 = [_context2.t2];
            _context2.t4 = new _context2.t1(_context2.t3);
            _context2.t5 = [_context2.t4];
            _context2.t6 = file.name;
            _context2.t7 = {
              type: type
            };
            return _context2.abrupt("return", new _context2.t0(_context2.t5, _context2.t6, _context2.t7));

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function setMimeType(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.setMimeType = setMimeType;

var getFileExtension = function getFileExtension(fileName) {
  return fileName.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
};

exports.getFileExtension = getFileExtension;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWxlcy50cyJdLCJuYW1lcyI6WyJjb3JyZWN0RmlsZVR5cGUiLCJmaWxlIiwidHlwZSIsImluY2x1ZGVzIiwic2V0TWltZVR5cGUiLCJNSU1FX1RZUEVTIiwic3ZnIiwiZmlsZUV4dGVuc2lvbiIsImdldEZpbGVFeHRlbnNpb24iLCJuYW1lIiwiRXJyb3IiLCJFUlJPUl9NRVNTQUdFUyIsImZpbGVOb0V4dGVuc2lvbiIsImdsYiIsImdsdGYiLCJGaWxlIiwiQmxvYiIsImFycmF5QnVmZmVyIiwiZmlsZU5hbWUiLCJzbGljZSIsIk1hdGgiLCJtYXgiLCJsYXN0SW5kZXhPZiIsIkluZmluaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7OztBQUVPLElBQU1BLGVBQWU7QUFBQSxxRUFBRyxpQkFBT0MsSUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFDekJBLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxRQUFWLENBQW1CLEtBQW5CLENBRHlCO0FBQUE7QUFBQTtBQUFBOztBQUFBLDZDQUNTQyxXQUFXLENBQUNDLHNCQUFXQyxHQUFaLEVBQWlCTCxJQUFqQixDQURwQjs7QUFBQTtBQUd2Qk0sWUFBQUEsYUFIdUIsR0FHUEMsZ0JBQWdCLENBQUNQLElBQUksQ0FBQ1EsSUFBTixDQUhUOztBQUFBLGdCQUt4QkYsYUFMd0I7QUFBQTtBQUFBO0FBQUE7O0FBQUEsa0JBS0gsSUFBSUcsS0FBSixDQUFVQywwQkFBZUMsZUFBekIsQ0FMRzs7QUFBQTtBQUFBLGtCQU96QkwsYUFBYSxLQUFLLEtBUE87QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBT09ILFdBQVcsQ0FBQ0Msc0JBQVdRLEdBQVosRUFBaUJaLElBQWpCLENBUGxCOztBQUFBO0FBQUEsa0JBUXpCTSxhQUFhLEtBQUssTUFSTztBQUFBO0FBQUE7QUFBQTs7QUFBQSw2Q0FRUUgsV0FBVyxDQUFDQyxzQkFBV1MsSUFBWixFQUFrQmIsSUFBbEIsQ0FSbkI7O0FBQUE7QUFBQSw2Q0FVdEJBLElBVnNCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQUg7O0FBQUEsa0JBQWZELGVBQWU7QUFBQTtBQUFBO0FBQUEsR0FBckI7Ozs7QUFhQSxJQUFNSSxXQUFXO0FBQUEsc0VBQUcsa0JBQU9GLElBQVAsRUFBcUJELElBQXJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFDZGMsSUFEYztBQUFBLDJCQUNKQyxJQURJO0FBQUE7QUFBQSxtQkFDUWYsSUFBSSxDQUFDZ0IsV0FBTCxFQURSOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFDK0JoQixJQUFJLENBQUNRLElBRHBDO0FBQUEsMkJBQzBDO0FBQ2pFUCxjQUFBQSxJQUFJLEVBQUVBO0FBRDJELGFBRDFDO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBSDs7QUFBQSxrQkFBWEUsV0FBVztBQUFBO0FBQUE7QUFBQSxHQUFqQjs7OztBQU1BLElBQU1JLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQ1UsUUFBRCxFQUEwQztBQUN4RSxTQUFPQSxRQUFRLENBQUNDLEtBQVQsQ0FDTCxDQUFDQyxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlILFFBQVEsQ0FBQ0ksV0FBVCxDQUFxQixHQUFyQixDQUFaLEtBQTBDQyxRQUEzQyxJQUF1RCxDQURsRCxDQUFQO0FBR0QsQ0FKTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAaGlkZGVuIEBtb2R1bGUgKi9cblxuaW1wb3J0IHsgRVJST1JfTUVTU0FHRVMsIE1JTUVfVFlQRVMgfSBmcm9tICcuLi9jb25zdGFudHMnXG5cbmV4cG9ydCBjb25zdCBjb3JyZWN0RmlsZVR5cGUgPSBhc3luYyAoZmlsZTogRmlsZSk6IFByb21pc2U8RmlsZT4gPT4ge1xuICBpZiAoZmlsZS50eXBlLmluY2x1ZGVzKCdzdmcnKSkgcmV0dXJuIHNldE1pbWVUeXBlKE1JTUVfVFlQRVMuc3ZnLCBmaWxlKVxuXG4gIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBnZXRGaWxlRXh0ZW5zaW9uKGZpbGUubmFtZSlcblxuICBpZiAoIWZpbGVFeHRlbnNpb24pIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5maWxlTm9FeHRlbnNpb24pXG5cbiAgaWYgKGZpbGVFeHRlbnNpb24gPT09ICdnbGInKSByZXR1cm4gc2V0TWltZVR5cGUoTUlNRV9UWVBFUy5nbGIsIGZpbGUpXG4gIGlmIChmaWxlRXh0ZW5zaW9uID09PSAnZ2x0ZicpIHJldHVybiBzZXRNaW1lVHlwZShNSU1FX1RZUEVTLmdsdGYsIGZpbGUpXG5cbiAgcmV0dXJuIGZpbGVcbn1cblxuZXhwb3J0IGNvbnN0IHNldE1pbWVUeXBlID0gYXN5bmMgKHR5cGU6IHN0cmluZywgZmlsZTogRmlsZSk6IFByb21pc2U8RmlsZT4gPT4ge1xuICByZXR1cm4gbmV3IEZpbGUoW25ldyBCbG9iKFthd2FpdCBmaWxlLmFycmF5QnVmZmVyKCldKV0sIGZpbGUubmFtZSwge1xuICAgIHR5cGU6IHR5cGUsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCBnZXRGaWxlRXh0ZW5zaW9uID0gKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICByZXR1cm4gZmlsZU5hbWUuc2xpY2UoXG4gICAgKE1hdGgubWF4KDAsIGZpbGVOYW1lLmxhc3RJbmRleE9mKCcuJykpIHx8IEluZmluaXR5KSArIDFcbiAgKVxufVxuIl19