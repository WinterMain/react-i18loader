import React, { Component } from "react";

@i18n("Index")
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      $lang: "zh_Hans_CN"
    };
  }

  changeLang(lang) {
    this.setState({
      $lang: lang
    });
  }

  render() {
    const msg = "我是简体";

    return <div>
      <button onClick={this.changeLang.bind(this, "zh_Hans_CN")}>简体中文</button> 
      <button onClick={this.changeLang.bind(this, "zh_Hant_HK")}>繁體中文</button>
      <button onClick={this.changeLang.bind(this, "en_US")}>English</button>

      <div>
        <p>你好，欢迎使用react-i18loader，发现代码之美</p>
        <p>{msg}</p>
      </div>
    </div>
  }
}