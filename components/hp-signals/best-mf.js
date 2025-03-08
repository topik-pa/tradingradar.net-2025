import { getStocks, getStockHref } from '../../scripts/global.js'

const best_mf = {
  init: async () => {
    const $target = document.querySelector('.rankings')
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

    const $ul = document.createElement('ul')
    rankings.forEach(stock => {
      const $li = document.createElement('li')
      const $a = document.createElement('a')
      const $span = document.createElement('span')
      $a.href = getStockHref(stock.name, stock.isin)
      $span.classList.add('green')
      $a.innerText = stock.name + ':'
      $li.append($a)
      $span.innerText = stock.milFin_mfRanking.value
      $li.append($span)
      $ul.append($li)
    })
    $target.append($ul)
  }
}

export default best_mf
