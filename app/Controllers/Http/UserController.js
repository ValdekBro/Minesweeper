'use strict'
const User = use('App/Models/User');


class UserController {
    async create({ request, auth, response}) {
        const user = await User.create(request.only(['username','email','password']));
        console.log(user);

        console.log(await auth.login(user));
        return response.redirect('/');
    }

    async login({ request, auth, session, response}) {
        const { email, password } = request.all();
        try {
            console.log(await auth.attempt(email, password));
            return response.redirect('/');
        } catch (error) {
            session.flash({message: 'These credentials do not work.'})
            return response.redirect('/login');
        }
    }

    async logout({ auth, response }) {
        console.log(await auth.logout());
        return response.redirect('/');
    }
}

module.exports = UserController
