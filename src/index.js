import debounce from 'lodash.debounce'

export const CANCEL = 'redux-debounce/CANCEL'
export const FLUSH = 'redux-debounce/FLUSH'

function map (debounced, action, method) {
  if (action.payload && action.payload.type) {
    let types = action.payload.type
    if (!Array.isArray(types)) {
      types = [types]
    }
    Object.keys(debounced)
      .filter((t) => types.includes(t))
      .forEach((t) => debounced[t][method]())
    return
  }
  Object.keys(debounced).forEach((t) => debounced[t][method]())
  return
}

export default function middleware (defaultWait = 300, defaultThrottleOption = {}) {
  const debounced = {}
  return (store) => (next) => (action) => {
    if (action.type === CANCEL) {
      map(debounced, action, 'cancel')
      return next(action)
    }

    if (action.type === FLUSH) {
      map(debounced, action, 'flush')
      return next(action)
    }

    const shouldDebounce = (action.meta || {}).debounce

    // check if we don't need to debounce the action
    if (!shouldDebounce) {
      return next(action)
    }

    if (debounced[action.type]) { // if it's a action which was throttled already
      return debounced[action.type](action)
    }

    let wait = defaultWait
    let options = defaultThrottleOption

    if (!isNaN(shouldDebounce) && shouldDebounce !== true) {
      wait = shouldDebounce
    } else if (typeof shouldDebounce === 'object') {
      wait = shouldDebounce.wait || defaultWait
      options = {...defaultThrottleOption, ...shouldDebounce}
    }

    debounced[action.type] = debounce(next, wait, options)

    return debounced[action.type](action)
  }
}
