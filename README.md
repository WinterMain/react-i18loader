# react-i18n-loader

react-i18n-loader is a webpack loader for React (or React framework, e.g. Next.js) i18n solution.

# Usage

## Set Up
First install it:
```
npm install react-i18n-loader --save-dev
```

## Configure webpack
```
{
    // this loader will generate *.messages.json beside *.jsx files
    test: /(pages|service)(.+?)\.(js|jsx)$/,
    exclude: [
        /(node_modules)|(\.next)/,
        /(components\/)/i,
    ],
    use: {
        loader: "react-i18n-loader",
        options: {
            // Required fields.
            // The langauages that you App supported
            languages: ["zh_Hans_CN", "zh_Hant_HK", "en_US"],


            // Optional fields.
            // The target component object where the loader will put a filed "$lang" in.
            options: "props", // It could be these three values: props, state, func 
            // The content to be translated. And the content must accord with this RegEx, default value is Chinese Simplified
            regText: "[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u2018\u2019\u201c\u201d\uff08\uff09\u3001\uff1f\uff01\ufe15\u300a\u300b]+",
        }
    }
}
```