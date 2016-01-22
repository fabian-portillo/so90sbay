app.config(function ($stateProvider) {
    $stateProvider.state('gifs', {
        url: '/gifs',
        templateUrl: 'js/90s-gifs/90s-gifs.html',
        controller: function ($scope) {
            $scope.gifs = ['http://i.giphy.com/xTiTno1ju4OXEUL5Sg.gif', 'http://i.giphy.com/3b6pYadlJLyDe.gif', 'http://i.giphy.com/WbfcrrqkbScCs.gif', 'http://i.giphy.com/d2YWTOsVtuHgOHhC.gif', 'http://i.giphy.com/tqY0QvB8PZv68.gif', 'http://i.giphy.com/u0YdUkaYoWxfG.gif', 'http://i.giphy.com/A6TnyhFIUwZCo.gif', 'http://i.giphy.com/10LNj580n9OmiI.gif', 'http://i.giphy.com/10fiEGSRm19UIM.gif', 'http://i.giphy.com/1w0gqDL5e45aw.gif', 
            	'http://i.giphy.com/YKpDqknnsBSjm.gif',
            	'http://i.giphy.com/mGXT4ZGZXHlJe.gif',
            	'http://i.giphy.com/D24iq51hZTHna.gif',
            	'http://i.giphy.com/w2fAwQbuxajoA.gif',
            	'http://i.giphy.com/oA538lYizmVP2.gif',
            	'http://i.giphy.com/pWOVaM1aCG5Zm.gif',
            	'http://i.giphy.com/nU6VjyI39vTc4.gif',
            	'http://i.giphy.com/cWlUvw8WxN6zC.gif',
            	'http://i.giphy.com/wO9EzKpgf3pao.gif',
            	'http://i.giphy.com/WQGOtmNuJ7M4M.gif'
            ]
        }

    });
});