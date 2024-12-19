import { getStocks, getStockHref } from './global.js'
const key = 'rating'
const url = `/api/stocks/${key}/?order=asc`
const rootId = 'bibr'
const $root = document.getElementById(rootId)

function printData (stocks, target) {
  const $table = $root.querySelector(target)
  const $tbody = $table.querySelector('tbody')
  const $detection = $root.querySelector(target + ' ~ p.detection em')
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]
    if (i === 0) $detection.innerText = new Date(stock.borsaIt_rating.now).toLocaleString()
    const $tr = document.createElement('tr')
    const $td1 = document.createElement('td')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = getStockHref(stock.name, stock.isin)
    $td1.appendChild($a)
    $tr.appendChild($td1)

    const $td2 = document.createElement('td')
    $td2.innerText = stock.borsaIt_rating?.value
    $tr.appendChild($td2)

    $tbody.appendChild($tr)
  }
}

const stocks = await getStocks([$root], key, url)
printData(stocks, 'table')
