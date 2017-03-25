angular.module('nhs')

.factory("User", ["$http", "$rootScope", "Auth", function($http, $rootScope,Auth){
    var apiUrl = '/api/users/';

    var user = {};

    user.all = function() {
        return $http.get(apiUrl)
            .then(function(repsonse) {
                return repsonse.data;
            });
    };

    user.create = function(userData) {
        return $http.post(apiUrl, userData);
    };

    user.get = function(userID) {
        return $http.get(apiUrl + userID)
            .then(function(response) {
                return response.data;
            });
    };

	user.getEvents = function(userID) {
		return $http.get(apiUrl + userID + "/events")
			.then(function(response) {
				return response.data;
			});
	};

	user.checkEvent = function(userID, eventID) {
		return $http.post(apiUrl + userID + "/events/" + eventID + "/check")
			.then(function(response) {
				return response.data;
			});
	};

    user.toggleAdmin = function(userID) {
		return $http.put(apiUrl + userID + "/toggle-admin")
			.then(function(response) {
				return response.data;
			});
	};

    user.update = function(userID, userInfo) {
        return $http.put(apiUrl + userID, userInfo);
    };

    user.delete = function(userID) {
        return $http.delete(apiUrl + userID);
    };

    return user;


}])

;
