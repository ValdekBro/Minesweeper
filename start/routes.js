'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Score = use('App/Models/Score');


Route.on    ('/').render('index')
Route.on    ('/info').render('info')
Route.on   ('/scores').render('best-players');

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

Route.post   ('/ajax/add_score', 'ScoreController.create');
Route.get    ('/ajax/scores', 'ScoreController.getScores'); 
