'use strict';

// Mermaid start -----------------------------------------------------------
(function () {
  var mermaidError;
  mermaid.parseError = function (err, hash) {
    mermaidError = err;
  };

  $('.mermaid').each(function () {
    var $this = $(this);

    var code = _.unescape($this.html());

    if (! mermaid.parse(code)) {
      $this.after('<pre><code>' + code + '</code></pre>');
      $this.after('<pre><code>"Mermaid Error:"\n' + mermaidError + '</code></pre>');
      $this.remove();
    }
  });
})();
// Mermaid end -------------------------------------------------------------

$(function () {
  // HighlightJS start ---------------------------------------------------

  hljs.configure({
    tabReplace: '    ',
  });
  hljs.initHighlighting();

  // HighlightJS end -----------------------------------------------------

});