// All usefull objects and shortcuts to simplify coding
let objects = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
    $container = $('.container'),
    $scorePanel = $('.score-panel'),
    $rating = $('.fa-star'),
    $moves = $('.moves'),
    $timer = $('.timer'),
    nowTime,
    $restart = $('.restart'),
    $deck = $('.deck'),
    match = 0,
    second = 0,
    moves = 0,
    allOpen = [],
    wait = 420,
    totalCard = objects.length / 2,
    stars5 = 12,
    stars4 = 16,
    stars3 = 20,
    stars2 = 24,
    star1 = 30;

// Card shuffling function
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// This function initiates the game
function init() {
    var allCards = shuffle(objects);
    $deck.empty();
    match = 0;
    moves = 0;
    $moves.text('0');
    $rating.removeClass('fa-star-o').addClass('fa-star');
    for (let i = 0; i < allCards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + allCards[i] + '"></i></li>'))
    }

    addCardListener();

    resetTimer(nowTime);
    second = 0;
    $timer.text(`${second}`)
    initTime();
}

// Adds the scores per amount of moves
function rating(moves) {
    var rating = 5;
    if (moves > stars5 && moves < stars4) {
        $rating.eq(4).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars4 && moves < stars3) {
        $rating.eq(3).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars3 && moves < stars2) {
        $rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars2 && moves < star1) {
        $rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > star1) {
        $rating.eq(0).removeClass('fa-star').addClass('fa-star-o');
        rating = 0;
    }
    return { score: rating };
}

// Add boostrap modal code to themplate 
function gameOver(moves, score) {
    $('#winnerText').text(`In ${second} seconds, you did a total of ${moves} moves with a score of ${score}. Well done!`);
    $('#winnerModal').modal('toggle');
}

// On click, the game restarts
$restart.bind('click', function (confirmed) {
    if (confirmed) {
        init();
    }
});

var addCardListener = function () {

    // With the following, the card that is clicked on is flipped
    $deck.find('.card').bind('click', function () {
        var $this = $(this);

        if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

        var card = $this.context.innerHTML;
        $this.addClass('open show');
        allOpen.push(card);

        //Compares cards if they matched
        if (allOpen.length > 1) {
            if (card === allOpen[0]) {
                $deck.find('.open').addClass('match');
                setTimeout(function () {
                    $deck.find('open').removeClass('open show');
                }, wait);
                match++;
            } else {
                $deck.find('.open').addClass('notmatch');
                setTimeout(function () {
                    $deck.find('.open').removeClass('open show');
                }, wait / 1.5);
            }
            allOpen = [];
            moves++;
            rating(moves);
            $moves.html(moves);
        }

        // The game is finished once all cards have been matched
        if (totalCard === match) {
            rating(moves);
            var score = rating(moves).score;
            setTimeout(function () {
                gameOver(moves, score);
            }, 500);
        }
    });
}

// Initiates the timer as soon as the game is loaded
function initTime() {
    nowTime = setInterval(function () {
        $timer.text(`${second}`)
        second = second + 1
    }, 1000);
}

// Resets the timer when the game ends or is restarted
function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}

init();