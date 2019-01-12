const { schedule } = require('node-cron')
const moment = require('moment')
const inputKonseling = require('./input')
schedule('5 13,15,17,19,21,23 * * 1-6', async () => {
    console.log('input Konseling')
    console.log(moment().format('LLLL'))
    await inputKonseling()
})