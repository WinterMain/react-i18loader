

module.exports = {
    webpack: function (config, options) {
        config.module.rules.push({
            // this loader will generate *.messages.json beside *.jsx files
            test: /.(js|jsx)$/,
            exclude: [
                /(node_modules)|(\.next)/,
            ],
            use: {
                loader: "reacti18n-loader",
                options: {
                    languages: ["zh_Hans_CN", "zh_Hant_HK", "en_US"],
                }
            }
        });

        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
        });

        return config;
    }
}