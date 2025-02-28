import { getStocks, getStockHref, getLocalData } from '../../scripts/global.js'
const key = 'perf1M'
const url = `/api/stocks/${key}/?order=desc`

function printData (stocks, $target) {
  const $detection = $target.nextSibling.nextSibling.nextSibling.firstElementChild
  stocks.forEach((stock, i) => {
    if (i === 0) $detection.innerText = new Date(stock[key].now).toLocaleString()
    const $li = document.createElement('li')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = getStockHref(stock.name, stock.isin)
    const $span = document.createElement('span')
    $span.innerText = stock[key].value || ''
    $li.appendChild($a)
    $li.appendChild($span)
    $target.appendChild($li)
  })
}

function printPerfMonthPerformance() {
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
  $extracts.querySelector('.performance').classList.remove('loading')
}

const perfMonth = {
  init: async (rootId = 'perf-month') => {
    const $root = document.getElementById(rootId)
    const stocks = await getStocks([$root], key, url)
    printPerfMonthPerformance()
    printData(stocks.slice(0, 10), $root.querySelector('ul.up'))
    printData(stocks.reverse().slice(0, 10), $root.querySelector('ul.down'))
  }
}

export default perfMonth
