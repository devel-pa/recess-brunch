/**
 * Created by papostol on 29/04/2014.
 */

var RecessLinter, linter, sync, formatError, formatErrorXX;

linter = require('recess');

sync = require('synchronize')

formatError = function(error) {
  var err = error[0];
  return "\n"
    + err.type
    + ": "
    + err.message
//    + " at line "
//    + err.line
    + ", column "
    + err.column
    + ". \nExtract: " + (err.extract.join('\n') || '')
    ;
};

formatErrorXX = function(error) {
  var evidence, msg;
  evidence = (error.rule ? "\n\n" + error.rule + "\n" : "\n");
  return msg = "" + error.level + ": " + error.rule + " at line " + error.lineNumber + ". " + (error.context || '');
};

module.exports = RecessLinter = (function() {
  RecessLinter.prototype.brunchPlugin = true;

  RecessLinter.prototype.type = 'stylesheet';

  RecessLinter.prototype.extension = 'less';

  function RecessLinter(config) {
    var cfg, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    this.config = config;
    cfg = (_ref = (_ref1 = (_ref2 = this.config) != null ? (_ref3 = _ref2.plugins) != null ? _ref3.lesslint : void 0 : void 0) != null ? _ref1 : (_ref4 = this.config) != null ? _ref4.lesslint : void 0) != null ? _ref : {};
    if ((_ref5 = this.config) != null ? _ref5.lesslint : void 0) {
      console.warn("Warning: config.lesslint is deprecated, move it to config.plugins.lesslint");
    }
    this.options = cfg.options;
    this.pattern = (_ref6 = cfg.pattern) != null ? _ref6 : RegExp("(" + (((_ref7 = this.config.paths) != null ? (_ref8 = _ref7.watched) != null ? _ref8.join("|") : void 0 : void 0) || "app") + ").*\\.less$");
  }

  RecessLinter.prototype.lint = function(data, path, callback) {
    var recess = sync(linter);
    sync.fiber(function() {
        return recess('./' + path, { strictPropertyOrder: false })[0];
    }, function(err, result) {
      if(err) {
        return callback(formatError(err));
      }
      if(result.errors.length)
        console.log(result.errors);
      else {
        if(result.output.length && result.output[1] !== 'STATUS: \u001b[33mPerfect!\n\u001b[39m')
          console.log(result.output.join('\n'));
      }
      return callback();
    });
  };

  return RecessLinter;

})();