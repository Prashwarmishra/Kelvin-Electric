
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
    },
    jwt_secret: 'JdvlUriHObDQpOBW8QYsB1WMV51unUBZ',
    google_client_id: '438150736898-8c9eb09t8f55u94sadskoidibnsds7nb.apps.googleusercontent.com',
    google_client_secret: 'wxM8ToCrdVcIlLZXd7UiZMVH',
    google_callback_url: 'http://localhost:8000/api/v1/user/auth/google/callback',
    session_secret: '5ZL0AZtbj9lwqKWM1ry4jZwanRWrcJNg',
}

const production = {
    name: 'production'
}


module.exports = development;