import proxyFetch from '../../../scripts/proxyFetch.js'
let $root; let statuses; const url = '/api/stocks/perf1Y/?order=desc'

async function callTheApi () {
  let trLocalData = JSON.parse(localStorage.getItem('trLocalData'))
  let data = trLocalData?.perfYear || []

  if(data.length === 0) {
    try {
      const remote = await proxyFetch(url)
      data = remote.body || []
    } catch (error) {
      console.error(error)
      updateUI(statuses[3])
      return
    }
  }
  updateUI(statuses[2])
  printData(data.slice(0, 10), 'ul.up')
  printData(data.reverse().slice(0, 10), 'ul.down')

  if(data.length !== 0) {
    if (!trLocalData) trLocalData = {}
    trLocalData.perfYear = data
    localStorage.setItem('trLocalData', JSON.stringify(trLocalData))
  }
}

function updateUI (status) {
  $root.classList.remove(...statuses)
  $root.classList.add(status)
}

function printData (stocks, target) {
  const $ul = $root.querySelector(target)
  const $detection = $root.querySelector(target + ' ~ p.detection em')
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]
    if (i === 0) $detection.innerText = new Date(stock.perf1Y.now).toLocaleString()
    const $li = document.createElement('li')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = `/analisi/${encodeURI(stock.name?.toLowerCase().replace(/ /g, '-'))}?isin=${stock.isin}`
    const $span = document.createElement('span')
    $span.innerText = stock.perf1Y.value || ''
    $li.appendChild($a)
    $li.appendChild($span)
    $ul.appendChild($li)
  }
}

const perfYear = {
  init: async () => {
    $root = document.getElementById('perf-year')
    statuses = ['idle', 'loading', 'success', 'error']
    updateUI(statuses[1])
    await callTheApi()
  }
}

export default perfYear
