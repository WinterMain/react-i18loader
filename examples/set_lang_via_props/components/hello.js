import React, { Component } from "react";

@i18n("Hello")
export default class Hello extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const msg = "我是简体";
    return <div>
      <p>你好，欢迎使用reacti18n-loader，发现代码之美</p>
      <p>{msg}</p>
    </div>
  }
}