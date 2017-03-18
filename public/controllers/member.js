function totalHours(events) {
	var total = 0;
	for(var i = 0; i < events.length; i++){
		total += events[i].hours;
	}
	return total;
}

angular.module('nhs')

.controller('memberList', ['$scope', "$state", "$rootScope", "User", function($scope, $state, $rootScope, User){
	if(!$rootScope.members) {
		User.all()
			.then(function(userList) {
				for(var i=userList.length-1; i>=0; i--) {
					var m = userList[i], evts = m.events;
					if(m.lastname === "Fromal") userList.splice(i, 1);
					m.totalHours = totalHours(evts);
					m.checked = !evts.filter(function(evt) {
						return !evt.checked;
					}).length;
				}
				$rootScope.members = userList.sort(function(u1, u2) {
					return (u1.lastname.toLowerCase() > u2.lastname.toLowerCase()) ? 1 : -1;
				});
			});
	}



	$scope.propertyName = 'lastname';
	$scope.reverse = false;

	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	};

}])

.controller('singleMember', ['$scope', "$stateParams", "$rootScope", "User", "$q", "$state",
function($scope, $stateParams, $rootScope, User, $q, $state){
    $scope.events = [];

	var promiseUser = User.get($stateParams.memberID)
		.then(function(user) {
			$scope.member = user;
		});

	var promiseEvents =User.getEvents($stateParams.memberID)
		.then(function(events) {
			$scope.events = events;
		});

	$q.all([promiseUser, promiseEvents])
		.then(function() {
			checkHours();
		});

	function checkHours() {
		var summerHours = 0;
		var total = 0;

		for(var i = 0; i < $scope.events.length; i++){
			var hrs = $scope.events[i].hours;
			var month = new Date($scope.events[i].date).getMonth() + 1;
			total += hrs;
			if(6 <= month && month <= 8)
				summerHours += hrs;
		}
		if(summerHours > 10) { //  %%CONFIG%% RULE: 10 HOURS SUMMER MAX
			var message = $scope.member.firstname + " has too many summer hours! (" + summerHours + ")";
			$("#alert-wrapper").html("<div class=\"alert alert-danger\">" + message + "</div>");
		}
		$("#total-hours").text(total);
	}

	$scope.findTotal = function() {
        var total = 0;
        for(var i = 0; i < $scope.events.length; i++){
            total += $scope.events[i].hours;
        }
        return total;
    };

	$scope.saveChecks = function() {
		var promises = [];
		angular.forEach($scope.events, function(event) {
			if(event.justChecked) {
				promises.push(User.checkEvent($stateParams.memberID, event._id));
			}
		});

		$q.all(promises)
			.then(function() {
				$state.go("memberList");
			});
	};
}])

;
