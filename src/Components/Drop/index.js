import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import { contents, gGlif, fontinfo } from "../../lib/ufo/testufo.js";
import UFO from "../../lib/ufo";

// let readUploadedFileAsText =  async inputFile =>   {
// function readUploadedFileAsText(inputFile) {
async function readUploadedFileAsText(inputFile) {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new Error("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile, "UTF-8");
  });
}

const handleUpload = async file => {
  try {
    const fileContents = await readUploadedFileAsText(file);
    // console.log(fileContents);
    return fileContents;
  } catch (e) {
    console.warn(e.message);
  }
};

class UfoReader {
  constructor(files) {
    this.files = files;
  }

  async getContents() {
    let contentsfile = this.files.filter(f => f.name === "contents.plist");
    const fileContents = await handleUpload(contentsfile[0].fileObject);

    return fileContents;
    // return contents;
  }
  async getFontinfo() {
    let contentsfile = this.files.filter(f => f.name === "fontinfo.plist");
    const fileContents = await handleUpload(contentsfile[0].fileObject);

    return fileContents;
  }
  async getGlyph(filename) {
    console.log("---------filename", filename);

    let contentsfile = this.files.filter(f => f.name === filename);
    const fileContents = await handleUpload(contentsfile[0].fileObject);

    // console.log("!!!!!!!!!!!!!!!fileContents", fileContents)
    // const fileContents = await handleUpload(contentsfile[0].fileObject);

    // console.log("---------gGlif", fileContents, gGlif)

    // return gGlif;

    return fileContents;
    // return XML.parse(xml, { preserveAttributes: true });
  }
}

class FolderExample extends Component {
  constructor() {
    super();
    this.state = { files: [] };
  }

  async onDrop(files) {
    let reader = new UfoReader(files);
    let ufo = new UFO(reader);
    await ufo.parse();

    this.props.onParsed(ufo.state.font);

    this.setState({
      files
    });
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
            getDataTransferItems={evt =>
              getDroppedOrSelectedFiles(evt).then(list => {
                // console.log("--- getDataTransferItems");
                // if(list.length > 0) {
                // console.log("droped list", list)
                // return list.map(({ fileObject, ...rest }) => fileObject);
                // return list.map(({ fileObject, ...rest }) => fileObject);
                return list;
                // }
              })
            }
            onDrop={this.onDrop.bind(this)}
          >
            <p>{this.props.label}</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {this.state.files.map(f => {
              return (
                <li key={f.name}>
                  {f.name} - {f.fullPath} – {f.size} bytes
                </li>
              );
            })}
          </ul>
        </aside>
      </section>
    );
  }
}

export default FolderExample;
