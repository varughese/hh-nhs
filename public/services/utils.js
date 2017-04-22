(function(angular) {

    angular.module('nhs')

    .factory('Excel', ["$window", function($window) {
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

        function base64(s) {
            return $window.btoa(unescape(encodeURIComponent(s)));
        }

        function format(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            });
        }

        function cleanHtml(html) {
            return html.replace(/<span ng-class="{'glyphicon-ok': member.checked }" class="glyphicon glyphicon-ok"><\/span>/g, 'Checked!');
        }

        return {
            tableToExcel: function(tableId, worksheetName) {
                var tableHtml = $(tableId).html();
                var ctx = {
                    worksheet: worksheetName,
                    table: cleanHtml(tableHtml)
                };
                return uri + base64(format(template, ctx));
            }
        };
    }])

    ;


})(angular);
