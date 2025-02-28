import { getStocks, getStockHref, getNumberFromLetter } from '../../scripts/global.js'

const best_mf = {
  init: async () => {
    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }
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
}

export default best_mf
