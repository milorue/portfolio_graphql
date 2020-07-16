const {ApolloServer, gql} = require('apollo-server')

const fs = require('fs')
const typeDefs = fs.readFileSync('schema.graphql', {encoding: 'utf-8'})


// mock database for now

const projects = [
    {
        name: "CARA",
        description: "A mobile application and platform aimed at providing accessible mapping and related services to college campuses and beyond",
        used: ["React.js", "React Native", "Node.js", "Google Maps API" , "Google Places API", "Open Street Maps API", "MongoDB", "GraphQL", "Apollo", "PostgreSQL", "Expo CLI", "Javascript"],
        links: ["https://cara-api.herokuapp.com/", "https://cara-docs.herokuapp.com/"],
        repos: ["https://github.com/milorue/cara_v2", "https://github.com/milorue/cara_v2"],
        note: "Has gone through multiple revisions and full redesigns, currently working on v3",
        image: "https://i.ibb.co/NYHwG56/logo.png"
    },
    {
        name: "Portfolio",
        description: "A React, NodeJS, and GraphQL powered portfolio website that also acts as a platform for generating resumes, creating github repositories, and more. Includes an admin to add, drop, modify all aspects of the website without having to edit the code, create blog posts, etc.",
        used: ["React.js", "Node.js", "Apollo", "GraphQL", "MongoDB", "MongoDBRealms", "HTML", "CSS", "Heroku", "Javascript"],
        links: ["milo-rue.com", "milo-rue.herokuapp.com"],
        repos: ["https://github.com/milorue/portfolio", "https://github.com/milorue/portfolio_graphql"],
        note: "I built this updated portfolio as a showcase of my skills as well as a platform for my professional career and to centralize the data about my career into an api to be used in resume generators and other future projects.",
        image: "https://oceanwp.org/wp-content/uploads/2017/07/portfolio-image.png"
    },
    {
        name: "PlowIt/PlowMe",
        description: "A snow plow cleared roads and route reporting application built during a 24hr HackBU Hackathon with 155 participants and $7,400 in prizes",
        used: ["React Native", "Node.js", "MongoDB", "GraphQL", "AWS EC2", "Trimble Maps Direction API", "Google Maps API (React Native Maps)", "Expo CLI", "Javascript"],
        links: ["https://expo.io/@mrue/plowit", "https://devpost.com/software/plowme-yj582z"],
        repos: ["https://github.com/milorue/plowme"],
        note: "I built this during a 24 hr hackathon where I won 2nd place overall and Best Mobile & Logistics Hack in a hackathon of 155 participants and the original name was 'PlowMe' but I change it to 'PlowIt' after coming out of a sleepy stupor and realizing that was a bit odd and my logos that I had made backed up the oddness of the name (I redesigned those too)",
        image: "https://raw.githubusercontent.com/milorue/plowme/master/assets/appIcon.png"
    },
    {
        name: "Gronk the Discord Bot",
        description: "A discord bot built in Node.js to do funny things and provide information",
        used: ["Node.js", "Discord.js", "AWS EC2", "Discord API", "RiotGames API", "Javascript"],
        links: ["https://github.com/milorue/discord_bot"],
        repos: ["https://github.com/milorue/discord_bot"],
        note: "I also built a version of this bot that checked for hate speech using TensorFlow but it wasn't the greatest at recognizing toxic behavior on the server and became quite a joke among the members",
        image: "https://i.ibb.co/jWDXXmg/kronk.jpg"
    },
    {
        name: "Twitch Plays League of Legends",
        description: "A Node.js Server to accept twitch donations and other twitch actions (subscriptions, follows, etc) to trigger abilities and other in-game actions",
        used: ["Node.js", "Express.js", "StreamLabs API", "WebSockets", "StreamLabs WebSocket API", "Robot.js", "RiotGames API", "Javascript"],
        links: ["https://github.com/milorue/twitch_plays_league"],
        repos: ["https://github.com/milorue/twitch_plays_league"],
        note: "This project is actively in development as a fun part of my twitch stream and hopefully more streamers.",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/Twitch%20Plays.jpg"
    },
    {
        name: "AI plays Pacman",
        description: "An OOP implementation of Pacman and various AI types to play the game as both Pacman and as the Ghosts",
        used: ["Python", "Tkinter"],
        links: ["https://github.com/milorue/pacman_intelligent_agents"],
        repos: ["https://github.com/milorue/pacman_intelligent_agents"],
        note: "I built this with Gabe Pesco and Justin Moczynksi for my intelligent systems class and explores different ai approaches and improves on an existing implementation of pacman from freegames",
        image: "https://storage.googleapis.com/jackarendt-website/projects/pacman.png"
    },
    {
        name: "C++ Data Structure Performance Analysis",
        description: "Splay Tree, RedBlack Tree, Hashtables, and Trie performance analysis in C++",
        used: ["C++", "LaTEX"],
        links: ["https://www.overleaf.com/read/ytmnctgvqgsj"],
        repos: ["https://github.com/milorue/aos_proj_2", "https://github.com/milorue/aos_proj1"],
        note: "Performed insertion, deletion, and lookup analysis on different sized data sets",
        image: "data:image/png;base64,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",
    },
    {
        name: "Solidity Blockchain ToDo Application",
        description: "A todo application pwoered by Ethereum using a local Ganache blockchain implementation",
        used: ["Solidity", "Ethereum", "Ganache", "Javascript", "HTML"],
        links: ["https://github.com/milorue/eth_bc_todo_app"],
        repos: ["https://github.com/milorue/eth_bc_todo_app"],
        note: "This was an exploration of blockchain technologies and learning Solidity for the first time, I also learned a lot about the actual implementation of Ethereum and gave a presentation on their white paper.",
        image: "https://i.pinimg.com/originals/03/60/ba/0360bafe07fdd50bdd325bac4e1afb3f.png",
    },
    {
        name: "Game Masters Friend",
        description: "A Dungeons and Dragons Campaign and Stat Manager written in Java",
        used: ["Java", "CircleCI", "SCRUM", "Waffle.io"],
        links: ["https://github.com/milorue/Game_Masters_Friend"],
        repos: ["https://github.com/milorue/Game_Masters_Friend"],
        note: "My final group project for my software engineering class, we built diagrams and ran the project as scrum with 3 sprints over the course of development.",
        image: "https://cdn.shopify.com/s/files/1/0077/0270/8279/products/DnDAmpersand_hot_pink.jpg?v=1567120972",
    },
    {
        name: "C++ Ranked System",
        description: "A Ranked MMR and Queueing system for competitive Rock Paper Scissors",
        used: ["C++", "C"],
        links: ["https://github.com/milorue/cpp_queueing_ranking"],
        repos: ["https://github.com/milorue/cpp_queueing_ranking"],
        note: "This was one of my first ever group programming projects",
        image: "https://firstblood.io/pages/wp-content/uploads/2019/03/dota2medals.jpg",
    },
    {
        name: "LoL Data Grabber",
        description: "A python wrapper for the Riot Games API",
        used: ["Python", "RiotGames API"],
        links: ["https://github.com/milorue/LoL_Account_Data_Grabber"],
        repos: ["https://github.com/milorue/LoL_Account_Data_Grabber"],
        note: "Some of my first endeavors into fetching external api's",
        image: "https://pngimage.net/wp-content/uploads/2018/06/riot-png-.png",
    }
    

]

