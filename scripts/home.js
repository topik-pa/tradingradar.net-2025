import { getStocks, getLocalData, getStockHref } from '../../scripts/global.js'

import hp_signals from '../components/hp-signals/hp_signals.js'
import dividends from '../components/hp-signals/dividends.js'
import best_mf from '../components/hp-signals/best-mf.js'
import stock_list from '../components/stocks_list/stocks_list.js'
import perf_month from '../components/perf-month/perf-month.js'
import perf_year from '../components/perf-year/perf-year.js'
import trend from '../components/trend/trend.js'
import inversion from '../components/inversion/inversion.js'

hp_signals.init()
dividends.ratio()
dividends.last()
best_mf.init()
stock_list.init()
perf_month.init()
perf_year.init()
printPerfMonthPerformance()

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

// the custom call is unique for both the subsections
const $trend = document.getElementById('trend')
const $inversion = document.getElementById('inversion')
const customs = await getStocks([$trend, $inversion], 'custom', '/api/custom')
trend.init(customs.uptrends, 'uptrends')
trend.init(customs.downtrends, 'downtrends')
inversion.init(customs.tiup, 'upinversion')
inversion.init(customs.tidown, 'downinversion')
