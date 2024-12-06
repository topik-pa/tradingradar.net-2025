let $root, $alphabet, $stocks, activeLetters

function manageAlphabetClicks () {
  const letters = $alphabet.querySelectorAll('span')
  Array.from(letters).forEach(($letter) => {
    if (!activeLetters.has($letter.innerText)) {
      $letter.classList.add('disabled')
    } else {
      $letter.addEventListener('click', () => {
        alphabetShowHideStocks($letter.innerText)
      })
    }
  })
}

function alphabetShowHideStocks (letter = 'A') {
  const stockList = $stocks.getElementsByClassName('stock')
  Array.from(stockList).forEach(($stock) => {
    activeLetters.add($stock.dataset.letter)
    if ($stock.dataset.letter.toUpperCase() === letter) {
      const $logo = $stock.querySelector('img')
      if (!$logo.dataset.status) {
        $logo.dataset.status = 'loaded'
        $logo.src = `/assets/images/stocks/${$stock.dataset.code}-min.png`
      }
      $stock.classList.remove('hide')
    } else {
      $stock.classList.add('hide')
    }
  })
}

const stocks = {
  init: () => {
    $root = document.getElementById('select_stock')
    $alphabet = $root.getElementsByClassName('alphabet')[0]
    $stocks = $root.getElementsByClassName('stocks')[0]
    activeLetters = new Set()
    alphabetShowHideStocks()
    manageAlphabetClicks()
  }
}

export default stocks
