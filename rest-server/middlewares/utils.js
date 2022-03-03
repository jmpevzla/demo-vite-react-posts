function createUrlUsers(req) {
    return `http://${req.connection.localAddress}:${req.connection.localPort}/users`
}

module.exports = {
    createUrlUsers   
}