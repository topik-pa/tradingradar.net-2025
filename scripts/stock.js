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

async function callTheApi (type) {
  data[type].status = 'loading'
  //updateUIStatus(type)
  try {
    const request = await proxyFetch(`/api/${type}/${isin}`)
    data[type].body = request.body
    data[type].status = 'success'
  } catch (error) {
    data[type].status = 'error'
    console.error(error)
  }
  //updateUIStatus(type)
}

/* function updateUIStatus (type) {
  const $wrap = document.getElementById(type)
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data[type].status)
} */

function printGeneralInfo (isin) {
  const $head = $root.querySelector('#head')
  $head.querySelector('#isin').innerText = isin || 'nd'
  $head.querySelector('#address').innerText = data.info.body.address?.value || 'nd'
  $head.querySelector('#website').innerText = data.info.body.webSite?.value.replace('http://', '').replace('https://', '') || 'nd'

  $head.querySelector('#sector').innerText = data.info.body.sector?.value || 'nd'
  $head.querySelector('#segment').innerText = data.info.body.segment?.value || 'nd'
  $head.querySelector('#capital').innerText = data.info.body.capitalizzazione?.value || 'nd'

  $head.classList.remove(...cls)
  $head.classList.add(data.info.status)
}

function printPrice () {
  const $price = $root.querySelector('#last-price')
  $price.getElementsByTagName('span')[0].innerText = data.info.body.lastPrice?.value || 'nd'
  $price.classList.remove(...cls)
  $price.classList.add(data.info.status)
}

