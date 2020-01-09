# react-i18loader

react-i18loader is a webpack loader for React (or React framework, e.g. Next.js) i18n(Internationalization) solution.

[![npm version](https://img.shields.io/npm/v/react-i18loader.svg?style=flat-square)](https://www.npmjs.com/package/react-i18loader) [![npm downloads](https://img.shields.io/npm/dm/react-i18loader.svg?style=flat-square)](https://www.npmjs.com/package/react-i18loader)

# [Documentation in Chinese 中文文档](https://www.samyoc.com/single/143)

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
npm install react-i18loader --save-dev
```

### Configure webpack
```
{
    test: /\.(js|jsx)$/, // this loader will generate *.lang.json beside *.jsx files
    exclude: [
        /(node_modules)|(\.next)/,
    ],
    use: {
        loader: "react-i18loader",
        options: {
            // The folder where store the language json file.
            // If storePath value is null or empty, the language json file would store corresponding to target js/jsx file
            storePath: "locales",
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
      <p>你好，欢迎使用react-i18loader，发现代码之美</p>
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

## Advance usage

### Configure webpack for more customization
```
{
    // this loader will generate *.lang.json beside *.jsx files
    test: /\.(js|jsx)$/,
    exclude: [
        /(node_modules)|(\.next)/,
    ],
    use: {
        loader: "react-i18loader",
        options: {
            // The folder where store the language json file.
            // If storePath value is null or empty, the language json file would store corresponding to target js/jsx file
            storePath: "locales",

            // Required fields.
            // The langauages that you App supported
            languages: ["zh_Hans_CN", "zh_Hant_HK", "en_US"],


            // Optional fields.
            // The target component object where the loader will put a filed "$lang" in.
            method: "props", // It could be these three values: props, state, func 
            // The content to be translated. And the content must accord with this RegEx, default value is Chinese Simplified
            regText: "[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u2018\u2019\u201c\u201d\uff08\uff09\u3001\uff1f\uff01\ufe15\u300a\u300b]+",
        }
    }
}
```
## Property Of `options`

### `storePath`
Indicate the folder where store the language json file. If storePath value is null or empty, the language json file would store corresponding to target js/jsx file.

### `languages`
It should be an array which could contain the target language. You can also add Ja_JP, In_In ,bala and so on to this array.

### `regText`
Based on the regular text `regText`, you can extract the matching text as the translation source.

So if you want to translate Chinese into other languages，you should set：
```
regText: "[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u2018\u2019\u201c\u201d\uff08\uff09\u3001\uff1f\uff01\ufe15\u300a\u300b]+"
```

### `method`

Property `method` could be these three values: props, state, func. Its default value is `props`.

value | description |   
-|-|
props | An property name `$lang` would add to the props of React component, so you need to change the `props.$lang` to change the web language. For more information, please refer the `set_lang_via_props` in `examples` folder  |
state | An property name `$lang` would add to the state of React component, so you need to change the `state.$lang` to change the web language. For more information, please refer the `set_lang_via_state` in `examples` folder |
func | You need to add a method `$getLang() {return XXX; // The language code like 'zh_Hans_CN'` to your React component}. For more information, please refer the `set_lang_via_func` in `examples` folder|

## They are using `react-i18loader`
[<img src="https://www.samyoc.com/img/logo.png" width="100px;" alt="SamYoc"/><br /><sub><b>SamYoc API Doc</b></sub>](https://www.samyoc.com/)| 
:---: |
