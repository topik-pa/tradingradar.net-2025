import proxyFetch from '../../scripts/proxyFetch.js'
let deletingData

const STATUS = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error'
}
const LOCAL_DATA_KEY = 'trnetLocalData'
const TIMEOUT_LOCAL_DATA = 1000 * 60 * 10

const getStockHref = (name, isin) => {
  return `/analisi/${encodeURI(name?.toLowerCase().replace(/ /g, '-'))}?isin=${isin}`
}

const updateUI = (elems, current) => {
  elems.forEach((elem) => {
    elem.classList.remove(...Object.values(STATUS))
    elem.classList.add(STATUS[current])
  })
}

const getStocks = async ($root, key, url) => {
  updateUI($root, 'loading')
  let stocks = getLocalData(key)
  if(stocks.length === 0) {
    try {
      const remote = await proxyFetch(url)
      stocks = remote.body || []
      updateLocalData(key, stocks)
    } catch (error) {
      console.error(error)
      updateUI($root, 'error')
      return
    }
  }
  updateUI($root, 'success')
  return stocks
}

const getLocalData = (key) => {
  const localData = JSON.parse(localStorage.getItem(LOCAL_DATA_KEY)) || {}
  clearTimeout(deletingData)
  postponedDeleteLocalData()
  return localData[key] || []
}
const updateLocalData = (key, data) => {
  const localData = JSON.parse(localStorage.getItem(LOCAL_DATA_KEY)) || {}
  localData[key] = data
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(localData))
}
const postponedDeleteLocalData = () => {
  deletingData = setTimeout(() => {
    localStorage.removeItem(LOCAL_DATA_KEY)
  }, TIMEOUT_LOCAL_DATA)
}

export { getStocks, getStockHref, getLocalData }
