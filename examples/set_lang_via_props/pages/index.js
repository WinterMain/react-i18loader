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