require('dotenv').config()
const {Stitch, AnonymousCredential, UserPasswordCredential, RemoteMongoClient, UserPasswordAuthProviderClient} = require('mongodb-stitch-server-sdk')

class application{
    constructor(appId, database, service){
        this.appId = appId

        this.defaultId = "5f19df7882df4a7979cd4305"

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
                this.client.auth.logoutUserWithId(this.client.auth.user.id)
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

    async getArrayData(col){
        const session = await this.userLogin(process.env.DATA_USER, process.env.DATA_PASSWORD)
        const collection = this.db.collection(col)
        const data = collection.find({userId: this.defaultId})
        .asArray()
        .then(docs =>{
            return new Promise(resolve => {
                resolve(docs)
            })
        })
        .catch(err =>{
            console.log(err)
            return new Promise(resolve => {
                resolve([])
            })
        })
        const endSession = await this.getCurrUser()
        await this.client.auth.logoutUserWithId(endSession.id)
        return new Promise(resolve => {
            resolve(data)
        })
    }

    async getData(col){
        const session = await this.userLogin(process.env.DATA_USER, process.env.DATA_PASSWORD)
        const collection = this.db.collection(col)
        const data = collection.find({userId: this.defaultId})
        .then(docs =>{
            return new Promise(resolve => {
                resolve(docs)
            })
        })
        .catch(err =>{
            console.log(err)
            return new Promise(resolve => {
                resolve({})
            })
        })
        const endSession = await this.getCurrUser()
        await this.client.auth.logoutUserWithId(endSession.id)
        return new Promise(resolve => {
            resolve(data)
        })
    }

    // mutator methods
    async addProject(token, project){
        let user = await this.getUser(token)

        if(user !== null){
            project.userId = user.id
            const jobs = this.db.collection("projects")
            const createdJob = await jobs.insertOne(project)
            .then(() => {
                return new Promise(resolve => {
                    resolve(true)
                })
            })
            .catch((err) =>{
                console.log(err)
                return new Promise(resolve => {
                    resolve(false)
                })
            })
            return new Promise(resolve => {
                resolve(createdJob)
            })
        }
        else{
            return new Promise(resolve =>{
                resolve(false)
            })
        }
    }

    async addJob(token, job){
        let user = await this.getUser(token)

        if(user){
            job.userId = user.id
            const jobs = this.db.collection("jobs")
            const createdJob = await jobs.insertOne(job)
            .then(() => {
                return new Promise(resolve => {
                    resolve(true)
                })
            })
            .catch((err) =>{
                return new Promise(resolve => {
                    resolve(false)
                })
            })
            return new Promise(resolve => {
                resolve(createdJob)
            })
        }
        else{
            return new Promise(resolve =>{
                resolve(false)
            })
        }
    }
    async addSkill(token, skill){
        let user = await this.getUser(token)

        if(user){
            skill.userId = user.id
            const jobs = this.db.collection("skills")
            const createdJob = await jobs.insertOne(skill)
            .then(() => {
                return new Promise(resolve => {
                    resolve(true)
                })
            })
            .catch((err) =>{
                return new Promise(resolve => {
                    resolve(false)
                })
            })
            return new Promise(resolve => {
                resolve(createdJob)
            })
        }
        else{
            return new Promise(resolve =>{
                resolve(false)
            })
        }
    }

    async addData(token, data, collection){
        let user = await this.getUser(token)

        if(user){
            data.userId = user.id
            const jobs = this.db.collection(collection)
            const createdJob = await jobs.insertOne(data)
            .then(() => {
                return new Promise(resolve => {
                    resolve(true)
                })
            })
            .catch((err) =>{
                return new Promise(resolve => {
                    resolve(false)
                })
            })
            return new Promise(resolve => {
                resolve(createdJob)
            })
        }
        else{
            return new Promise(resolve =>{
                resolve(false)
            })
        }
    }

    async updateData(token, data, id, collection){
        let user = await this.getUser(token)
        if(user){
            const query = {"_id": id}
            const update = { "$set": {
                data
            }}
            const options = {"upsert": true}
            const dataUpdater = this.db.collection(collection)
            const dataUpdated = await dataUpdater.updateOne(query, update, options)
            .then(() => {
                return new Promise(resolve =>{
                    resolve(true)
                })
            })
            .catch((err) => {
                return new Promise(resolve => {
                    resolve(false)
                })
            })
        }
        else{
            return new Promise(resolve =>{
                resolve(false)
            })
        }
    }
}

module.exports = application