function printDividendData () {
  const $wrap = $root.querySelector('#dividend')
  $wrap.querySelector('#yeld').innerText = data.info.body.divYield?.value || 'nd'
  $wrap.querySelector('#value').innerText = data.info.body.lastDiv?.value || 'nd'
  $wrap.querySelector('#last').innerText = data.info.body.lastDivDate?.value || 'nd'
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printAverageData () {
  const $wrap = $root.querySelector('#average')
  $wrap.querySelector('#mm20').innerText = data.info.body.mm20days?.value || 'nd'
  $wrap.querySelector('#mm40').innerText = data.info.body.mm40days?.value || 'nd'
  $wrap.querySelector('#mm100').innerText = data.info.body.mm100days?.value || 'nd'

  if(
    data.info.body.lastPrice?.value > data.info.body.mm20days?.value &&
    data.info.body.lastPrice?.value > data.info.body.mm40days?.value &&
    data.info.body.lastPrice?.value > data.info.body.mm100days?.value
  ) {
    $wrap.querySelector('.note.green').classList.add('show')
  }
  if(
    data.info.body.lastPrice?.value < data.info.body.mm20days?.value &&
    data.info.body.lastPrice?.value < data.info.body.mm40days?.value &&
    data.info.body.lastPrice?.value < data.info.body.mm100days?.value
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
  const $m1 = $wrap.querySelector('#m1')
  const $m6 = $wrap.querySelector('#m6')
  const $y1 = $wrap.querySelector('#y1')

  $m1.innerText = data.info.body.perf1M?.value.replace('%', '') || 'nd'
  $m6.innerText = data.info.body.perf6M?.value.replace('%', '') || 'nd'
  $y1.innerText = data.info.body.perf1Y?.value.replace('%', '') || 'nd'

  $m1.classList.add(textColor(data.info.body.perf1M?.value))
  $m6.classList.add(textColor(data.info.body.perf6M?.value))
  $y1.classList.add(textColor(data.info.body.perf1Y?.value))

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

/* function printBorsaItaliana () {
  const $wrap = $root.querySelector('#borsa-italiana')
  $wrap.querySelector('#bi-resistance').innerText = data.analysis.body.borsaIt_resistance?.value || 'nd'
  $wrap.querySelector('#bi-support').innerText = data.analysis.body.borsaIt_support?.value || 'nd'
  $wrap.querySelector('#bi-rsi').innerText = data.analysis.body.borsaIt_rsi?.value || 'nd'
  $wrap.querySelector('#bi-evaluation').innerText = data.analysis.body.borsaIt_evaluation?.value || 'nd'
  $wrap.querySelector('#bi-evaluation + a').href = data.analysis.body.borsaIt_evaluation?.source
  //$wrap.querySelector('#bi-rating').innerText = data.analysis.body.borsaIt_rating?.value || 'nd'

  const $gauge = document.createElement('img')
  const rating = data.analysis.body.borsaIt_rating?.value || null
  if(rating) {
    $gauge.src='/assets/images/icons/' + rating + '.png'
    $gauge.alt = 'Rating: ' + rating + '/4'
    $gauge.classList = 'gauge'
    $wrap.querySelector('#bi-rating').innerText = rating + '/4'
    $wrap.querySelector('#bi-rating').appendChild($gauge)
  } else {
    $wrap.querySelector('#bi-rating').innerText = 'nd'
  }

  if(data.analysis.body.borsaIt_resistance?.value &&
    data.info.body.lastPrice?.value > data.analysis.body.borsaIt_resistance?.value) {
    $wrap.querySelector('#bi-resistance + .note').classList.add('show')
  }
  if(data.analysis.body.borsaIt_support?.value &&
    data.info.body.lastPrice?.value < data.analysis.body.borsaIt_support?.value) {
    $wrap.querySelector('#bi-support + .note').classList.add('show')
  }

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
} */

function printSole24Ore () {
  const $wrap = $root.querySelector('#il-sole-24-ore')
  const extUrl = data.info.body.profile?.source
  const extUrl2 = extUrl.substr(extUrl.lastIndexOf('=') + 1)
  const rootExtUrl = 'https://mercati.ilsole24ore.com/azioni/borsa-italiana/dettaglio-completo/'
  const sol24_shortTendency = data.analysis.body.sol24_shortTendency?.value || 'nd'
  const sol24_mediumTendency = data.analysis.body.sol24_mediumTendency?.value || 'nd'
  $wrap.querySelector('#sol24-short-tend').innerText = sol24_shortTendency
  $wrap.querySelector('#sol24-short-tend').classList.add(sol24_shortTendency.toLowerCase())
  $wrap.querySelector('#sol24-med-tend').innerText = sol24_mediumTendency
  $wrap.querySelector('#sol24-med-tend').classList.add(sol24_mediumTendency.toLowerCase())

  $wrap.querySelector('#sol24-profile').innerText = data.info.body.profile?.value || 'nd'
  $wrap.querySelector('#sol24-profile + a').href = rootExtUrl + extUrl2
  $wrap.querySelector('#sol24-comment').innerText = data.info.body.comment?.value || 'nd'
  $wrap.querySelector('#sol24-comment + a').href = rootExtUrl + extUrl2
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printMilanoFinanza () {
  const getRating = (value) => {
    let rating = value[0]
    let returned
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
    default:
      returned = 0
      break
    }
    return returned
  }
  const $wrap = $root.querySelector('#milano-finanza')
  // $wrap.querySelector('#mf-rating').innerText = data.analysis.body.milFin_mfRanking?.value || 'nd'

  const $gauge = document.createElement('img')
  $gauge.src='/assets/images/icons/' + getRating(data.analysis.body.milFin_mfRanking?.value) + '.png'
  $gauge.alt = 'Rating: ' + getRating(data.analysis.body.milFin_mfRanking?.value) + '/4'
  $gauge.classList = 'gauge'
  $wrap.querySelector('#mf-rating').innerText = data.analysis.body.milFin_mfRanking?.value
  $wrap.querySelector('#mf-rating').appendChild($gauge)

  $wrap.querySelector('#mf-risk').innerText = data.analysis.body.milFin_mfRisk?.value || 'nd'
  $wrap.querySelector('#mf-volatility').innerText = data.info.body.mfVolatility?.value || 'nd'

  $wrap.querySelector('a').href = data.analysis.body.milFin_mfRanking?.source

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printTargetAndJudgments () {
  const $wrap = $root.querySelector('#targetprice')

  $wrap.querySelector('#judgment').innerText = data.analysis.body.sol_lastJudgment?.value[2] || 'nd'
  $wrap.querySelector('#tp').innerText = data.analysis.body.sol_lastJudgment?.value[3] || 'nd'
  $wrap.querySelector('#bank').innerText = data.analysis.body.sol_lastJudgment?.value[1] || 'nd'
  $wrap.querySelector('#date').innerText = data.analysis.body.sol_lastJudgment?.value[0] || 'nd'
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printSoldiOnLine () {
  const $wrap = $root.querySelector('#soldi-on-line')

  $wrap.querySelector('#maxabs').innerText = data.info.body.absMax?.value || 'nd'
  $wrap.querySelector('#minabs').innerText = data.info.body.absMin?.value || 'nd'
  $wrap.querySelector('#maxy').innerText = data.info.body.currentYearMax?.value || 'nd'
  $wrap.querySelector('#miny').innerText = data.info.body.currentYearMin?.value || 'nd'
  $wrap.querySelector('#volume').innerText = data.info.body.volume?.value || 'nd'
  $wrap.querySelector('a').href = data.info.body.volume?.source

  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printTeleborsa () {
  const $wrap = $root.querySelector('#teleborsa')
  $wrap.querySelector('#tb-resistance').innerText = data.analysis.body.teleb_tbResistance?.value || 'nd'
  $wrap.querySelector('#tb-support').innerText = data.analysis.body.teleb_tbSupport?.value || 'nd'
  $wrap.querySelector('#tb-trend').innerText = data.analysis.body.teleb_trend?.value || 'nd'
  $wrap.querySelector('#tb-trend + a').href = data.analysis.body.teleb_trend?.source

  if(data.info.body.lastPrice?.value > data.analysis.body.teleb_tbResistance?.value) {
    $wrap.querySelector('#tb-resistance + .note').classList.add('show')
  }
  if(data.info.body.lastPrice?.value < data.analysis.body.teleb_tbSupport?.value) {
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
  const $press = $root.querySelector('#news')
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
    printGeneralInfo(isin)
    printPrice()
    printDividendData()
    printAverageData()
    printPerformanceData()
    printSoldiOnLine()
  }
  await callTheApi('analysis')
  if (data.analysis.status === 'success') {
    //printAnalysisData()
    //printBorsaItaliana()
    printSole24Ore()
    printMilanoFinanza()
    printTargetAndJudgments()

    printTeleborsa()
  }
  await callTheApi('news')
  if (data.news.status === 'success') {
    printNewsData()
  }
}
stock_list.init()
