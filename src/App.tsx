import React, { Component } from "react";
import "./App.css";
import Upload from "./componentes/Upload";

interface Props {}

export default class App extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render(): JSX.Element {
    return (
      <>
        <Upload />
      </>
    );
  }
}
