'use strict'
const Antl = use('Antl')
class Sessions {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      token: 'required',
      old_password: 'required',
      password: 'required|min:6|max:12|confirmed'
    }
  }

  get messages () {
    return Antl.forLocale('pt').list('validation')
  }
}

module.exports = Sessions
