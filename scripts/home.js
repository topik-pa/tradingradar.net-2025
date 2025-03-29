import { getStocks } from '../../scripts/global.js'

import hp_signals from '../components/hp-signals/hp_signals.js'
import dividends from '../components/hp-signals/dividends.js'
import nextd from '../components/hp-signals/next-dividend.js'
import best_mf from '../components/hp-signals/best-mf.js'
import stock_list from '../components/stocks_list/stocks_list.js'
import perf_month from '../components/perf-month/perf-month.js'
import perf_year from '../components/perf-year/perf-year.js'
import trend from '../components/trend/trend.js'
import inversion from '../components/inversion/inversion.js'

hp_signals.init()
dividends.ratio()
dividends.last()
nextd.init()
best_mf.init()
stock_list.init()
perf_month.init()
perf_year.init()

// the custom call is unique for both the subsections
const $trend = document.getElementById('trend')
const $inversion = document.getElementById('inversion')
const customs = await getStocks([$trend, $inversion], 'custom', '/api/custom')
trend.init(customs.uptrends, 'uptrends')
trend.init(customs.downtrends, 'downtrends')
inversion.init(customs.tiup, 'upinversion')
inversion.init(customs.tidown, 'downinversion')
