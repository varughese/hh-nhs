module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            'public/all.js': [
                // "public/lib/js/jquery.js",
                // "public/lib/js/bootstrap.js",
                // "public/lib/js/angular.js",
                // "public/lib/js/angular-ui-router.js",
                // "public/lib/js/ui-bootstrap-custom-2.0.0.js",
                // "public/lib/js/ui-bootstrap-custom-tpls-2.0.0.js",
                "public/app.js",
                "public/app.routes.js",
                "public/services/auth.js",
                "public/services/events.js",
                "public/services/users.js",
                "public/services/utils.js",
                "public/controllers/main.js",
                "public/controllers/login.js",
                "public/controllers/dashboard.js",
                "public/controllers/event.js",
                "public/controllers/member.js",
            ]
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public',
                    src: ['*.css', 'lib/css/*.css'],
                    dest: 'public/',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify']);

};
