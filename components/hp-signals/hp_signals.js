const hp_signals = {
  init: async () => {
    const today = new Date(Date.now()).toLocaleDateString('it-IT')
    document.getElementById('today').innerText = today
  }
}

export default hp_signals
