import { getStocks, getStockHref } from '../../scripts/global.js'
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

const perfMonth = {
  init: async (rootId = 'perf-month') => {
    const $root = document.getElementById(rootId)
    const stocks = await getStocks([$root], key, url)
    printData(stocks.slice(0, 10), $root.querySelector('ul.up'))
    printData(stocks.reverse().slice(0, 10), $root.querySelector('ul.down'))
  }
}

export default perfMonth
