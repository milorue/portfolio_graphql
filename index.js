const {ApolloServer, gql} = require('apollo-server')

const fs = require('fs')
const typeDefs = fs.readFileSync('schema.graphql', {encoding: 'utf-8'})


// mock database for now

const education = {
    collegename: "Ithaca College",
    degree: "Bachelor of Arts",
    major: "Computer Science",
    minor: "Political Science",
    gpa: "3.5",
    awards: ["Dean's List Fall 2016, Spring 2017", "Leadership Scholar"],
    city: "Ithaca",
    state: "New York"
}

const people = [
    {
        firstName: "Milo",
        lastName: "Rue",
        birthday: {
            day: 6,
            month: 6,
            year: 1998,
            dateString: "06/06/1998"
        },
        age: 0,
        email: "milorue@gmail.com"

    }
]

const links = {
        github: "https://github.com/milorue",
        linkedin: "https://www.linkedin.com/in/milorue/",
        devpost: "https://devpost.com/MiloRue?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav",
        instagram: "https://www.instagram.com/milorue/",
        twitter: "",
        resume: "https://docdro.id/8QYRGHa",
}

const skills = [
    {
        name: "React.js",
        type: "WEB",
        yearsofexperience: 3,
        tags: ["Framework", "Web", "Frontend"],
        projects: [
            {

            },
        ],
        note: "React is my favorite framework that I use on a regular basis, the simplicity or writing React code alongside the fact that it has an amazing open-source community is more than enough for me to continue learning and improving.",
        color: '#00d8ff'
    },
    {
        name: "Node.js",
        type: "WEB",
        yearsofexperience: 2 ,
        tags: ["Web", "Backend", "Tool", "Framework"]
    },
    {
        name: "Express.js",
        type: "WEB",
        yearsofexperience: 1,
        tags: ["Web", "Backend", "Library"]
    },
    {
        name: "GraphQL",
        type: "WEB",
        yearsofexperience: 1,
        tags: ["API", "Web", "Backend", "Database"]
    },
    {
        name: "Apollo",
        type: "WEB",
        yearsofexperience: 1,
        tags: ["Tool", "Framework", "Backend", "Database", "Web"]
    },
    {
        name: "HTML",
        type: "WEB",
        yearsofexperience: 6,
        tags: ["Web", "Frontend", "Framework", "Language"]
    },
    {
        name: "CSS",
        type: "WEB",
        yearsofexperience: 6,
        tags: ["Web", "Frontend", "Framework", "Language"]
    },
    {
        name: "MongoDB",
        type: "DATABASE",
        yearsofexperience: 2,
        tags: ["Web", "Backend", "Database", "Deployment"]
    },
    {
        name: "MySQL",
        type: "DATABASE",
        yearsofexperience: 2,
        tags: ["Web", "Database", "Deployment"]
    },
    {
        name: "PostgreSQL",
        type: "DATABASE",
        yearsofexperience: 2,
        tags: ["Web", "Database", "Deployment"]
    },
    {
        name: "React Native",
        type: "MOBILE",
        yearsofexperience: 3,
        tags: ["Web", "Mobile", "Native", "Frontend"]
    },
    {
        name: "Firebase/Firestore",
        type: "MOBILE",
        yearsofexperience: 1,
        tags: ["Web", "Database", "Deployment", "Mobile"]
    },
    {
        name: "MongoDB Stitch/Realms",
        type: "MOBILE",
        yearsofexperience: 3,
        tags: ["Web", "Database", "Deployment", "Mobile", "Backend", "Admin"]
    },
    {
        name: "Javascript",
        type: "LANGUAGE",
        yearsofexperience: 2,
        tags: ["Web", "Language", "OOP"]
    },
    {
        name: "C++",
        type: "LANGUAGE",
        yearsofexperience: 3,
        tags: ["Embedded", "Low Level", "MIL STD", "Language", "OOP"]
    },
    {
        name: "C",
        type: "LANGUAGE",
        yearsofexperience: 2,
        tags: ["Embedded", "Low Level", "Bit Manipulation", "MIL STD"]
    },
    {
        name: "Python",
        type: "LANGUAGE",
        yearsofexperience: 5,
        tags: ["Web", "Data", "Prototyping", "Internal Tools", "Language", "OOP"]
    },
    {
        name: "Java",
        type: "LANGUAGE",
        yearsofexperience: 2,
        tags: ["Web", "Language", "OOP"]
    },
    {
        name: "R",
        type: "LANGUAGE",
        yearsofexperience: 1,
        tags: ["Data"]
    },
    {
        name: "Bash",
        type: "LANGUAGE",
        yearsofexperience: 3,
        tags: ["System Admin"]
    },
    {
        name: "Git",
        type: "TOOL",
        yearsofexperience: 4,
        tags: ["Web", "Version Control"]
    },
    {
        name: "JIRA (Scrum/Agile)",
        type: "TOOL",
        yearsofexperience: 2,
        tags: ["Agile/Scrum"]
    },
    {
        name: "Linux",
        type: "TOOL",
        yearsofexperience: 8,
        tags: ["Operating System", "System Admin"]
    },
    {
        name: "Virtual Box",
        type: "TOOL",
        yearsofexperience: 2,
        tags: ["Virtual Machines", "Hardware and Kernel Compiling"]
    },
    {
        name: "Remote Work",
        type: "SKILL",
        yearsofexperience: 2,
        tags: ["Work Style"]
    },
    {
        name: "SCRUM",
        type: "SKILL",
        yearsofexperience: 2,
        tags: ["Agile/Scrum", "Management", "Collaboration"]
    },
    {
        name: "ADA Compliance",
        type: "SKILL",
        yearsofexperience: 2,
        tags: ["Americans with Disabilities"]
    }


]

const projects = [
    {
        name: "CARA",
        skills: ["React.js"]
    }
]

for(let x = 0; x<people.length; x++){
    people[x].age = calculateAge(people[x].birthday.year, people[x].birthday.month-1, people[x].birthday.day)
}

function calculateAge(birthday){
    let total = Date.parse(new Date()) - Date.parse(birthday)
    let ageExact = total/3.154e+10
    let age = Math.floor(ageExact)
    return age
}



const resolvers = {
    Query:{
        milo(){
            return people[0]
        },
        specificskills: (parent, args) => {
            let specSkills = []

            for(let x = 0; x<skills.length; x++){
                if(skills[x].type === args.skillType){
                    specSkills.push(skills[x])
                }
                
            }

            console.log(specSkills)

            return specSkills
        },
        skills(){
            return skills 
        },
        links(){
            return links
        },
        education(){
            return education
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers, engine: {
    reportSchema: true, introspection: true, playground: true,
}})

server.listen({port: process.env.PORT || 4000}).then(() =>{
    console.log("🚀 Server ready")
})