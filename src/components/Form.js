import { useState } from 'react';
import { callAPIBulk, parseExcel } from '../backend.js'

function Form() {

    const[data, setData] = useState();
    const[uploaded, setUploaded] = useState("btn btn-danger col-1 disabled");

    const onFileUpload = (e) => {
        parseExcel(e).then((EXCEL_DATA) => {
           if (EXCEL_DATA.length !== 0) {
               setData({"crn_lists" : EXCEL_DATA});
               setUploaded("btn btn-primary col-1");
           } 
        });
    }

    const onStatusButtonClick = () => {
        callAPIBulk(data["crn_lists"]);
    }

  return (
    <div className="Form-Section">
      <form>
        <div className="form-group row">
          <label className="col-2 col-form-label">사업자등록번호 엑셀: </label>
          <div className="col-8">
            <input id="excel-input" onChange={onFileUpload} type="file" className="form-control" accept=".xlsx" />
          </div>
          <button type="button" className={uploaded} onClick={onStatusButtonClick}>조회</button>
        </div>
      </form>
    </div>
  );
}

export default Form;