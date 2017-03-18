angular.module('nhs')

.controller('login', ['$scope', "$state", "$rootScope", "Auth", function($scope, $state, $rootScope, Auth){
    $scope.processing = false;

    if(Auth.loggedIn()) $state.go("dashboard");

    $scope.login = function(){
        $scope.processing = true;

        Auth.login($scope.user.username.toLowerCase(), $scope.user.password)
            .then(function(user) {
                $rootScope.user = user;
                $state.go('dashboard');
            })
            .catch(function(err) {
                $scope.error = err;
            });
    };
}])

.controller('signup', ['$scope', "$state", "$rootScope", "User", function($scope, $state, $rootScope, User){
    $scope.seniorYear = (new Date()).getFullYear();
    $scope.juniorYear = $scope.seniorYear + 1;
    $scope.user = $scope.user || {};
    $scope.user.gradyear = $scope.juniorYear+"";

    $scope.signup = function(){
		console.log($scope.user);

        User.create($scope.user)
            .then(function(resp) {
                if(resp.data.success) {
                    $state.go('login');
                } else {
                    $scope.signupForm.username.usernameTaken = true;
                }
            })
            .catch(function(err) {
                $scope.error = err;
            });
    };
}])

//db.users.update({ username: "zmvarugh" }, { $set: { gradyear: 2017 } })

.directive("compareTo", ["$parse", function($parse) {
    return {
        require: "ngModel",
        link: function(scope, el, attrs, ngModel) {
            var me = attrs.ngModel;
            var matchTo = attrs.compareTo;

            scope.$watch(me, function(value){
                if(value) {
                    ngModel.$setValidity('match', value === $parse(matchTo)(scope) );
                } else {
                    ngModel.$setValidity('match', true);
                }
            });
        }
    };
}])
;
