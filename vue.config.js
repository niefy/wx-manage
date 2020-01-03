module.exports = {
	publicPath: "./",
    devServer: {
		proxy: {
			'/wx': {
				target: 'http://localhost:8088/'
			}
		},
		port:8001,
		inline:false //实时编译
	},
	configureWebpack:{
		devServer: {
			disableHostCheck: true
		},
		externals: {
			vue: "Vue",
			"vue-router": "Router",
            "element-ui": "ELEMENT",
            "tinymce":"tinymce"
		}
	},
	chainWebpack: config => {
		// 移除 prefetch 插件
		config.plugins.delete('prefetch')
	},

	outputDir: undefined,
	assetsDir: undefined,
	runtimeCompiler: undefined,
	productionSourceMap: false,
	parallel: undefined,
	css: undefined
}