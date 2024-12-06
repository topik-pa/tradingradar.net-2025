async function proxyFetch (path = '', data = {}, method = 'GET', headers = {}) {
  const obj = {}
  const params = {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }
  // Include JWT token if found
  // const refreshJWT = undefined
  // if (refreshJWT) {
  //  params.headers.authorization = `Bearer ${refreshJWT}`
  // }

  // Add data if needed
  if (['post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
    params.body = JSON.stringify(data)
  }
  // Start communication
  await fetch(path, params)
    .then(resp => {
      obj.status = resp.status
      return resp.json()
    })
    .then(data => { obj.body = data })
    .catch((err) => { console.error(err) }) // TODO: maybe a better error management?
  return obj
}

export default proxyFetch
