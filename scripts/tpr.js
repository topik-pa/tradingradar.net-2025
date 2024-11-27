import proxyFetch from '../../scripts/proxyFetch.js'
let $root; let statuses; const url = '/api/stocks/lastJudgment/?order=desc'

async function callTheApi () {
  try {
    const response = await proxyFetch(url)
    updateUI(statuses[2])
    printData(response.body, 'table')
  } catch (error) {
    console.error(error)
    updateUI(statuses[3])
  }
}

function updateUI (status) {
  $root.classList.remove(...statuses)
  $root.classList.add(status)
}

function printData (stocks, target) {
  const $table = $root.querySelector(target)
  const $tbody = $table.querySelector('tbody')
  const $detection = $root.querySelector(target + ' ~ p.detection em')
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]
    if (i === 0) $detection.innerText = new Date(stock.lastJudgment.now).toLocaleString()
    const $tr = document.createElement('tr')
    const $td1 = document.createElement('td')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = `/analisi/${encodeURI(stock.name?.toLowerCase().replace(/ /g, '-'))}?isin=${stock.isin}`
    $td1.appendChild($a)
    $tr.appendChild($td1)

    const $td2 = document.createElement('td')
    $td2.innerText = stock.lastJudgment?.value[0]
    $tr.appendChild($td2)

    const $td3 = document.createElement('td')
    $td3.innerText = stock.lastJudgment?.value[1]
    $tr.appendChild($td3)

    const $td4 = document.createElement('td')
    $td4.innerText = stock.lastJudgment?.value[2]
    $tr.appendChild($td4)

    const $td5 = document.createElement('td')
    $td5.innerText = stock.lastJudgment?.value[3]
    $tr.appendChild($td5)

    $tbody.appendChild($tr)
  }
}

$root = document.getElementById('target-price')
statuses = ['idle', 'loading', 'success', 'error']
updateUI(statuses[1])
callTheApi()
