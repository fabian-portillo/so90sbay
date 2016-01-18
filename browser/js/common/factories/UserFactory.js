app.factory('UserFactory',function ($http) {

    var User = {};

    User.makeNewUser = function (signUpInfo) {
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

    User.getCurrentUser = function (user) {
      return $http({
        method: 'GET',
        url: '/api/user/' + user._id
      });
    }
    
    return User;
})
