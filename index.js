// Import our express package
const express = require('express')

const  app = express()
const port = 3000

app.set('view engine', 'ejs')
app.set('views', './templates/views')

const currentUser = {
    loggedIn: true
}

const protectedRoutes = [
    '/about',
    '/contact'
]

// middleware for date and time
app.use((req, res, next) => {
    console.log(`Request made to ${req.path} at ${new Date()}`)

    if (!currentUser.loggedIn) {
        if (protectedRoutes.includes(req.path)) {
            return res.redirect('/')
        }
    }

    next()
})

app.get("/", (req, res) => {
    console.log('IN HOME ROUTE')

    const user = {
        id: 1,
        username: 'Ccox',
        email: 'ccox@breadbox.com',
        favoriteBread: 'rye', 
        posts: [
            {
                id: 1,
                body: "Man, I love bread"
            },
            {
                id: 2,
                body: "Man, I love bread 2"
            }

        ],
        cart: [
            {
                id: 1,
                name: "Doughnuts",
                description: "1 dozen doughnuts from Stamford Donuts for $5"
            }

        ]
    }
    
    const data = {
        user: user
    }

    res.render('home', data)
})

app.get("/about", (req, res) => {
    res.send('About')
})
app.get("/contact", (req, res) => {
    res.send('Contact')
})
app.get("/blog", (req, res) => {
    res.send('Blog')
})

const users = [
    {
        id: 2,
        username: 'AKibbel',
        email: 'amanda@breadbox.com',
        favoriteBread: 'brioche', 
        posts: [
            {
                id: 3,
                body: "Brioche Doughnuts are the best!"
            },
            {
                id: 4,
                body: "Making bread is time consuming"
            }

        ],
        cart: [
            {
                id: 2,
                name: "Bagels",
                description: "1 dozen bagels from Glimmer's Bagels for $5"
            }

        ]
    },
    {
        id: 3,
        username: 'DylCox',
        email: 'Dylan@breadbox.com',
        favoriteBread: 'ciabatta', 
        posts: [
            {
                id: 5,
                body: "Ciabatta is hard to spell"
            },
            {
                id: 6,
                body: "I started baking bread during the pandemic"
            }

        ],
        cart: [
            {
                id: 3,
                name: "Ciabatta Rolls",
                description: "1 dozen Ciabatta rolls from ABC Bakery for $6"
            }

        ]
    }
]

app.get('/users', (req, res) => {
    res.send(users)
} )

function searchUser(id) {
    for (const user of users) {
        if (user.id == id) {
            return user
        }
    }
}

app.get('/user/:id', (req, res) => {
    const id = req.params.id 

    for (const user of users) {
        if (user.id == id) {
            return res.send(user)
        }
    }
    res.status(404).send('404 Not Found')
})

/* Make a route that accepts two parameters!!! */
app.get('/user/:id/:key', (req, res) => {
    const id = req.params.id
    const key = req.params.key

    const user = searchUser(id)

    if (user) {
        const value = user[key]

        if (value) {
            return res.send(value)
        } else {
            return res.status(404).send(`Key ${key} not found for user ${user.username}`)
        }
    }

    res.status(404).send('404 User Not Found')
})


// CALCULATOR

app.get('/calculator/:num1/:num2', (req, res) => {
    const num1 = parseInt(req.params.num1)
    const num2 = parseInt(req.params.num2)

    res.send({
        addition: num1 + num2,
        subtraction: num1 - num2,
        multiplication: num1 * num2,
        division: num1 / num2,
        exponential: num1 ** num2
    })
})
/* 
* Create a route to check if a product is in a user's cart
* send back either true or false
*/
app.get('/users/:uid/in-cart/:productName', (req, res) => {
    const id = req.params.uid
    const productName = req.params.productName

    const user = searchUser(id)

    if (user) {
        const cart = user.cart
        
        for (const item of cart) {
            if (item.name.toLowerCase() === productName.toLowerCase()) {
                return res.send(true)
            }
        }

        return res.send(false)
    }

    res.status(404).send('404 User Not Found')
})

app.listen(port, () => {
    console.log(`Express is running on port ${port}`)
})
