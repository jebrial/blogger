const config = {
  dev: {
    jwt: {
      expireTime: 60 * 60 * 24 * 7,
      secret: '!Wub4LUB@dUbDub!@#()',
    },
    mongoDBURL: 'mongodb://rick:sanchez@ds027165.mlab.com:27165/blog_test',
    port: 8080
  },
  test: {
    jwt: {
      expireTime: 60 * 60 * 24 * 7,
      secret: '!Wub4LUB@dUbDub!@#()',
    },
    mongoDBURL: 'mongodb://localhost/blogged_test',
    port: 3000
  }
}

module.exports = config
