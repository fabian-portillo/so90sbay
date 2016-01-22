app.config(function ($stateProvider) {

    $stateProvider.state('signUp', {
        url: '/signUp',
        templateUrl: 'js/signUp/signUp.html',
        controller: 'SignUpCtrl'
    });

});

app.controller('SignUpCtrl', function ($scope, $state, AuthService, SignUpFactory) {

    $scope.makeNewUser = function (signUpInfo) {
        return SignUpFactory.makeNewUser(signUpInfo)
            .then(function () {
                $state.go('login');
            }).catch(function () {
                $scope.error = 'SignUp Failed';
            });
    };

})
.factory('SignUpFactory',function ($http) {

    var signUp = {};

    signUp.makeNewUser = function (signUpInfo) {
        return $http({
            method: 'POST',
            url: '/api/user/',
            data: {
                user: signUpInfo
            }
        })
        .then((res) => {
            return {
                email: res.data.email,
                password: res.data.password
            };
        });
    };
    
    return signUp;
})














