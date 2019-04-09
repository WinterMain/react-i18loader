# reacti18n-loader

reacti18n-loader is a webpack loader for React (or React framework, e.g. Next.js) i18n solution.

# How it work?
1. Extract the sentences to be translated from the target file.
2. Generate a JSON file corresponding to target file and fill in the extracted sentences.
3. Loader will hanler the target file to import this JSON file and add a method to retrieve the translations.
4. Change the $lang in props (You can change it in state or get the value by function, depends on your webpack config) to change the APP language.

# Usage

## Simple usage

### Set Up
First install it:
```
npm install react-i18n-loader --save-dev
```

### Configure webpack
```
{
    test: /\.(js|jsx)$/, // this loader will generate *.lang.json beside *.jsx files
    exclude: [
        /(node_modules)|(\.next)/,
    ],
    use: {
        loader: "react-i18n-loader",
        options: {
            languages: ["zh_Hans_CN", "zh_Hant_HK", "en_US"], // The langauages that you App supported
        }
    }
}
```

### Put label `@i18n("Page_Or_Component_Name")` on your pages or components

hello.js

```
import React, { Component } from "react";

@i18n("Hello")
export default class Hello extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const msg = "我是简体";
    return <div>
      <p>你好，欢迎使用react-i18n-loader，发现代码之美</p>
      <p>{msg}</p>
    </div>
  }
}
```
* You need to change the `$lang` in `props` to change the language

index.js

```
import React, { Component } from "react";
import Hello from "../components/hello";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "zh_Hans_CN"
    };
  }

  changeLang(lang) {
    this.setState({lang});
  }

  render() {
    return <div>
      <button onClick={this.changeLang.bind(this, "zh_Hans_CN")}>简体中文</button> 
      <button onClick={this.changeLang.bind(this, "zh_Hant_HK")}>繁體中文</button>
      <button onClick={this.changeLang.bind(this, "en_US")}>English</button>
      <Hello $lang={this.state.lang}/>
    </div>
  }
}
```

## Advance Setting
```
{
    // this loader will generate *.lang.json beside *.jsx files
    test: /\.(js|jsx)$/,
    exclude: [
        /(node_modules)|(\.next)/,
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
### 