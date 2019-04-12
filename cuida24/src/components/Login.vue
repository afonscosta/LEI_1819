<template>
    <div class="login">
        <form @submit.prevent='login'>
            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" v-model="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" v-model="password" id="exampleInputPassword1" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        login() {
            this.$store.dispatch('login/getToken', {
                username: this.email,
                password: this.password,
            });
            console.log("teste de receção token " + this.$store.state.login.accesstoken)
        }
    }
}
</script>

<style scoped>
    form {
        max-width: 500px;
        margin: auto;
    }
</style>
