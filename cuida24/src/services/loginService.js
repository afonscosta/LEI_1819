import cuida24 from '@/services/cuida24'

export default {
  getToken (credencials) {
    console.log('tentativa de enviar o pedido com ' + credencials.username + credencials.password)
    return cuida24.post(`token/`, {
      username: credencials.username,
      password: credencials.password
      // username: 'admin',
      // password: 'admin'
    }).then(response => response.data)
      .catch((error) => {
        alert(error.message)
      })
  }
}
