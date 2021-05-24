
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
    google_client_id: '393136217445-4vahqshjactqrd0opbs64tkgq6qoafjp.apps.googleusercontent.com',
    google_client_secret: 'EZkyyvxTTzfkoQ-HS4E3aycn',
    google_callback_url: 'http://localhost:8000/api/v1/user/auth/google/callback',
    session_secret: '5ZL0AZtbj9lwqKWM1ry4jZwanRWrcJNg',
    razorpay_key: 'rzp_test_83c16uaIQBUCGK',
    razorpay_secret: 'TRAQJbbPmTZJL9SLvOd5qQFH',
    razorpay_webhook_secret: 'nXQrTVscGJxP1W1sUUjSbWs64T8pjQkg'
}

const production = {
    name: 'production'
}


module.exports = development;