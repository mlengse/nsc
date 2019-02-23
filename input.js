require('dotenv').config()

const moment = require('moment')
const logUpdate = require("log-update");
const { query, aql } = require('./db')
const {
    getPendaftaranProvider,
    addPendaftaran,
} = require('./rest-api')

const writeStat = (tgl, jml, total) => {
  logUpdate(`
  tgl: ${tgl}
  jml kunj hari ini: ${jml}
  jml kunj bln ini: ${total}
`);
};

const writeRes = (no, res) => {
  logUpdate(`
  no: ${no}
  res: ${JSON.stringify(res, null, 2)}
`);
};

const jmlPeserta = process.env.JML

const uniqEs6 = arrArg =>
  arrArg.filter((elem, pos, arr) => arr.indexOf(elem) == pos);

const getRandomSubarray = (arr, size) => {
  let shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
};

  //console.log(moment().date())

module.exports = async ()=>{

    let tgl = moment().date()
    let blnThn = moment().format('MM-YYYY')
    let kunjBlnIni = []

    while(tgl) {
        //console.log(tgl)
        let tglHariIni = `${tgl}-${blnThn}`
        let kunjHariIni = await getPendaftaranProvider(tglHariIni)
        kunjBlnIni = [ ...kunjBlnIni, ...kunjHariIni]
        writeStat(tglHariIni, kunjHariIni.length, kunjBlnIni.length)
        tgl--
    }

    const kartuList = kunjBlnIni.map( ({ peserta : { noKartu } }) => noKartu)
    const uniqKartu = uniqEs6(kartuList)
    console.log(`jml kunj unik: ${uniqKartu.length}`)

    if (uniqKartu.length/jmlPeserta < 0.2) {
        const kekurangan = jmlPeserta*0.2 - uniqKartu.length
        console.log(`kekurangan contact rate: ${kekurangan}`);
        const sisaHari = moment().to(moment().endOf("month"));
        console.log(`sisa hari: ${sisaHari}`);
        let pembagi = sisaHari
          .replace("in", "")
          .replace("days", "")
          .trim();
        if(pembagi == 'a day') {
          pembagi = 1
        }
        const akanDiinput = Math.floor((kekurangan / pembagi / 4) * 0.8);
        console.log(`akan diinput: ${akanDiinput}`)

        if(!akanDiinput) {
          console.log('kbk terpenuhi')
        } else {
          const listAll = await query(aql`FOR j IN jkn FILTER j.aktif == true AND ( CONTAINS(j.ppk, 'Sibela') OR CONTAINS(j.ppk, 'Sibela') OR MATCHES(j.kdProviderPst, { "nmProvider": "Sibela " })) RETURN { no: j._key }`);

          if(listAll && listAll.length) {
            console.log(`jml pst di database: ${listAll.length}`);
            const listReady = listAll.filter(({ no }) => uniqKartu.indexOf(no) == -1)
            console.log(`jml pst blm diinput: ${listReady.length}`);
            const randomList = getRandomSubarray(listReady, akanDiinput)
            const detailList = randomList.map( ({no}) => ({
                "kdProviderPeserta": process.env.PCAREUSR,
                "tglDaftar": moment().format('DD-MM-YYYY'),
                "noKartu": no,
                "kdPoli": '021',
                "keluhan": null,
                "kunjSakit": false,
                "sistole": 0,
                "diastole": 0,
                "beratBadan": 0,
                "tinggiBadan": 0,
                "respRate": 0,
                "heartRate": 0,
                "rujukBalik": 0,
                "kdTkp": '10'
            }))
    
            for(let kunj of detailList) {
                //const kunj = detailList[0]
               // console.log(kunj.noKartu)
                let response = await addPendaftaran(kunj)
               // console.log(response)
               writeRes(kunj.noKartu, response)
               if(response.metaData.message !== 'CREATED') console.log('\n')
            }
    
          } else {
            console.log('arango error')
          }
  
        }

   } else {
     console.log('kbk terpenuhi')
   }
}
