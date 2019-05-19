'use strict'
// crypto ja vem com o node acima da versao 10
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
const moment = require('moment')
class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findBy('email', email)

      if (!user) {
        return response.status(401).send({
          error: { message: 'O e-mail informado não foi localizado.' }
        })
      }

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message =>
          message
            .to(user.email)
            .from('bins@dbins.com.br', 'Desafio4')
            .subject('Recuperação de senha')
      )
    } catch (err) {
      return response.status(err).send({
        error: {
          message: 'Houve um problema. Por favor verifique o e-mail informado'
        }
      })
    }
  }

  async update ({ request, response }) {
    try {
      const { password, token } = request.all()
      const user = await User.findBy('token', token)

      if (!user) {
        return response.status(401).send({
          error: { message: 'O token informado não foi localizado.' }
        })
      }

      const tokenExpired = moment()
        .subtract(2, 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({
          error: { message: 'O token de recuperação informado está expirado.' }
        })
      }

      user.token = null
      user.token_created_at = null
      user.password = password
      await user.save()
    } catch (err) {
      return response.status(err).send({
        error: { message: 'Houve um problema ao resetar sua senha' }
      })
    }
  }
}

module.exports = ForgotPasswordController