const education = {
    collegename: "Ithaca College",
    degree: "Bachelor of Arts",
    major: "Computer Science",
    minor: "Political Science",
    gpa: "3.5",
    awards: ["Dean's List Fall 2016, Spring 2017", "Leadership Scholar", "Winner of Best Mobile, Logistical, and 2nd place Overall @ HackBU"],
    city: "Ithaca",
    state: "New York"
}

const jobs = [
    {
        name: "Software Engineer I",
        company: "Prescient Edge",
        location: {
            city: "Laurel",
            state: "Maryland"
        },
        startDate: {
            day: 15,
            month: 8,
            year: 2019,
            dateString: "08/05/2019"
        },
        endDate: {
            day: 0,
            month: 0,
            year: 0,
            dateString: "Current"
        },
        responsibilities: [
            "Building embedded systems for USCG Minotaur in C++, C, and Python",
            "Designing and developing short term and long term business goals for the project and company",
            "Developing internal tolling to leverage data from MongoDB towards the bus controller and mission processors in Node.js",
            "Migrating and converting an existing aircraft bus controller to 64 bit software and new hardware architecture",
            "Developing web applications in React for internal use and to improve my own and others productivity"
        ]
    },
    {
        name: "React-Native Mobile Developer",
        company: "Ithaca College",
        location: {
            city: "Ithaca",
            state: "New York"
        },
        startDate: {
            day: 1,
            month: 6,
            year: 2019,
            dateString: "06/01/2019"
        },
        endDate: {
            day: 1,
            month: 9,
            year: 2019,
            dateString: "09/01/2019"
        },
        responsibilities: [
            "Solo developed a mobility assistance and routing application for people within the Ithaca College community.",
            "Created a mobile frontend designed to be easier to use for people with motor disabilities based on user testing results.",
            "Interfaced with geographic data to create reliable systems to route users from place to place. Utilized geographic libraries like react-native-maps, mapbox-gl, and Google & OpenStreetMap API’s.",
            "Created simple backend and database systems using NodeJS, Express and MongoDB"
        ]
    },
    {
        name: "Fullstack Mobile & Web Developer",
        company: "Contract/Freelance",
        location: {
            city: "Annapolis",
            state: "Maryland"
        },
        startDate: {
            day: 12,
            month: 1,
            year: 2019,
            dateString: "01/12/2019"
        },
        endDate: {
            day: 2,
            month: 5,
            year: 2020,
            dateString: "05/02/2020"
        },
        responsibilities: [
            "Built out full-stack capable applications for small businesses in my hometown of Annapolis, MD that are used internally on both mobile and web environments",
            "Worked with existing databases and backend infrastructure to construct mobile application extensions of existing online and internal tolling presences.",
            "Helped create and curate a companies leap to a fully online presence, payment system, internal messaging, and other tools which have generated over $100,000 in revenue"
        ]
    }
]

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
        twitter: "https://twitter.com/milo_rue",
        resume: "https://docdro.id/LePG3ZX",
}

