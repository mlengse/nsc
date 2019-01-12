require('dotenv').config()

const moment = require('moment')
const crypto = require('crypto')
const { Client } = require("node-rest-client");

const xConsId = process.env.XCONSID
const consPwd = process.env.CONSPWD
const usernamePcare = process.env.PCAREUSR
const passwordPcare = process.env.PCAREPWD
const kdAplikasi = process.env.KDAPP
const baseURL = process.env.APIV3


const getArgs = () => {
    const xTimestamp = moment.utc().format("X");
    const var1 = `${xConsId}&${xTimestamp}`;
    const xSignature = crypto
      .createHmac("sha256", consPwd)
      .update(var1)
      .digest("base64");
    const xAuthorization = `Basic ${Buffer.from(`${usernamePcare}:${passwordPcare}:${kdAplikasi}`).toString("base64")}`;

    return { headers: { "X-cons-id": xConsId, "X-Timestamp": xTimestamp, "X-Signature": xSignature, "X-Authorization": xAuthorization } };
}

const getPeserta = async noBPJS => {
    const apiURL = `${baseURL}/peserta/${noBPJS}`;
    const args = getArgs()
    const client = new Client();
    let {response} = await new Promise(resolve => client.get(apiURL, args, data => resolve(data)))
    //console.log(data)
    return response
}

const getDiagnosa = async keyword => {
    const args = getArgs();
    const client = new Client();
    let listAll = []
    let countAll = 1
    while (listAll.length < countAll) {
        let start = listAll.length
        let apiURL = `${baseURL}/diagnosa/${keyword}/${start}/100`;
        let { response } = await new Promise(resolve =>
            client.get(apiURL, args, data => resolve(data))
        );
        //console.log(response);
        if(response.count) {
            countAll = response.count
        }
        if(response.list && response.list.length) {
            listAll = [...listAll, ...response.list]
        }
    } 
    return listAll;
}

const getDokter = async () => {
    const args = getArgs();
    const client = new Client();
    let listAll = []
    let countAll = 1
    while (listAll.length < countAll) {
        let start = listAll.length
        let apiURL = `${baseURL}/dokter/${start}/100`;
        let { response } = await new Promise(resolve =>
            client.get(apiURL, args, data => resolve(data))
        );
        //console.log(response);
        if (response.count) {
            countAll = response.count
        }
        if (response.list && response.list.length) {
            listAll = [...listAll, ...response.list]
        }
    }
    return listAll;
}

const getSadar = async () => {
    const args = getArgs();
    const client = new Client();
    let apiURL = `${baseURL}/kesadaran`;
    let { response } = await new Promise(resolve =>
      client.get(apiURL, args, data => 
        resolve(data))
    );
    return response.list;
};

const getRujukan = async noRujukan => {
    const apiURL = `${baseURL}/kunjungan/rujukan/${noRujukan}`;
    const args = getArgs()
    const client = new Client();
    let { response } = await new Promise(resolve => client.get(apiURL, args, data => resolve(data)))
    //console.log(data)
    return response

}

const getRiwayat = async noBPJS => {
    const args = getArgs();
    const client = new Client();
    let apiURL = `${baseURL}/kunjungan/peserta/${noBPJS}`;
    let { response } = await new Promise(resolve =>
        client.get(apiURL, args, data => resolve(data))
    );
    //console.log(response);
    return response.list;

}

const addKunjungan = async kunjungan => {
    const client = new Client();
    const args = {
        data: kunjungan,
        headers: getArgs()
    };
    let apiURL = `${baseURL}/kunjungan/peserta/${noBPJS}`;

    let data = await new Promise(resolve =>
        client.post(apiURL, args, data => resolve(data))
    )

    return data
}

const addPendaftaran = async 

module.exports = {
    addPendaftaran,
    addKunjungan,
    getRiwayat,
    getRujukan,
    getSadar,
    getDokter,
    getDiagnosa,
    getPeserta,
}

;(async()=> {
//    let riwayat = await getRiwayat("0000640927203");
//   console.log(riwayat)
//    let rujukan = await getRujukan("112405030119P001328");
//    console.log(rujukan)
//    let sadar = await getSadar()
//    console.log(sadar)
//    let dokter = await getDokter()
//    console.log(dokter)
//    let diagnosa = await getDiagnosa("pregn");
//    console.log(JSON.stringify(diagnosa));
//    console.log(diagnosa.length)
   // let peserta = await getPeserta("0000640927203");
   // console.log(peserta)
})()

