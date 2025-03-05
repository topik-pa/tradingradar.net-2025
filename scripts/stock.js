import proxyFetch from './proxyFetch.js'
import stock_list from '../components/stocks_list/stocks_list.js'

const data = {
  info: {
    status: 'idle',
    body: undefined
  },
  analysis: {
    status: 'idle',
    body: undefined
  },
  news: {
    status: 'idle',
    body: undefined
  }
}
const cls = ['idle', 'loading', 'success', 'error']
let $root, isin
const ND = '--'

async function callTheApi (type) {
  data[type].status = 'loading'
  try {
    const request = await proxyFetch(`/api/${type}/${isin}`)
    data[type].body = request.body
    data[type].status = 'success'
  } catch (error) {
    data[type].status = 'error'
    console.error(error)
  }
}

function printStockHeadData (isin) {
  const $head = $root.querySelector('#stock-head')
  const source = data.info.body
  $head.querySelector('#isin').innerText = isin || ND
  $head.querySelector('#address').innerText = source.address?.value || ND
  $head.querySelector('#website').innerText = source.webSite?.value.replace('http://', '').replace('https://', '') || ND

  $head.querySelector('#sector').innerText = source.sector?.value || ND
  $head.querySelector('#segment').innerText = source.segment?.value || ND
  $head.querySelector('#capital').innerText = source.capitalizzazione?.value || ND

  $head.classList.remove(...cls)
  $head.classList.add(data.info.status)
}

function printPriceData () {
  const $price = $root.querySelector('#last-price')
  const source = data.info.body
  $price.getElementsByTagName('span')[0].innerText = source.lastPrice?.value || ND

  $price.querySelector('#lp-date').innerText = new Date(source.lastPrice.now).toLocaleString()

  $price.classList.remove(...cls)
  $price.classList.add(data.info.status)
}

