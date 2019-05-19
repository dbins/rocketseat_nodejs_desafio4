'use strict'
// const Antl = use('Antl')
class Sessions {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      email: 'required|email',
      redirect_url: 'required|url'
    }
  }

  get messages () {
    return {
      'email.required': 'O e-mail deve ser preenchido.',
      'redirect_url.required': 'O link de redirecionamento deve ser preenchido.'
    }
    // return Antl.forLocale('pt').list('validation')
  }
}

module.exports = Sessions
