const config = {
  dev: {
    jwt: {
      expireTime: 60 * 60 * 24 * 7,
      secret: '!Wub4LUB@dUbDub!@#()',
    },
    mongoDBURL: 'mongodb://localhost/blogged_dev',
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