function printDividendData () {
  const source = data.info.body
  const $wrap = $root.querySelector('#dividend')
  $wrap.querySelector('#yeld').innerText = source.divYield?.value || ND
  $wrap.querySelector('#value').innerText = source.lastDiv?.value || ND
  $wrap.querySelector('#last').innerText = source.lastDivDate?.value || ND
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printAverageData () {
  const $wrap = $root.querySelector('#average')
  const source = data.info.body
  const isDataAvailable = source.mm20days?.value && source.mm40days?.value && source.mm100days?.value
  const lastPrice = source.lastPrice?.value
  if(!isDataAvailable)  return
  $wrap.querySelector('#mm20').innerText = source.mm20days.value || ND
  $wrap.querySelector('#mm40').innerText = source.mm40days.value || ND
  $wrap.querySelector('#mm100').innerText = source.mm100days.value || ND

  if(
    lastPrice &&
    lastPrice > source.mm20days.value &&
    lastPrice > source.mm40days.value &&
    lastPrice > source.mm100days.value
  ) {
    $wrap.querySelector('.note.green').classList.add('show')
  }
  if(
    lastPrice &&
    lastPrice < source.mm20days.value &&
    lastPrice < source.mm40days.value &&
    lastPrice < source.mm100days.value
  ) {
    $wrap.querySelector('.note.red').classList.add('show')
  }

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printPerformanceData () {
  const textColor = (value)=> {
    return (parseInt(value) > 0) ? 'green' : 'red'
  }
  const $wrap = $root.querySelector('#performance')
  const source = data.info.body
  const $m1 = $wrap.querySelector('#m1')
  const $m6 = $wrap.querySelector('#m6')
  const $y1 = $wrap.querySelector('#y1')

  $m1.innerText = source.perf1M?.value.replace('%', '') || ND
  $m6.innerText = source.perf6M?.value.replace('%', '') || ND
  $y1.innerText = source.perf1Y?.value.replace('%', '') || ND

  $m1.classList.add(textColor(source.perf1M?.value))
  $m6.classList.add(textColor(source.perf6M?.value))
  $y1.classList.add(textColor(source.perf1Y?.value))

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printSoldiOnLine () {
  const $wrap = $root.querySelector('#soldi-on-line')
  const source = data.info.body

  $wrap.querySelector('#maxabs').innerText = source.absMax?.value || ND
  $wrap.querySelector('#minabs').innerText = source.absMin?.value || ND
  $wrap.querySelector('#maxy').innerText = source.currentYearMax?.value || ND
  $wrap.querySelector('#miny').innerText = source.currentYearMin?.value || ND
  $wrap.querySelector('#volume').innerText = source.volume?.value || ND
  $wrap.querySelector('a').href = source.volume?.source

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printSole24OreData () {
  const $wrap = $root.querySelector('#il-sole-24-ore')
  const source = data.analysis.body

  if(
    source.sol24_shortTendency?.value &&
    source.sol24_mediumTendency?.value &&
    source.profile?.value &&
    source.comment?.value
  ) {
    $wrap.classList.remove('hide')
  }

  const extUrl = data.info.body.profile?.value
  const extUrl2 = extUrl.substr(extUrl.lastIndexOf('=') + 1)
  const rootExtUrl = 'https://mercati.ilsole24ore.com/azioni/borsa-italiana/dettaglio-completo/'
  const sol24_shortTendency = source.sol24_shortTendency?.value || ND
  const sol24_mediumTendency = source.sol24_mediumTendency?.value || ND
  $wrap.querySelector('#sol24-short-tend').innerText = sol24_shortTendency
  $wrap.querySelector('#sol24-short-tend').classList.add(sol24_shortTendency.toLowerCase())
  $wrap.querySelector('#sol24-med-tend').innerText = sol24_mediumTendency
  $wrap.querySelector('#sol24-med-tend').classList.add(sol24_mediumTendency.toLowerCase())

  $wrap.querySelector('#sol24-profile').innerText = source.profile?.value || ND
  $wrap.querySelector('#sol24-profile + a').href = rootExtUrl + extUrl2
  $wrap.querySelector('#sol24-comment').innerText = source.comment?.value || ND
  $wrap.querySelector('#sol24-comment + a').href = rootExtUrl + extUrl2
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.analysis.status)
}

function printMilanoFinanzaData () {
  const getRating = (value) => {
    let rating = value[0] // Rating can be something like: D+ or N/A or ""
    let returned
    if (rating === undefined) return null
    switch (rating) {
    case 'A':
      returned = 4
      break
    case 'B':
      returned =  3
      break
    case 'C':
      returned =  2
      break
    case 'D':
      returned =  1
      break
    case 'E':
      returned =  0
      break
    default:
      returned = null
      break
    }
    return returned
  }
  const $wrap = $root.querySelector('#milano-finanza')
  const source = data.analysis.body
  const mfRanking = getRating(source.milFin_mfRanking?.value)

  $wrap.querySelector('#mf-rating').innerText = source.milFin_mfRanking?.value || ND
  if(mfRanking !== null) {
    const $gauge = document.createElement('img')
    $gauge.src='/assets/images/icons/' + mfRanking + '.png'
    $gauge.alt = 'Rating: ' + mfRanking + '/4'
    $gauge.classList = 'gauge'
    $wrap.querySelector('#mf-rating').appendChild($gauge)
  }

  $wrap.querySelector('#mf-risk').innerText = source.milFin_mfRisk?.value || ND
  $wrap.querySelector('#mf-volatility').innerText = source.mfVolatility?.value || ND

  $wrap.querySelector('a').href = source.milFin_mfRanking?.source

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.analysis.status)
}

function printTargetAndJudgmentsData () {
  const $wrap = $root.querySelector('#targetprice')
  const source = data.info.body
  if(
    source.sol_lastJudgment?.value[0] &&
    source.sol_lastJudgment?.value[1] &&
    source.sol_lastJudgment?.value[2] &&
    source.sol_lastJudgment?.value[3]) {
    $wrap.classList.remove('hide')
  }
  $wrap.querySelector('#judgment').innerText = source.sol_lastJudgment?.value[2] || ND
  $wrap.querySelector('#tp').innerText = source.sol_lastJudgment?.value[3] || ND
  $wrap.querySelector('#bank').innerText = source.sol_lastJudgment?.value[1] || ND
  $wrap.querySelector('#date').innerText = source.sol_lastJudgment?.value[0] || ND
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printTeleborsaData () {
  const $wrap = $root.querySelector('#teleborsa')
  const source = data.analysis.body
  const lastPrice = source.lastPrice?.value
  $wrap.querySelector('#tb-resistance').innerText = source.teleb_tbResistance?.value || ND
  $wrap.querySelector('#tb-support').innerText = source.teleb_tbSupport?.value || ND
  $wrap.querySelector('#tb-trend').innerText = source.teleb_trend?.value || ND
  $wrap.querySelector('#tb-trend + a').href = source.teleb_trend?.source
  if(lastPrice && lastPrice > source.teleb_tbResistance?.value) {
    $wrap.querySelector('#tb-resistance + .note').classList.add('show')
  }
  if(lastPrice && lastPrice < source.teleb_tbSupport?.value) {
    $wrap.querySelector('#tb-support + .note').classList.add('show')
  }
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printNewsData () {
  const getOrigNewsIcon = (url) => {
    if(url.includes('repubblica')) {
      return 'repubblica'
    }
    if(url.includes('soldionline')) {
      return 'soldi-on-line'
    }
    if(url.includes('milanofinanza')) {
      return 'milano-finanza'
    }
    if(url.includes('borsaitaliana')) {
      return 'borsa-italiana'
    }
  }
  const $press = $root.querySelector('#stock-news')
  const $ul = $press.getElementsByTagName('ul')[0]
  for (const item of data.news.body) {
    const $li = document.createElement('li')
    const $a = document.createElement('a')
    const $h3 = document.createElement('h3')
    $h3.classList.add('img_icon')
    $h3.classList.add(getOrigNewsIcon(item.url))
    $a.innerText = item.title
    $a.title = item.title
    $a.href = item.url
    $a.target = '_blank'
    $a.rel = 'noopener noreferrer'
    $li.appendChild($h3)
    $h3.appendChild($a)
    $ul.appendChild($li)
  }
  $press.classList.remove(...cls)
  $press.classList.add(data.info.status)
}

isin = new URLSearchParams(window.location.search).get('isin')
$root = document.getElementById('stock')
if (isin) {
  await callTheApi('info')
  if (data.info.status === 'success') {
    printStockHeadData(isin)
    printPriceData()
    printDividendData()
    printAverageData()
    printPerformanceData()
    printSoldiOnLine()
  }
  await callTheApi('analysis')
  if (data.analysis.status === 'success') {
    printSole24OreData()
    printMilanoFinanzaData()
    printTargetAndJudgmentsData()
    printTeleborsaData()
  }
  await callTheApi('news')
  if (data.news.status === 'success') {
    printNewsData()
  }
}
stock_list.init()
