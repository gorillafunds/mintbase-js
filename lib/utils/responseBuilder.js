"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatResponse = void 0;

var formatResponse = function formatResponse(params) {
  var _params$data = params.data,
      data = _params$data === void 0 ? {} : _params$data,
      _params$error = params.error,
      error = _params$error === void 0 ? "" : _params$error;
  return {
    data: data,
    error: error
  };
};

exports.formatResponse = formatResponse;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9yZXNwb25zZUJ1aWxkZXIudHMiXSwibmFtZXMiOlsiZm9ybWF0UmVzcG9uc2UiLCJwYXJhbXMiLCJkYXRhIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFXTyxJQUFNQSxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUlDLE1BQUosRUFBbUQ7QUFDL0UscUJBQXdDQSxNQUF4QyxDQUFRQyxJQUFSO0FBQUEsTUFBUUEsSUFBUiw2QkFBZSxFQUFmO0FBQUEsc0JBQXdDRCxNQUF4QyxDQUF5QkUsS0FBekI7QUFBQSxNQUF5QkEsS0FBekIsOEJBQWlDLEVBQWpDO0FBRUEsU0FBTztBQUNMRCxJQUFBQSxJQUFJLEVBQUpBLElBREs7QUFFTEMsSUFBQUEsS0FBSyxFQUFMQTtBQUZLLEdBQVA7QUFJRCxDQVBNIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbnRlcmZhY2UgUmVzcG9uc2VQYXJhbXM8VD4ge1xuICBkYXRhPzogIFQsXG4gIGVycm9yPzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVzcG9uc2VEYXRhPFQ+IHtcbiAgZGF0YTogVFxuICBlcnJvcjogc3RyaW5nXG59XG5cbmV4cG9ydCBjb25zdCBmb3JtYXRSZXNwb25zZSA9IDxUPihwYXJhbXM6IFJlc3BvbnNlUGFyYW1zPFQ+KTogUmVzcG9uc2VEYXRhPFQ+ID0+IHtcbiAgY29uc3QgeyBkYXRhID0ge30gYXMgVCAsIGVycm9yID0gXCJcIiB9ID0gcGFyYW1zXG5cbiAgcmV0dXJuIHtcbiAgICBkYXRhLFxuICAgIGVycm9yLCBcbiAgfVxufVxuIl19