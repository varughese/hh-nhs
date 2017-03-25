function totalHours(events) {
	var total = 0;
	for(var i = 0; i < events.length; i++){
		total += events[i].hours;
	}
	return total;
}

angular.module('nhs')

.controller('memberList', ['$scope', "$state", "$rootScope", "User", "$timeout", function($scope, $state, $rootScope, User, $timeout){
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
					m.dateCreated =  new Date(parseInt(m._id.substring(0, 8), 16) * 1000);
				}
				$rootScope.members = userList.sort(function(u1, u2) {
					return (u1.lastname.toLowerCase() > u2.lastname.toLowerCase()) ? 1 : -1;
				});
			});
	}


	$scope.toggleAdminPanel = function() {
		$scope.showAdminPanel = !$scope.showAdminPanel;
	};

	$scope.showAdminPanel = false;
	$scope.propertyName = 'lastname';
	$scope.reverse = false;

	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	};

	$scope.toggleAdmin = function(member) {
		User.toggleAdmin(member._id)
			.then(function(data) {
				member.admin = !member.admin;
			});
	};

	$scope.resetPass = function(member, event) {
		var row = event.currentTarget.parentElement;
		if(member.password) {
			User.update(member._id, { password: member.password } )
				.then(function(data) {
					row.innerHTML = "<b>RESET</b>";
				})
				.catch(function(err) {
					row.innerHTML = "<b>ERROR</b>";
					console.error(err);
				});
		}
	};

	$scope.removeUser = function(event, member, timerFalse) {
		var useTimer = !timerFalse;
		var row = event.currentTarget.parentElement;
		if(useTimer) {
			$timeout(function () {
				member.confirmDelete = true;
			}, 1000);
			$timeout(function () {
				member.confirmDelete = false;
			}, 200);
		} else {
			User.delete(member._id)
				.then(function(data) {
					row.innerHTML = "<b>DELETED</b>";
				});

		}
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
		var summerHours, total, signedHours;
		summerHours = total = signedHours = 0;

		for(var i = 0; i < $scope.events.length; i++){
			var hrs = $scope.events[i].hours;
			var month = new Date($scope.events[i].date).getMonth() + 1;
			total += hrs;
			if($scope.events[i].checked)
				signedHours += hrs;
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
