import readXlsxFile from "read-excel-file";
import { utils, writeFile } from "xlsx";

export async function parseExcel(e) {
    let excelFile = e.target.files[0];

    return await readXlsxFile(excelFile)
    .then((rows) => parseRows(rows))
    .then((parsed_data) => {
        alert("엑셀 불러오기 성공")
        return parsed_data;
    }).catch((error) => alert("엑셀 불러오기 실패: " + error));
}

function parseRows(rows) {
    const data = [];

    for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] !== null && rows[i][0] !== "") {
            let crn = rows[i][0].toString()
            crn = crn.replaceAll('-', '')

            if (!isNaN(crn)) {
                data.push(crn)
            }

        }
    }

    const result = groupOutput(data);

    return result;
}

function groupOutput(data) {
    const result = [];

    const chunk = 100;
    let i = 0;
    let j = 0;

    for (i = 0, j = data.length; i < j; i += chunk) {
        let temp = data.slice(i, i+chunk);
        result.push(temp);
    }

    return result;
}

function constructURL() {    
    let key = "TYL7RY2Rgdb1YnwnJoF40OPohnDgToDu3waCfXeuUsJwtWX0m9H%2Fp9qbmvOrL6trE4fAmUHr%2BbI50eraQ3cdpg%3D%3D"
    let url = "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey="

    return url + key
}

export async function callAPIBulk(data) {
    let output = [["사업자등록번호", "납세자상태", "과세유형", "폐업일"]]

    for await (const datum of data) {
        const temp = await callAPI(datum);
        output = output.concat(temp)
    }

    createExcel(output);
}

async function callAPI(data) {
    const url = constructURL()

    return await fetch(url, 
        {
            "method": "POST",
            "headers": {
              "content-type": "application/json",
              "accept": "application/json"
            },
            "body": JSON.stringify({"b_no": data})
        })
        .then(response => response.json())
        .then(json => parse(json));
}

function formatDate(date) {
    const yyyy = date.substring(0, 4)
    const mm = date.substring(4, 6)
    const dd = date.substring(6, 8)

    return yyyy + "-" + mm + "-" + dd
}

function parse(json) {
    const output = []

    for (let i = 0;  i < json["data"].length; i++) {
        const crn = json["data"][i]["b_no"]
        const status = json["data"][i]["b_stt"] === "" ? "-" : json["data"][i]["b_stt"]
        const type = json["data"][i]["tax_type"] === "국세청에 등록되지 않은 사업자등록번호입니다." ? "국세청에 등록되지 않음" : json["data"][i]["tax_type"]
        const endDate = json["data"][i]["end_dt"] === "" ? "-" : formatDate(json["data"][i]["end_dt"])

        output.push([crn, status, type, endDate]);
    }

    return output;
}

function createExcel(parsedOutput) {
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(parsedOutput);
    
    utils.book_append_sheet(workbook, worksheet);

    writeFile(workbook, "사업자상태조회.xlsx");
}