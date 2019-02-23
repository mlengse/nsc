const { query, aql } = require('./db')
const moment = require('moment')
moment.locale('id')

module.exports = async () =>{
  const thn = moment().format('YYYY')
  let now = moment()
  const endOfMonth = moment().endOf('month')
  let sisaHari = 0
  try{
    results = await query(aql`FOR l IN liburnas FILTER l.tahun == ${thn} RETURN l`)
    liburs = results.map(result => result.date)
    while(endOfMonth.isAfter(now)){
      if(now.day() !== 0 && liburs.indexOf(now.format('DD MMMM YYYY')) < 0){
        //console.log(now.format('DD MMMM YYYY'))
        sisaHari++
      }
      now = now.clone().add(1, 'day')
    }
  }catch(err){
    console.log(err)
  }
  return sisaHari
}
