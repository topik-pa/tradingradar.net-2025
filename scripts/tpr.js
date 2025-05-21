import { getStocks, getStockHref } from './global.js'
const key = 'lastJudgment'
const url = `/api/stocks/${key}/?order=desc`
const rootId = 'target-price'
const $root = document.getElementById(rootId)

function printData (stocks, target) {
  const $table = $root.querySelector(target)
  const $tbody = $table.querySelector('tbody')
  const $detection = $root.querySelector(target + ' ~ p.detection em')
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]
    if (i === 0) $detection.innerText = new Date(stock.lastJudgment.now).toLocaleString()
    if(!stock.lastJudgment.value[0]) continue
    const $tr = document.createElement('tr')
    const $td1 = document.createElement('td')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = getStockHref(stock.name, stock.isin)
    $td1.appendChild($a)
    $tr.appendChild($td1)

    const $td2 = document.createElement('td')
    $td2.innerText = stock.lastJudgment?.value[0]
    $tr.appendChild($td2)

    const $td3 = document.createElement('td')
    $td3.innerText = stock.lastJudgment?.value[1]
    $tr.appendChild($td3)

    const $td4 = document.createElement('td')
    $td4.innerText = stock.lastJudgment?.value[2]
    $tr.appendChild($td4)

    const $td5 = document.createElement('td')
    $td5.innerText = stock.lastJudgment?.value[3]
    $tr.appendChild($td5)

    $tbody.appendChild($tr)
  }
}

const stocks = await getStocks([$root], key, url)
printData(stocks, 'table')
