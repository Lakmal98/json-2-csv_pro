import {
  Button,
  FormControl,
  FormHelperText,
  TextareaAutosize,
} from "@material-ui/core";
import React, { Component } from "react";
import { CsvToHtmlTable } from "react-csv-to-table";

interface Props {}
interface State {
  json: Object;
  prettify: any;
  csv: any;
}

const LIMIT = 500;

export default class Upload extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      json: {},
      prettify: "",
      csv: "",
    };

    this.download = this.download.bind(this);
  }

  handleChange = (event: any) => {
    try {
      this.convert(JSON.parse(event.target.value));
    } catch (error) {
      console.log("an error");
    }
  };

  convert(json: any) {
    const converter = require("json-2-csv");

    const callbackFunction = (err: any, csv: any) => {
      if (err) console.log("An Error");
      else {
        this.setState({ json, csv });
      }
    };

    converter.json2csv(json, callbackFunction);
  }

  download(): void {
    const { csv } = this.state;
    //download the csv
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${new Date().toString()}.csv`;
    a.click();
  }

  render(): JSX.Element {
    let { csv } = this.state;

    //if limit is exceeded, get the first 500 lines
    if (csv.length > LIMIT) {
      csv = csv
        .split("\n")
        .slice(0, LIMIT + 1)
        .join("\n");
    }

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
        <Button color="primary" variant="contained" onClick={this.download}>
          Download
        </Button>
        <div className="csv">
          <CsvToHtmlTable data={csv} csvDelimiter="," />
        </div>
      </>
    );
  }
}
