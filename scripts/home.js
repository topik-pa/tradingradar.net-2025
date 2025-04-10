import { getStocks } from '../../scripts/global.js'

import hp_header from '../components/hp-header/hp_header.js'
import dividends from '../components/hp-signals/dividends.js'
import nextd from '../components/hp-signals/next-dividend.js'
import best_mf from '../components/hp-signals/best-mf.js'
import perf_month from '../components/perf-month/perf-month.js'
import perf_year from '../components/perf-year/perf-year.js'
import trend from '../components/trend/trend.js'
import inversion from '../components/inversion/inversion.js'

hp_header.init()
dividends.ratio()
dividends.last()
nextd.init()
best_mf.init()
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
