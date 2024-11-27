import proxyFetch from './proxyFetch.js'
import stocks from '../components/stocks_list/stocks_list.js'
import perfMonth from '../components/perf-month/perf-month.js'
import perfYear from '../components/perf-year/perf-year.js'
import trend from '../components/trend/trend.js'
import inversion from '../components/inversion/inversion.js'

const statuses = ['idle', 'loading', 'success', 'error']
const custApiElements = document.querySelectorAll('#downinversion, #upinversion, #downtrends, #uptrends')

async function callCustomApi () {
  updateUI(statuses[1])
  try {
    const res = await proxyFetch('/api/custom')
    trend.init(res.body.uptrends, 'uptrends')
    trend.init(res.body.downtrends, 'downtrends')
    inversion.init(res.body.tiup, 'upinversion')
    inversion.init(res.body.tidown, 'downinversion')
    updateUI(statuses[2])
  } catch (error) {
    console.error(error)
    updateUI(statuses[3])
  }
}

function updateUI (status) {
  for (const $elem of custApiElements) {
    $elem.classList.remove(...statuses)
    $elem.classList.add(status)
  }
}

stocks.init()
//perfMonth.init()
//perfYear.init()
//callCustomApi()

const date = new Date(Date.now()).toLocaleDateString('it-IT')
document.getElementById('date').innerText = date