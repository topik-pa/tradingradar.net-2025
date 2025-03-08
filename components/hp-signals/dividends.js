import { getStocks, getStockHref } from '../../scripts/global.js'
const $target = document.querySelectorAll('#extracts .dividends')

const dividends = {
  ratio: async () => {
    const stocks = await getStocks([$target[0]], 'divYield', '/api/stocks/divYield/?order=desc')
    if(stocks.length === 0) return
    const ratio = stocks[0]
    let $a = document.createElement('a')
    $a.href = getStockHref(ratio.name, ratio.isin)
    $a.innerText = ratio.name
    $target[0].querySelector('.ratio h4').append($a)
    $target[0].querySelector('.ratio span').innerText = ratio.divYield.value
  },
  last: async () => {
    const stocks = await getStocks([$target[1]], 'lastDivDate', '/api/stocks/lastDivDate/?order=desc')
    if(stocks.length === 0) return
    const next = stocks[0]
    let $a = document.createElement('a')
    $a.href = getStockHref(next.name, next.isin)
    $a.innerText = next.name
    $target[1].querySelector('.next h4').append($a)
    $target[1].querySelector('.next span').innerText = next.lastDivDate.value
  }
}

export default dividends
