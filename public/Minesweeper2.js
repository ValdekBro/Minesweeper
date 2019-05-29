$('#isProp').click(function() {
    $(this).toggleClass("active");
    $('#propCheck').prop( "checked", !$('#propCheck').prop("checked") );
});


function rand(min, max) {
    return Math.floor(Math.random() * (+max - +min)) + +min;
}
function rand(max) {
    var min = 0;
    return Math.floor(Math.random() * (+max - +min)) + +min;
}

function Timer(interval) {
    this.time = 0;
    this.interval = interval;
    this.status = "stoped";
    this.timer;
    
    this.getTime = function() {
        let millis, seconds, minutes, hours;
        let value = this.time;
        millis = Math.floor((value % 1000)/10);
        value /= 1000;
        seconds = Math.floor(value % 60);
        value /= 60;
        minutes = Math.floor(value % 60);
        value /= 60;
        hours = Math.floor(value % 24);
        return (hours + ':' + minutes + ':' + seconds + ':' + millis);
    };

    this.setTime = function(time) {
        this.time = time;
        $('#timer').text(this.getTime());
    };
    
    var tick = function() {
        this.time += this.interval;
        $('#timer').text(this.getTime());
    };
    
    this.start = function() {
        if(this.status == "stoped") {
            this.time = 0;
            this.status = "started";
            this.timer = setInterval( () => { tick.call(this) }, this.interval);
        } 
    };

    this.stop = function() {
        clearInterval(this.timer);
        this.status = "stoped";
    };
    
    this.restart = function() {
        this.stop();
        this.start();
    };
};

