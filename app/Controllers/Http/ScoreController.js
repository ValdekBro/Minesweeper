'use strict'

const Score = use('App/Models/Score');

class ScoreController {

    async getScores({request, response, auth}) {
        let scores = await Score.query().with('user').fetch();
        const filter = request.all();
        
        function compare(a, b) { 
            if (Number(a.time) < Number(b.time)) 
            return -1; 
            if (Number(a.time) > Number(b.time)) 
                return 1; 
            return 0; 
        }
        
        function getTime(time) {
            let millis, seconds, minutes, hours;
            let value = time;
            millis = Math.floor((value % 1000)/10);
            value /= 1000;
            seconds = Math.floor(value % 60);
            value /= 60;
            minutes = Math.floor(value % 60);
            value /= 60;
            hours = Math.floor(value % 24);
            return (hours + ':' + minutes + ':' + seconds + ':' + millis);
        };
        
        if(filter.user) scores = await auth.user.scores().fetch();;
        
        scores = scores.toJSON();
        scores = scores.sort(compare);
            
        if(filter.difficulty) {
            let newScores = [];
            for (var i in scores) {
                scores[i].difficulty == filter.difficulty ? newScores.push(scores[i]) : {} ;
            }
            scores = newScores;
        }

        
        for (var i in scores) {
            scores[i].time = getTime(scores[i].time);
            scores[i].prop = scores[i].prop == 'true' ? 'Without guessing' : 'With guessing';
        }
        return response.json({ scores: scores })
    }


        async userScore({view, auth}) {
            let scores = await auth.user.scores().fetch();

            function compare(a, b) { 
            if (Number(a.time) < Number(b.time)) 
            return -1; 
            if (Number(a.time) > Number(b.time)) 
                return 1; 
            return 0; 
        }

        function getTime(time) {
            let millis, seconds, minutes, hours;
            let value = time;
            millis = Math.floor((value % 1000)/10);
            value /= 1000;
            seconds = Math.floor(value % 60);
            value /= 60;
            minutes = Math.floor(value % 60);
            value /= 60;
            hours = Math.floor(value % 24);
            return (hours + ':' + minutes + ':' + seconds + ':' + millis);
        };
        
        scores = scores.toJSON();
        scores = scores.sort(compare); 
        for (var i in scores) {
            scores[i].time = getTime(scores[i].time);
            scores[i].prop = scores[i].prop == 'true' ? 'Without guessing' : 'With guessing';
        }
        return view.render('user-results', { scores: scores })
    }

    
    async create({ request, response, session, auth}) {
        const score = request.all();

        await auth.user.scores().create({
            time: score.time,
            difficulty: score.diff,
            prop: score.propose
        });

        // session.flash({ message: 'Your score has been saved' });
    }

}

module.exports = ScoreController
