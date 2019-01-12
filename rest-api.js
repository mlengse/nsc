require('dotenv').config()

const moment = require('moment')
const crypto = require('crypto')
const { Client } = require("node-rest-client");
const axios = require('axios')

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
    do {
      let start = listAll.length;
      let apiURL = `${baseURL}/diagnosa/${keyword}/${start}/100`;
      let { response } = await new Promise(resolve =>
        client.get(apiURL, args, data => resolve(data))
      );
      //console.log(response);
      if (response.count) {
        countAll = response.count;
      }
      if (response.list && response.list.length) {
        listAll = [...listAll, ...response.list];
      }
    } while (listAll.length < countAll);
    return listAll;
}

const getDokter = async () => {
    const args = getArgs();
    const client = new Client();
    let listAll = []
    let countAll = 1
    do {
      let start = listAll.length;
      let apiURL = `${baseURL}/dokter/${start}/100`;
      let { response } = await new Promise(resolve =>
        client.get(apiURL, args, data => resolve(data))
      );
      //console.log(response);
      if (response.count) {
        countAll = response.count;
      }
      if (response.list && response.list.length) {
        listAll = [...listAll, ...response.list];
      }
    } while (listAll.length < countAll);
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
    const { headers } = getArgs()
    const args = {
        data: kunjungan,
        headers: headers
    };
    let apiURL = `${baseURL}/kunjungan`;

    let data = await new Promise(resolve =>
        client.post(apiURL, args, data => resolve(data))
    )

    return data
}

const addPendaftaran = async pendaftaran => {
    const client = new Client();
    const { headers } = getArgs()
    
    const args = { 
        data: pendaftaran, 
        headers: headers
    };
   // console.log(args)
    let apiURL = `${baseURL}`;

    const instance = axios.create({
        baseURL: apiURL,
        headers: headers
    })

    let { data } = await instance.post("/pendaftaran", pendaftaran);

    //console.log(data)

    return data;

}

const getPendaftaranProvider = async tanggal => {
    const args = getArgs();
    const client = new Client();
    let listAll = []
    let countAll = 1
    do {
      let start = listAll.length;
      let apiURL = `${baseURL}/pendaftaran/tglDaftar/${tanggal}/${start}/300`;
      let { response } = await new Promise(resolve =>
        client.get(apiURL, args, data => resolve(data))
      );
//      console.log(response);
      if (response) {
          if (response.count) {
              countAll = response.count;
          } 
          if (response.list && response.list.length) {
              listAll = [...listAll, ...response.list];
          }
      } else {
          countAll = 0
      }
    } while (listAll.length < countAll);
    return listAll;
} 

module.exports = {
    getPendaftaranProvider,
    addPendaftaran,
    addKunjungan,
    getRiwayat,
    getRujukan,
    getSadar,
    getDokter,
    getDiagnosa,
    getPeserta,
}

//;(async()=> {

//    let pendaftaranProvider = await getPendaftaranProvider('11-01-2019')
//    console.log(pendaftaranProvider)
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
//})()