function Game( dif, prop ) {
    var $board = $('#board');
    var timer = new Timer(10);
    var ROWS = 0;
    var COLS = 0;
    var MINES = 0;
    var mines = MINES;
    var mine = [];
    var difficulty = dif;
    var isWithProp = prop;

    function createBoard( ) {
        clear.call(this);
        
        if(difficulty == 'Easy') {
            ROWS = 8;
            COLS = 8;
            MINES = 10;                
        } else if(difficulty == 'Normal') {
            ROWS = 16;
            COLS = 16;
            MINES = 40;
        } else if(difficulty == 'Hard') {
            ROWS = 18;
            COLS = 32;
            MINES = 99;
        } else {  }

        mines = MINES; //mines - mines
        $('#mines-left').text(mines);

        // Cells initialization
        for (let i = 0; i < ROWS; i++) {
    
            mine[i] = [];

            const $row = $('<div>').addClass('row');
            for (let j = 0; j < COLS; j++) {
                    
                mine[i][j] = 0;

                const $col = $('<div>')
                    .addClass('col hidden')
                    .attr('data-row', i)
                    .attr('data-col', j);
                
                let game = this;

                $col.on("mousedown", function() {
                    if (event.which === 1 ) {
                        leftClick.call(game, $(this));
                    } else if (event.which === 2) {
                        middleClick.call(game, $(this));
                    } else if (event.which === 3) {
                        rightClick.call(game, $(this));
                    }
                });
                $row.append($col);
        
            }
            $board.append($row);

        }
       // Mines initialization
        for (let i = 0; i < MINES;) {
            let $cell = $(`.col.hidden[data-row=${rand(ROWS)}][data-col=${rand(COLS)}]`);
            const row = $cell.data('row');
            const col = $cell.data('col');
            if(!isMine.call(this, row, col)) {
                i++; 
                mine[row][col] = 1;
            }
        }
        
        // Propozition generation
        while(isWithProp) {
            let i = rand(ROWS);
            let j = rand(COLS);
            let $cell = $(`.col.hidden[data-row=${i}][data-col=${j}]`);
            
            if(getMineCount.call(this, i, j) == 0) {
                $cell.addClass('prop');
                break;
            }
        } 
    }
    
    this.start = function() {
        createBoard.call(this);
        timer.setTime(0);
    }

    // Right click handler
    var rightClick = function($cell) {
        icon = 'fa fa-flag';
        if(!$cell.hasClass('hidden')) return;
        if(!$cell.hasClass('flagged')) {
            mines--;
            $cell.append(
                $('<i>').addClass(icon)
                );
                $cell.addClass('flagged');      
            } else {
                mines++;
                $cell.empty();
                $cell.removeClass('flagged');  
            }
            $('#mines-left').text(mines);
        }
        // Left click handler
        var leftClick = function($cell) {
            const row = $cell.data('row');
            const col = $cell.data('col');
            
            // Check
            if($cell.hasClass('flagged')) return;
            if($cell.hasClass('hidden')) timer.start();
            if( !$cell.hasClass('hidden') &&
            (getMineCount(row, col) <= getFlaggedCount(row, col)) ) {
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        reveal.call(this, row + di, col + dj);
                    }      
                }
                return;
            }  
        if (isMine.call(this, row, col)) {
            this.loose();
        } else {
            reveal(row, col);
            if ($('.col.hidden').length === getMinesCount()) win.call(this);
            
        }
        
        
    }
    // Midle click handler
    var middleClick = function($cell) {
        // TODO : set '?' char to cell on middleclick 
    }
    
    // Check cell
    function check(i, j) {
        if (i >= ROWS || j >= COLS || i < 0 || j < 0) return false; // Parameters validation
        const key = `${i} ${j}`;
        
        if (seen[key]) return false; // leave if cell is already checked
        
        const $cell = $(`.col.hidden[data-row=${i}][data-col=${j}]`); 
        
        if ( !$cell.hasClass('hidden') || 
        $cell.hasClass('flagged') ) return false; // leave if cell is openned or flagged
        
        if(isMine(i, j)) { // over the game if  cell minned ...
            this.loose();
            return false;
        }
        
        $cell.removeClass('hidden'); // clear cell
        $cell.removeClass('prop');
        
        if ($('.col.hidden').length === getMinesCount()) win.call(this);
        
        const mineCount = getMineCount(i, j); // ... or set mine count
        if (mineCount) {
            $cell.text(mineCount);
            return false;
        }
        
        return true
    }
    
    // Recursive init
    function reveal(oi, oj) { 
        seen = {};
        function helper(i, j) { // recursive check neighbors
            // setTimeout( () => { // set delay                 
            if(check.call(this, i, j)) {
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        helper.call(this, i + di, j + dj);
                    }      
                }
            }
            // }, 1);
        }
        helper.call(this, oi, oj);
    }
    
    
    function clear() {
        $board.empty();
        mine = [];
        timer.stop();
        $('#timer').removeClass('win');
        $('#title').css({ 'color' : 'black' });
        $('.container').css({ 'background-color' : 'rgb(51, 182, 138)' });
    }
    
    function showCells() { 
        const icon = 'fa fa-bomb'; // bomb icon
    
        /// Open all cells ///
        for (let i = 0; i < ROWS; i++) 
            for (let j = 0; j < COLS; j++)
            if(isMine(i, j)) {
                let $cell = $(`.col[data-row=${i}][data-col=${j}]`);
                $cell.empty();
                    $cell.append(
                        $('<i>').addClass(icon)
                        );
                    }
                    else {
                    let $cell = $(`.col[data-row=${i}][data-col=${j}]`);
                    $cell.html(function() {
                        const $cell = $(this);
                        const count = getMineCount(
                          $cell.data('row'),
                          $cell.data('col'),
                          );
                          return count === 0 ? '' : count;
                        });
                    }
                    
                    $('.col.hidden').removeClass('hidden');
                }
                
    this.loose = function() {
        timer.stop(); // stop time flow
        $('#isProp').show();
        $('.box').show();
        showCells();
        setLooseView();
    }
    function win() {
        timer.stop(); // stop time flow
        $('#isProp').show();
        $('.box').show();
        showCells();
        setWinView();
        
        $.ajaxSetup({
            headers:
            { 'X-CSRF-TOKEN': $('#csrf').text() }
        });
        
        $.ajax({
            url: '/ajax/add_score',
            method: "POST",
            data: { time : timer.time, diff : difficulty, propose : isWithProp },
            datatype: "json"
        });

    }

    function setWinView() {
        $('#timer').addClass('win');
        $('#title').css({'color':'green'});
        $('.container').css({ 'background-color' : 'white' });
        $('.boxx').css({ 'display' : '' });
    }
    function setLooseView() {
        $('#title').css({'color':'red'});
        $('.container').css({ 'background-color' : 'rgba(140, 0, 0, 0.2)' });
        $('.boxx').css({ 'display' : '' });
    }
    
    function isMine(i, j) {
        return mine[i][j] == 1;
    }
    
    // get count of mines on nieghbors
    function getMineCount(i, j) { 
        let count = 0;
        for (let di = -1; di <= 1; di++)
        for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
                if(isMine(ni, nj)) count++;
            }      
            return count;
        }
        
        // get count all mines
        function getMinesCount() {  
            let count = 0;
            for (let i = 0; i < ROWS; i++)
            for (let j = 0; j < COLS; j++) 
            if(isMine(i, j)) count++;
            return count;
        }
        
        // get count of openned neighbors cells
        function getShownCount(i, j) {
            let count = 0;
            for (let di = -1; di <= 1; di++)
            for (let dj = -1; dj <= 1; dj++) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
                const $cell =
                $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
                if (!$cell.hasClass('flagged') && !$cell.hasClass('hidden')) count++;
            }      
            return count;
        }
        
        // get count of flagged neighbors cells
        function getFlaggedCount(i, j) {
            let count = 0;
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
                    const $cell =
                    $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
                    if ($cell.hasClass('flagged')) count++;
                }      
            }
            return count;
        }
    }
    
    let game;
    
function startGame() {
    if(game) game.loose();
    let dif = $("select#difficulties").val();
    let prop = $('#propCheck').prop("checked");
    if($('#title').css('display') == 'none') {
        $('#isProp').hide();
        $('.boxx').css({ 'display' : 'none' });
    }
    game = new Game(dif, prop);
    game.start();
}

function showCells() {
    game.loose();
}



