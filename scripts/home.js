import { getStocks, getLocalData, getStockHref, getNumberFromLetter } from '../../scripts/global.js'
import stock_list from '../components/stocks_list/stocks_list.js'
import perf1M from '../components/perf-month/perf-month.js'
import perf1Y from '../components/perf-year/perf-year.js'
import trend from '../components/trend/trend.js'
import inversion from '../components/inversion/inversion.js'

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

const printPerf1MBullet = () => {
  const stocks = getLocalData('perf1M')
  if(stocks.length === 0) return
  const best = stocks[0]
  const worst = stocks[stocks.length - 1]
  const $extracts = document.getElementById('extracts')
  let $a = document.createElement('a')
  $a.href = getStockHref(worst.name, worst.isin)
  $a.innerText = worst.name
  $extracts.querySelector('.performance .worst h5').append($a)
  $extracts.querySelector('.performance .worst span').innerText = worst.perf1M.value

  $a = document.createElement('a')
  $a.href = getStockHref(best.name, best.isin)
  $a.innerText = best.name
  $extracts.querySelector('.performance .best h5').append($a)
  $extracts.querySelector('.performance .best span').innerText = best.perf1M.value
}
async function callDivYield () {
  const $target = document.querySelector('#extracts .dividends')
  const stocks = await getStocks([$target], 'divYield', '/api/stocks/divYield/?order=desc')
  if(stocks.length === 0) return
  const ratio = stocks[0]
  let $a = document.createElement('a')
  $a.href = getStockHref(ratio.name, ratio.isin)
  $a.innerText = ratio.name
  $target.querySelector('.ratio h5').append($a)
  $target.querySelector('.ratio span').innerText = ratio.divYield.value
}
async function callLastDivDate () {
  const $target = document.querySelector('#extracts .dividends')
  const stocks = await getStocks([$target], 'lastDivDate', '/api/stocks/lastDivDate/?order=desc')
  if(stocks.length === 0) return
  const next = stocks[0]
  let $a = document.createElement('a')
  $a.href = getStockHref(next.name, next.isin)
  $a.innerText = next.name
  $target.querySelector('.next h5').append($a)
  $target.querySelector('.next span').innerText = next.lastDivDate.value
}
/* async function callBorsaItalianaRatings () {
  const $target = document.querySelector('#extracts .ratings')
  const stocks = await getStocks([$target], 'rating', '/api/stocks/rating/?order=asc')
  if(stocks.length === 0) return
  const ratings = stocks.filter((elem) => {
    return elem.borsaIt_rating.value === 4
  })
  if(ratings.length === 0) return
  shuffleArray(ratings)
  const best = ratings[0]
  let $a = document.createElement('a')
  $a.href = getStockHref(best.name, best.isin)
  $a.innerText = best.name
  $target.querySelector('.best h5').append($a)
  $target.querySelector('.best span').innerText = best.borsaIt_rating.value

  const $gauge = document.createElement('img')
  $gauge.src='/assets/images/icons/' + best.borsaIt_rating?.value + '.png'
  $gauge.alt = 'Rating: ' + best.borsaIt_rating?.value + '/4'
  $gauge.classList = 'gauge'
  $target.querySelector('.best').appendChild($gauge)
} */
async function callMilanoFinanzaRankings () {
  const $target = document.querySelector('#extracts .rankings')
  const stocks = await getStocks([$target], 'rankings', '/api/stocks/mfRanking/?order=asc')
  if(stocks.length === 0) return
  let rankings = stocks.filter((elem) => {
    return (elem.milFin_mfRanking.value === 'A+' || elem.milFin_mfRanking.value === 'A' || elem.milFin_mfRanking.value === 'A-')
  })
  if(rankings.length === 0) {
    rankings = stocks.filter((elem) => {
      return (elem.milFin_mfRanking.value === 'B+')
    })
  }
  shuffleArray(rankings)
  const best = rankings[0]
  let $a = document.createElement('a')
  $a.href = getStockHref(best.name, best.isin)
  $a.innerText = best.name
  $target.querySelector('.best h5').append($a)
  $target.querySelector('.best span').innerText = best.milFin_mfRanking.value

  const $gauge = document.createElement('img')
  $gauge.src='/assets/images/icons/' + getNumberFromLetter(best.milFin_mfRanking.value) + '.png'
  $gauge.alt = 'Ranking: ' + best.milFin_mfRanking.value
  $gauge.classList = 'gauge'
  $target.querySelector('.best').appendChild($gauge)
}
const addDate = () => {
  const today = new Date(Date.now()).toLocaleDateString('it-IT')
  document.getElementById('today').innerText = today
}

stock_list.init()
addDate()
await perf1M.init()
printPerf1MBullet()

await callDivYield()
await callLastDivDate()
// await callBorsaItalianaRatings()
await callMilanoFinanzaRankings()

await perf1Y.init()

const $trend = document.getElementById('trend')
const $inversion = document.getElementById('inversion')
const customs = await getStocks([$trend, $inversion], 'custom', '/api/custom')
trend.init(customs.uptrends, 'uptrends')
trend.init(customs.downtrends, 'downtrends')
inversion.init(customs.tiup, 'upinversion')
inversion.init(customs.tidown, 'downinversion')