const skills = [
    {
        name: "React.js",
        type: "WEB",
        yearsofexperience: 3,
        tags: ["Framework", "Web", "Frontend"],
        note: "React is my favorite framework that I use on a regular basis, the simplicity or writing React code alongside the fact that it has an amazing open-source community is more than enough for me to continue learning and improving.",
    },
    {
        name: "Javascript",
        type: "WEB",
        yearsofexperience: 4,
        tags: ["Language", "Web"],
        note: "I used vanilla javascript for about a year before I discovered React and NodeJS"
    },
    {
        name: "Node.js",
        type: "WEB",
        yearsofexperience: 3 ,
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
        },
        birthday(){
            return people[0].birthday
        },
        jobs(){
            return jobs
        },
        projects(){
            return projects
        },
        specificProjects: (parent, args) => {
            let specProjects = []

            for(let x = 0; x<projects.length; x++){
                for(let y = 0; y<args.uses.length; y++){
                    if(projects[x].used.includes(args.uses[y])){
                        specProjects.push(projects[x])
                        break
                    }
                }
            }

            return specProjects


        }
    }
}

const server = new ApolloServer({typeDefs, resolvers, engine: {
    reportSchema: true
}, introspection: true, playground: true})

server.listen({port: process.env.PORT || 4000}).then(() =>{
    console.log("🚀 Server ready")
})