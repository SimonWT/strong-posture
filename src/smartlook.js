if (process.env.NODE_ENV === 'production') {
  window.smartlook ||
    (function (d) {
      var o = (smartlook = function () {
          o.api.push(arguments)
        }),
        h = d.getElementsByTagName('head')[0]
      var c = d.createElement('script')
      o.api = new Array()
      c.async = true
      c.type = 'text/javascript'
      c.charset = 'utf-8'
      c.src = 'https://rec.smartlook.com/recorder.js'
      h.appendChild(c)
    })(document)
  smartlook('init', '3c69b42fa69a18b1e00c837f070776e7a86b9068')
}
