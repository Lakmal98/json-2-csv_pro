import {
  FormControl,
  FormHelperText,
  TextareaAutosize,
} from "@material-ui/core";
import React, { Component } from "react";

interface Props {}
interface State {}

export default class Upload extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  handleChange = (event: any) => {
    try {
      this.convert(JSON.parse(event.target.value));
    } catch (error) {
      console.log("an error");
    }
  };

  convert(json: any) {
    let converter = require("json-2-csv");

    const callbackFunction = (err: any, csv: any) => {
      if (err) console.log("An Error");
      else console.log("Csv", csv);
    };

    converter.json2csv(json, callbackFunction);
  }

  render(): JSX.Element {
    return (
      <>
        <FormControl>
          <TextareaAutosize
            minRows={10}
            maxRows={15}
            aria-label="empty textarea"
            id="paste"
            placeholder=""
            onChange={this.handleChange}
          />
          <FormHelperText id="my-helper-text">
            Enter an array of objects in JSON format
          </FormHelperText>
        </FormControl>
      </>
    );
  }
}
