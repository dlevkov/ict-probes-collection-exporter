/// <reference lib="webworker" />
import * as XLSX from 'xlsx';

addEventListener('message', event => {
  const res = Upload(event.data);
  // postMessage(res);
});
function Upload(file: Blob) {
  const fileReader = new FileReader();
  fileReader.onload = e => {
    const arrayBuffer: any = fileReader.result;
    const data = new Uint8Array(arrayBuffer);
    const arr = new Array();
    for (let i = 0; i != data.length; ++i) {
      arr[i] = String.fromCharCode(data[i]);
    }
    const bstr = arr.join('');
    const workbook = XLSX.read(bstr, { type: 'binary' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const result = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    postMessage(result);
  };
  fileReader.readAsArrayBuffer(file);
}
