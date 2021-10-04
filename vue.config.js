module.exports = {
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080, // CHANGE YOUR PORT HERE! DISABLE FOR HEROKU
        https: true,
        hotOnly: false,
        disableHostCheck: true // Option used to fix Invalid host header for deployment in Heroku
    },
}