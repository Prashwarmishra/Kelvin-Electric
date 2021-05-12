
const development = {
    name: 'development',
    db_path: 'kelvin_electric_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: 'false',
        auth: {
            user: 'product.kelvinelectric@gmail.com',
            pass: 'mern@kelvin',
        }
    }
}

const production = {
    name: 'production'
}


module.exports = development;