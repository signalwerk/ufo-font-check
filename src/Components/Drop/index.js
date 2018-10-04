import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { getDroppedOrSelectedFiles } from "html5-file-selector";

class FolderExample extends React.Component {
  constructor() {
    super();
    this.state = { files: [] };
  }

  onDrop(files) {
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
            <p>Try UFO here.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {this.state.files.map(f => {
              console.log(f)
              return (<li key={f.name}>
                {f.name} - {f.fullPath} – {f.size} bytes
              </li>)
            })}
          </ul>
        </aside>
      </section>
    );
  }
}

export default FolderExample;
