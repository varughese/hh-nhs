angular.module('nhs')

    .factory('Excel', ["$window", function($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function(s) {
                return $window.btoa(unescape(encodeURIComponent(s)));
            },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g, function(m, p) {
                    return c[p];
                });
            };
        return {
            tableToExcel: function(tableId, worksheetName) {
                var table = $(tableId),
                    ctx = {
                        worksheet: worksheetName,
                        table: table.html()
                    },
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    }])


    .factory("User", ["$http", "$rootScope", "Auth", function($http, $rootScope, Auth) {
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
