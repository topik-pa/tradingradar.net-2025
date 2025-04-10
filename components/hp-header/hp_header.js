const hp_header = {
  init: async () => {
    const today = new Date(Date.now()).toLocaleDateString('it-IT')
    document.getElementById('today').innerText = today
  }
}

export default hp_header
