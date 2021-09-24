import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  excludes: string[];
  headers: string[];
  dialogOpen: boolean;
  error: string;
}

const LIMIT = 500;

export default class Upload extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      json: {},
      prettify: "",
      csv: "",
      excludes: [],
      headers: [],
      dialogOpen: false,
      error: "",
    };

    this.download = this.download.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange = (event: any) => {
    try {
      // check event.target.value is not empty or spaces
      if (event.target.value.trim() !== "")
        this.convert(JSON.parse(event.target.value));
      this.setState({ error: "" });
    } catch (error) {
      this.setState({ error: "Invalid JSON input" });
    }
  };

  convert(json: any) {
    const converter = require("json-2-csv");
    const { excludes } = this.state;

    const callbackFunction = (err: any, csv: any) => {
      if (err) console.log("An Error");
      else {
        const headers = csv.split("\n")[0].split(",");
        this.setState({ json, csv, headers, dialogOpen: true });
      }
    };

    const options = {
      checkSchemaDifferences: false,
      emptyFieldValue: "",
      delimiter: {
        wrap: "\n",
        field: ",",
        eol: "\n",
      },
      excelBOM: true,
      excludeKeys: [...excludes],
    };

    converter.json2csv(json, callbackFunction, options);
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

  handleClose(): void {
    this.setState({ dialogOpen: false });
  }

  render(): JSX.Element {
    let { csv, dialogOpen, headers, error } = this.state;
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
        {error || !csv ? (
          <span>{error}</span>
        ) : (
          <Button color="primary" variant="contained" onClick={this.download}>
            Download
          </Button>
        )}
        <div className="csv">
          <CsvToHtmlTable data={csv} csvDelimiter="," />
        </div>

        <div>
          <Dialog
            open={dialogOpen}
            // TransitionComponent={Transition}
            keepMounted
            // onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {headers.map((header: string) => (
                  <div key={header}>
                    <input
                      type="checkbox"
                      value={header}
                      onChange={(e) => {
                        const { excludes } = this.state;
                        const { value } = e.target;
                        if (excludes.includes(value)) {
                          excludes.splice(excludes.indexOf(value), 1);
                        } else {
                          excludes.push(value);
                        }
                        this.setState({ excludes });
                      }}
                    />
                    {header}
                  </div>
                ))}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>close</Button>
              {/* <Button onClick={handleClose}>Agree</Button> */}
            </DialogActions>
          </Dialog>
        </div>
      </>
    );
  }
}
