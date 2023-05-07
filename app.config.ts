const localHost = false

const HOST_DOMAIN = import.meta.env.DEV && localHost
  ? ' http://localhost:1212'

  // ? Production Domain

  : 'http://194.32.76.82:9521'

const API_URL = `${HOST_DOMAIN}/api/Dashboard/`

export { API_URL, HOST_DOMAIN }

