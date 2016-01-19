app.config(function ($stateProvider) {
    $stateProvider.state('gifs', {
        url: '/gifs',
        templateUrl: 'js/90s-gifs/90s-gifs.html',
        controller: function ($scope) {
            $scope.gifs = ['http://i.giphy.com/xTiTno1ju4OXEUL5Sg.gif', 'http://i.giphy.com/3b6pYadlJLyDe.gif', 'http://i.giphy.com/WbfcrrqkbScCs.gif', 'http://i.giphy.com/d2YWTOsVtuHgOHhC.gif', 'http://i.giphy.com/tqY0QvB8PZv68.gif', 'http://i.giphy.com/u0YdUkaYoWxfG.gif', 'http://i.giphy.com/A6TnyhFIUwZCo.gif', 'http://i.giphy.com/10LNj580n9OmiI.gif', 'http://i.giphy.com/10fiEGSRm19UIM.gif']
        }

    });
});