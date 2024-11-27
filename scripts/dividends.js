import proxyFetch from '../../scripts/proxyFetch.js'
let $root
let statuses
const urlYield = '/api/stocks/divYield/?order=desc'
const urlDate = '/api/stocks/lastDivDate/?order=desc'

async function callTheApi () {
  try {
    const responseYield = await proxyFetch(urlYield)
    const responseDate = await proxyFetch(urlDate)
    updateUI(statuses[2])
    printData(responseYield.body, 'ul.yield', 'divYield')
    printData(responseDate.body, 'ul.date', 'lastDivDate')
  } catch (error) {
    console.error(error)
    updateUI(statuses[3])
  }
}

function updateUI (status) {
  $root.classList.remove(...statuses)
  $root.classList.add(status)
}

function printData (stocks, target, key) {
  const $ul = $root.querySelector(target)
  const $detection = $root.querySelector(target + ' ~ p.detection em')
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]
    if (i === 0) $detection.innerText = new Date(stock[key].now).toLocaleString()
    const $li = document.createElement('li')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = `/analisi/${encodeURI(stock.name?.toLowerCase().replace(/ /g, '-'))}?isin=${stock.isin}`
    const $span = document.createElement('span')
    $span.innerText = stock[key].value || ''
    if (key === 'divYield') $span.innerText = $span.innerText + '%'
    $li.appendChild($a)
    $li.appendChild($span)
    $ul.appendChild($li)
  }
}

$root = document.getElementById('dividens')
statuses = ['idle', 'loading', 'success', 'error']
updateUI(statuses[1])
callTheApi()
