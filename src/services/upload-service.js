import JSZip from 'jszip';

const zip = new JSZip();

self.addEventListener('message', (e) => {
  const files = e.data;
  console.log('Webworker Files Received', files);
  files.forEach((f) => {
    zip.file(f.name, f);
  });
  zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
    .then((blob) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          self.postMessage('done');
        }
      };

      xhr.open('POST', '/api/upload', true);
      xhr.send(blob);
      console.log('Uploaded blob');
    })
    .catch((e) => {
      console.log(e.message);
    });
});
