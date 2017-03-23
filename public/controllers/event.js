angular.module('nhs')

.controller('eventCreate', ['$scope', "$state", "$rootScope", "Event", function($scope, $state, $rootScope, Event){
	$scope.eventData = {} || $scope.eventData;

	$scope.eventData.date = Date.now();

	$scope.saveEvent = function(){
        Event.create($scope.eventData)
            .then(function() {
                $state.go("dashboard");
            });
    };

    $scope.setUEvent = function setUpcomingEvent(uevent) {
        $scope.eventData.date = uevent.date;
    };

}])

.controller('eventEdit', ['$scope', "$state", "$rootScope", '$stateParams', 'Event', function($scope, $state, $rootScope, $stateParams, Event){
    var eventID = $stateParams.eventID;
    var pos = 0;

    Event.get(eventID)
        .then(function(event) {
            $scope.eventData = event;
        });

    $scope.saveEvent = function(){
        Event.update(eventID, $scope.eventData)
            .then(function() {
                $state.go("dashboard");
            });
    };

    $scope.deleteEvent = function(){
        Event.delete(eventID)
            .then(function() {
                $state.go("dashboard");
            });

    };

    $scope.setUEvent = function setUpcomingEvent(uevent) {
        $scope.eventData.date = uevent.date;
    };

}])

.controller('upcomingEventCreate', ['$scope', "$state", "$rootScope", '$stateParams', 'UpcomingEvent', function($scope, $state, $rootScope, $stateParams, UpcomingEvent){
	$scope.saveEvent = function(){
        UpcomingEvent.create($scope.eventData)
            .then(function() {
                $state.go("dashboard");
            });
    };

	$scope.deleteUevent = function(ueventID) {
		UpcomingEvent.delete(ueventID)
			.then(function(resp) {
				var i;
				for(i=0; i<$rootScope.upcoming.length; i++) {
					var uevent = $rootScope.upcoming[i];
					if(ueventID === uevent._id) {
						break;
					}
				}
				$rootScope.upcoming.splice(i, 1);
			});
	};


}])

.controller('upcomingEventEdit', ['$scope', "$state", "$rootScope", '$stateParams', 'UpcomingEvent', function($scope, $state, $rootScope, $stateParams, UpcomingEvent){
	var ueventID = $stateParams.ueventID;

	// UpcomingEvent.get(ueventID)
	// 	.then(function(event) {
	// 		$scope.eventData = event;
	// 	});

	if(!$rootScope.upcoming) $state.go("dashboard");

	for(var i=0; i<$rootScope.upcoming.length; i++) {
		var currentUpcomingEvent = $rootScope.upcoming[i];
		if(currentUpcomingEvent._id === ueventID) {
			$scope.eventData = currentUpcomingEvent;
		}
	}

	$scope.saveEvent = function(){
        UpcomingEvent.update(ueventID, $scope.eventData)
            .then(function() {
                $state.go("dashboard");
            });
    };


}])

;
