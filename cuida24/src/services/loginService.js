import cuida24 from '@/services/cuida24'

export default {
    getToken(credencials) {
        //console.log("tentativa de enviar o pedido com " + credencials.username + credencials.password)
        return cuida24.post(`token/`, {
            //username: credencials.username,
            //password: credencials.password
            username: "admin",
            password: "admin"
        })
        .then(response => response.data)
    },
    refreshToken(refreshToken) {
        return cuida24.post(`token/refresh/`, {
            reshesh: refreshToken
        })
        .then(response => response.data)
    }
}