import { getStocks, getStockHref } from './global.js'
const keys = ['divYield', 'lastDivDate']
const urls = [`/api/stocks/${keys[0]}/?order=desc`, `/api/stocks/${keys[1]}/?order=desc`]
const rootIds = ['dividend-yield', 'dividend-date']
const $roots = [document.getElementById(rootIds[0]), document.getElementById(rootIds[1])]

function printData (stocks, $ul, key) {
  const $detection = $ul.nextSibling.nextSibling.nextSibling
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]
    if (i === 0) $detection.innerText = new Date(stock[key].now).toLocaleString()
    const $li = document.createElement('li')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = getStockHref(stock.name, stock.isin)
    const $span = document.createElement('span')
    $span.innerText = stock[key].value || ''
    if (key === 'divYield') $span.innerText = $span.innerText + '%'
    $li.appendChild($a)
    $li.appendChild($span)
    $ul.appendChild($li)
  }
}

const stocks = await getStocks([$roots[0]], keys[0], urls[0])
printData(stocks, $roots[0].querySelector('ul.yield'), keys[0])

const stocks2 = await getStocks([$roots[1]], keys[1], urls[1])
printData(stocks2, $roots[1].querySelector('ul.date'), keys[1])
