$.ajaxPrefilter(function(options) {
    let url = 'http://www.liulongbin.top:3007'
    options.url = url + options.url
})