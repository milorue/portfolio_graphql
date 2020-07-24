require('dotenv').config()
const {ApolloServer, gql} = require('apollo-server')

const fs = require('fs')
const typeDefs = fs.readFileSync('schema.graphql', {encoding: 'utf-8'})

const App = require('./application/application')

async function appInit(){
// mock database for now

    

    

    function calculateAge(birthday){
        let total = Date.parse(new Date()) - Date.parse(birthday)
        let ageExact = total/3.154e+10
        let age = Math.floor(ageExact)
        return age
    }

    const app = new App(process.env.APP_ID, "portfolio", process.env.APP_SERVICE)

    const resolvers = {
        Query:{
            async milo(){
                let people = await app.getArrayData("people")
                for(let x = 0; x<people.length; x++){
                    people[x].age = calculateAge(people[x].birthday.year, people[x].birthday.month-1, people[x].birthday.day)
                }
                return people[0]
            },
            async specificskills(parent, args){
                let specSkills = []
                let sSkills = await app.getArrayData('skills')

                for(let x = 0; x<sSkills.length; x++){
                    if(sSkills[x].type === args.skillType){
                        specSkills.push(sSkills[x])
                    }
                    
                }

                return specSkills
            },
            async skills(){
                let skills = await app.getArrayData("skills")
                return skills 
            },
            async links(){
                let links = await app.getData("links")
                return links
            },
            async education(){
                let education = await app.getData("education")
                return education
            },
            async birthday(){
                let person = await app.getArrayData("people")
                return person[0].birthday
            },
            async jobs(){
                let jobs = await app.getArrayData("jobs")
                return jobs
            },
            async projects(){
                let projects = await app.getArrayData("projects")
                return projects
            },
            async specificProjects(parent, args){
                let specProjects = []

                let sProjects = await app.getArrayData("projects")

                for(let x = 0; x<sProjects.length; x++){
                    for(let y = 0; y<args.uses.length; y++){
                        if(sProjects[x].used.includes(args.uses[y])){
                            specProjects.push(sProjects[x])
                            break
                        }
                    }
                }

                return specProjects


            },

            async logout(parent, args){
                let loggedOut = await app.userLogout(args.token)
                return loggedOut
            },
            async login(parent, args){
                let loginToken = {
                    token: "",
                    refreshToken: "",
                    login: false,
                    user: {
                        userId: "",
                        email: ""
                    }
                    
                }

                let accountLogin = await app.userLogin(args.email, args.password)
                if(accountLogin){
                    let user = await app.getCurrUser()
                    if(user !== null){
                        loginToken = {
                            token: user.auth.activeUserAuthInfo.accessToken,
                            refreshToken: user.auth.activeUserAuthInfo.refreshToken,
                            login: true,
                            user: {
                                userId: user.id,
                                email: user.profile.data.email,
                            }
                        }
                        return loginToken
                    }
                    else{
                        return loginToken
                    }
                }
                else{
                    return loginToken
                }
            },
            async getUser(parent, args){
                let gotUser = {
                    userId: "",
                    email: "",
                    admin: null,
                }

                let gotAccount = await app.getUser(args.token)
                if(gotAccount !== null){
                    gotUser = {
                        userId: gotAccount.id,
                        email: gotAccount.profile.data.email,
                        admin: false
                    }
                    return gotUser
                }
                else{
                    return gotUser
                }

            },
            
        },

        Mutation:{
            async createAccount(parent, args){
                if(args.creationToken === process.env.ACCOUNT_CREATION_KEY){
                    let account = await app.userRegister(args.email, args.password)
                    return account
                }
                else{
                    return false
                }
            },
            async addProject(parent, args){
                let addedProject = await app.addProject(args.token, args.project)
                return addedProject
            },
        }
    }

    const server = new ApolloServer({typeDefs, resolvers, engine: {
        reportSchema: true
    }, introspection: true, playground: true})

    server.listen({port: process.env.PORT || 4000}).then(() =>{
        console.log("🚀 Server ready")
    })
}

appInit()