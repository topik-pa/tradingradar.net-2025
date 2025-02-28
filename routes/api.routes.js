const ctrl = require('../controllers/api.controller.js')
const router = require('express').Router()

module.exports = app => {

  const apiUrls = [
    '/stocks/perf1M',
    '/stocks/perf1Y',
    '/stocks/lastJudgment',
    '/stocks/lastDivDate',
    '/stocks/divYield',
    '/stocks/rating',
    '/stocks/mfRanking',
    '/custom',
    '/info/:isin',
    '/analysis/:isin',
    '/news/:isin'
  ]

  // api urls
  router.get(apiUrls, ctrl.get)

  app.use('/api', router)
}
