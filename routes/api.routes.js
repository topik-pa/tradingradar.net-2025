const ctrl = require('../controllers/api.controller.js')
const router = require('express').Router()

module.exports = app => {

  const apiUrls = [
    '/stocks/perf1M',
    '/stocks/perf1Y',
    '/stocks/lastJudgment',
    '/stocks/lastDivDate',
    '/stocks/divYield',
    '/custom',
    '/info/:isin',
    '/analysis/:isin',
    '/news/:isin'
  ]

  // apiUrls
  router.get(apiUrls, ctrl.get)

  app.use('/api', router)
}
