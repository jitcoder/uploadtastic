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

    this.state = {
      done: false,
      uploading: false
    };

    this.onDrop = this.onDrop.bind(this);
    this.moveLightning = this.moveLightning.bind(this);
    this.onWorkerMessage = this.onWorkerMessage.bind(this);

    this.worker = null;
    this.zip = new JSZip();
    this.moverTimer = null;
  }

  componentDidMount() {
    this.moverTimer = setInterval(this.moveLightning, 100);
  }

  componentWillUnmount() {
    clearInterval(this.moverTimer);
  }

  onWorkerMessage(e) {
    if (e.data === 'done') {
      this.setState({ done: true, uploading: false }, () => {
        this.worker.removeEventListener('message', this.onWorkerMessage);
        this.worker.terminate();
        this.worker = null;
      });
    }
  }

  onDrop(files) {
    console.log('Files: ', files);
    this.setState({ uploading: true }, () => {
      this.worker = new Worker('/assets/js/uploadservice.js');
      this.worker.addEventListener('message', this.onWorkerMessage);
      this.worker.postMessage(files);
    });
    console.log('Files: ', files);
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
    let content = null;

    if (this.state.uploading) {
      content = <span>Uploading...</span>;
    } else if (this.state.done) {
      content = <span>Upload Complete!</span>;
    } else {
      content = <Dropzone onDrop={this.onDrop} className="upload-box" />;
    }

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
          {content}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('container'));
