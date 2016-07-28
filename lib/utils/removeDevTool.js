'use strict';

var _ReactDOMDebugTool = require('react/lib/ReactDOMDebugTool');

var _ReactDOMDebugTool2 = _interopRequireDefault(_ReactDOMDebugTool);

var _ReactDOMUnknownPropertyDevtool = require('react/lib/ReactDOMUnknownPropertyDevtool');

var _ReactDOMUnknownPropertyDevtool2 = _interopRequireDefault(_ReactDOMUnknownPropertyDevtool);

var _ReactDOMNullInputValuePropDevtool = require('react/lib/ReactDOMNullInputValuePropDevtool');

var _ReactDOMNullInputValuePropDevtool2 = _interopRequireDefault(_ReactDOMNullInputValuePropDevtool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var devToolRemoved = false;

function removeDevTool() {
  if (!devToolRemoved) {
    _ReactDOMDebugTool2.default.removeDevtool(_ReactDOMUnknownPropertyDevtool2.default);
    _ReactDOMDebugTool2.default.removeDevtool(_ReactDOMNullInputValuePropDevtool2.default);

    devToolRemoved = true;

    return true;
  }

  return false;
}

removeDevTool.restore = function restore() {
  devToolRemoved = false;

  _ReactDOMDebugTool2.default.addDevtool(_ReactDOMUnknownPropertyDevtool2.default);
  _ReactDOMDebugTool2.default.addDevtool(_ReactDOMNullInputValuePropDevtool2.default);
};

module.exports = removeDevTool;