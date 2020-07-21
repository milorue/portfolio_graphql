const {Stitch, AnonymousCredential, UserPasswordCredential, RemoteMongoClient, UserPasswordAuthProviderClient} = require('mongodb-stitch-server-sdk')

class application{
    constructor(appId, database, service){
        this.appId = appId

        // initializes the app client for interacting with atlas
        this.client = Stitch.initializeDefaultAppClient(this.appId)

        // initializes mongodb client
        this.mongoClient = this.client.getServiceClient(RemoteMongoClient.factory, service)

        // initializes the correct database
        this.db = this.mongoClient.db(database)

        // logs any possible cached user out
        if(this.client.auth.isLoggedIn){
            this.client.auth.logout()
        }
    }

    async getCurrUser(){
        if(this.client.auth.isLoggedIn){
            return new Promise(resolve => {
                resolve(this.client.auth.user)
            })
        }
        else{
            return new Promise(resolve => {
                resolve(null)
            })
        }
    }

    async getUser(token){
        if(this.client.auth.isLoggedIn){

            if(token === this.client.auth.user.auth.activeUserAuthInfo.accessToken){
                return new Promise(resolve => {
                    resolve(this.client.auth.user)
                })
            }
            else{
                return new Promise(resolve => {
                    resolve(null) // resolves to null if no active user
                })
            }
            
        }
        else{
            return new Promise(resolve => {
                resolve(null) // resolves to null if no active user
            })
        }
    }

    async userLogout(token){
        if(this.client.auth.isLoggedIn){
            if(token === this.client.auth.user.auth.activeUserAuthInfo.accessToken){
                this.client.auth.logout()
                return new Promise(resolve => {
                    resolve(true)
                })
            }
            else{
                return new Promise(resolve => {
                    resolve(false)
                })
            }
            
        }
        else{
            return new Promise(resolve => {
                resolve(false)
            })
        }
    }

    async userLogin(email, password){
        const loginCredential = new UserPasswordCredential(email, password)
        const user = await this.client.auth.loginWithCredential(loginCredential).then(() => {
            return new Promise(resolve => {
                resolve(true) // login passed
            })
        })
        .catch((err) => {
            return new Promise(resolve => {
                resolve(false) // failure to login
            })
        })

        return new Promise(resolve =>{
            resolve(user)
        })   
    }

    async userRegister(email, password){
        const regClient = await this.client.auth.getProviderClient(UserPasswordAuthProviderClient.factory)
        // inits a registration service

        const success = await regClient.registerWithEmail(email, password).then(() => {
            return new Promise(resolve => {
                resolve(true) // if account created resolve to true
            })
        })
        .catch((err) => {
            return new Promise(resolve =>{
                resolve(false) // if account creation failed resolve to false
            })
        })

        return new Promise(resolve =>{
            resolve(success)
        })
    }
}

module.exports = application