import { getStocks, getStockHref } from '../../scripts/global.js'

const nextd = {
  init: async () => {
    const $target = document.querySelector('.nextd')
    const stocks = await getStocks([$target], 'lastDivDate', '/api/stocks/lastDivDate/?order=desc')
    if(stocks.length === 0) return

    let nextDividends = []
    const today = Date.now()
    stocks.forEach(stock => {
      if (stock.lastDivDate.value) {
        let arr = stock.lastDivDate.value.split('/')
        let date = new Date('20' + arr[2] + '-' + arr[1] + '-' + arr[0]).getTime()
        if(date > today) {
          nextDividends.push(stock)
        }
      }
    })
    nextDividends = nextDividends.slice(-9).reverse()

    const $ul = document.createElement('ul')
    nextDividends.forEach(stock => {
      const $li = document.createElement('li')
      const $a = document.createElement('a')
      const $span = document.createElement('span')
      $a.href = getStockHref(stock.name, stock.isin)
      $a.innerText = stock.name
      $li.append($a)
      $span.innerText = stock.lastDivDate.value
      $li.append($span)
      $ul.append($li)
    })
    $target.append($ul)
  }
}

export default nextd
