import proxyFetch from './proxyFetch.js'

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
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printPerformanceData () {
  const $wrap = $root.querySelector('#performance')
  $wrap.querySelector('#m1').innerText = data.info.body.perf1M?.value || 'nd'
  $wrap.querySelector('#m6').innerText = data.info.body.perf6M?.value || 'nd'
  $wrap.querySelector('#y1').innerText = data.info.body.perf1Y?.value || 'nd'
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printBorsaItaliana () {
  const $wrap = $root.querySelector('#borsa-italiana')
  $wrap.querySelector('#bi-resistance').innerText = data.analysis.body.borsaIt_resistance?.value || 'nd'
  $wrap.querySelector('#bi-support').innerText = data.analysis.body.borsaIt_support?.value || 'nd'
  $wrap.querySelector('#bi-rsi').innerText = data.analysis.body.borsaIt_rsi?.value || 'nd'
  $wrap.querySelector('#bi-evaluation').innerText = data.analysis.body.borsaIt_evaluation?.value || 'nd'
  $wrap.querySelector('#bi-rating').innerText = data.analysis.body.borsaIt_rating?.value || 'nd'
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printSole24Ore () {
  const $wrap = $root.querySelector('#il-sole-24-ore')
  $wrap.querySelector('#sol24-short-tend').innerText = data.analysis.body.sol24_shortTendency?.value || 'nd'
  $wrap.querySelector('#sol24-med-tend').innerText = data.analysis.body.sol24_mediumTendency?.value || 'nd'
  $wrap.querySelector('#sol24-profile').innerText = data.info.body.profile?.value || 'nd'
  $wrap.querySelector('#sol24-comment').innerText = data.info.body.comment?.value || 'nd'
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printMilanoFinanza () {
  const $wrap = $root.querySelector('#milano-finanza')
  $wrap.querySelector('#mf-rating').innerText = data.analysis.body.milFin_mfRanking?.value || 'nd'
  $wrap.querySelector('#mf-risk').innerText = data.analysis.body.milFin_mfRisk?.value || 'nd'
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printSoldiOnLine () {
  const $wrap = $root.querySelector('#soldi-on-line')
  $wrap.querySelector('#sol-evaluation').innerText = data.analysis.body.sol_lastJudgment?.value[2] || 'nd'
  $wrap.querySelector('#sol-target').innerText = data.analysis.body.sol_lastJudgment?.value[3] || 'nd'
  $wrap.querySelector('#sol-bank').innerText = data.analysis.body.sol_lastJudgment?.value[1] || 'nd'
  $wrap.querySelector('#sol-date').innerText = data.analysis.body.sol_lastJudgment?.value[0] || 'nd'
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data.info.status)
}

function printTeleborsa () {
  const $wrap = $root.querySelector('#teleborsa')
  $wrap.querySelector('#tb-resistance').innerText = data.analysis.body.teleb_tbResistance?.value || 'nd'
  $wrap.querySelector('#tb-support').innerText = data.analysis.body.teleb_tbSupport?.value || 'nd'
  $wrap.querySelector('#tb-trend').innerText = data.analysis.body.teleb_trend?.value || 'nd'
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
    $a.innerText = item.title
    $a.title = item.title
    $a.href = item.url
    $a.target = '_blank'
    $a.rel = 'noopener noreferrer'
    $li.classList.add('img_icon')
    $li.classList.add(getOrigNewsIcon(item.url))
    $li.appendChild($a)
    $ul.appendChild($li)
  }
  $press.classList.remove(...cls)
  $press.classList.add(data.info.status)
}

isin = new URLSearchParams(window.location.search).get('isin')
$root = document.getElementById('stock')
if (isin) {
  //await callTheApi('info')
  if (data.info.status === 'success') {
    printPrice()
    printDividendData()
    printAverageData()
    printPerformanceData()
  }
  //await callTheApi('analysis')
  if (data.analysis.status === 'success') {
    //printAnalysisData()
    printBorsaItaliana()
    printSole24Ore()
    printMilanoFinanza()
    printSoldiOnLine()
    printTeleborsa()
  }
  //await callTheApi('news')
  if (data.news.status === 'success') {
    printNewsData()
  }
}