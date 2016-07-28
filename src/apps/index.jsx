import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import 'sass/style.scss';
import 'sass/drop-box.scss';
import JSZip from 'jszip';

let direction = 1;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.moveLightning = this.moveLightning.bind(this);

    this.zip = new JSZip();
    this.moverTimer = null;
  }

  componentDidMount() {
    this.moverTimer = setInterval(this.moveLightning, 100);
  }

  componentWillUnmount() {
    clearInterval(this.moverTimer);
  }

  onDrop(files) {
    console.log('Files: ', files);
    files.forEach((f) => {
      this.zip.file(f.name, f);
    });
    this.zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      .then((blob) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        xhr.send(blob);
      });
  }

  moveLightning() {
    const el = document.getElementById('lightning');
    const boxLeftPos = el.offsetLeft;

    if (boxLeftPos > (window.innerWidth - 300)) {
      direction = -1;
    }

    if (boxLeftPos < 300) {
      direction = 1;
    }

    el.style.left = `${(boxLeftPos + 10 * direction)}px`;
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <span className="white-box">Upload-a-tastic</span>
        </div>
        <div className="row">
          <h5>The easiest way to zip and share files!</h5>
          <p>
            Go ahead and drag-n-drop some files in the box
          </p>
        </div>
        <div className="row center">
          <Dropzone onDrop={this.onDrop} className="upload-box" />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('container'));
