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
  let trLocalData = JSON.parse(localStorage.getItem('trLocalData'))
  let uptrends = trLocalData?.uptrends || null
  let downtrends = trLocalData?.downtrends || null
  let upinversion = trLocalData?.upinversion || null
  let downinversion = trLocalData?.downinversion || null

  if(
    !uptrends ||
    !downtrends ||
    !upinversion ||
    !downinversion
  ) {
    try {
      const remote = await proxyFetch('/api/custom')
      let data = remote.body || []
      uptrends = data.uptrends
      downtrends = data.downtrends
      upinversion = data.tiup
      downinversion = data.tidown

      if(data.length !== 0) {
        if (!trLocalData) trLocalData = {}
        trLocalData.uptrends = data.uptrends
        trLocalData.downtrends = data.downtrends
        trLocalData.upinversion = data.tiup
        trLocalData.downinversion = data.tidown
        localStorage.setItem('trLocalData', JSON.stringify(trLocalData))
      }
    } catch (error) {
      console.error(error)
      updateUI(statuses[3])
      return
    }
  }
  trend.init(uptrends, 'uptrends')
  trend.init(downtrends, 'downtrends')
  inversion.init(upinversion, 'upinversion')
  inversion.init(downinversion, 'downinversion')
  updateUI(statuses[2])
}

function updateUI (status) {
  for (const $elem of custApiElements) {
    $elem.classList.remove(...statuses)
    $elem.classList.add(status)
  }
}

stocks.init()
await perfMonth.init()
await perfYear.init()
await callCustomApi()

const date = new Date(Date.now()).toLocaleDateString('it-IT')
document.getElementById('date').innerText = date
