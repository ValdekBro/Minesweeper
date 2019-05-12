'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Score = use('App/Models/Score');


Route.on    ('/').render('index')

Route.on    ('/signup').render('auth.signup');
Route.on    ('/login').render('auth.login');

Route.post  ('/signup', 'UserController.create')
    .validator('CreateUser')
    .as('CreateUser');

Route.post  ('/login', 'UserController.login')
    .validator('LoginUser')
    .as('LoginUser');

Route.get   ('/logout', 'UserController.logout');

Route.get   ('/user_score', 'ScoreController.userScore');

Route.on   ('/scores').render('best-players');
// Route.post  ('/user_score', 'ScoreController.create')
//     .validator('CreateDcore')
//     .as('CreateScore');

// Route.get   ('/user_score/delete/:id', 'ScoreController.delete');
// Route.get   ('/score/update/:id', 'ScoreController.updateView');
// Route.post  ('/score/update/:id', 'ScoreController.update');

Route.post   ('/ajax/add_score', 'ScoreController.create');
Route.get    ('/ajax/scores', 'ScoreController.getScores'); 
