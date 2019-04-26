
module.exports = {
	devServer: {
		proxy: {
			'/proxy': {
				target: 'http://172.16.2.188:20001',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/proxy': ''
				}
			}
		}
	}
};