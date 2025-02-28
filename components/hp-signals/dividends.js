import { getStocks, getStockHref } from '../../scripts/global.js'
const $target = document.querySelector('#extracts .dividends')

const dividends = {
  ratio: async () => {
    const stocks = await getStocks([$target], 'divYield', '/api/stocks/divYield/?order=desc')
    if(stocks.length === 0) return
    const ratio = stocks[0]
    let $a = document.createElement('a')
    $a.href = getStockHref(ratio.name, ratio.isin)
    $a.innerText = ratio.name
    $target.querySelector('.ratio h5').append($a)
    $target.querySelector('.ratio span').innerText = ratio.divYield.value
  },
  last: async () => {
    const stocks = await getStocks([$target], 'lastDivDate', '/api/stocks/lastDivDate/?order=desc')
    if(stocks.length === 0) return
    const next = stocks[0]
    let $a = document.createElement('a')
    $a.href = getStockHref(next.name, next.isin)
    $a.innerText = next.name
    $target.querySelector('.next h5').append($a)
    $target.querySelector('.next span').innerText = next.lastDivDate.value
  }
}

export default dividends
