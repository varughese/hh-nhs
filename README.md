# hh-nhs
NHS Website. Live @ [http://hhnhs.herokuapp.com](http://hhnhs.herokuapp.com)

## What is This
In high school, I was a National Honor Society (NHS) officer and promised to create an application to digitize the logging of community service hours. Before, members had to go to the NHS advisor's room, request to get the "NHS notebook", flip through hundreds of pages to find their name, write their community service hours in, and *then* repeat this process for each new community service event they completed. It was 2016 at the time. Who uses paper to log things in 2016?

It is a pretty simple CRUD app built with the MEAN stack, deployed to Heroku. It includes the following features:
- Authentication
- A member can log and track their community service events and hours
- Admins can add "Upcoming Events" that everyone can see
- Autocomplete when logging a new community service event
- Admin control dashboard with password
- Admins can check off (verify) member hours in the Member List
- Fully responsive design


## Screenshots
![](https://i.imgur.com/VFTUs1xl.png)
![](https://i.imgur.com/u1yf1swl.png)
![](https://i.imgur.com/F9jNYE9l.png)

![](https://i.imgur.com/qvRKls3l.png)

## Instructions for Viewing
- [Download Node.JS](https://nodejs.org/en/)
  - Download the Version 4
  - Download the file and run it. Go through the set up
  
- Click on the green `clone or download` button above. Click download zip.
- Open it up and unzip it. That means drag the folder onto your Desktop. Google how to unzip if you cant figure this out.
- When thats done open up the `hh-nhs-master` folder that you saved.
- Hold `Shift` and right click (you have to right click near the bottom of the window in a space that is white). Click open in command prompt.
- Type `npm install`. This will install dependencies from the internet into your project.
- Type the following `node server.js`
- Open up a web browser and type in the following url `localhost:8080`
- Login!

## Instructions for Deploying
There are two branches on this project: the `master` and `production`. Pushing to the `production` branch will trigger a deploy to Heroku, which will deploy a new change!

The `production` branch is different because it minifies and concatenates all of the HTML templates and JS files. This reduces filesize and server requests, which is pretty important when you are using a free hosting service.

To deploy a change 
- Install [Grunt](https://gruntjs.com/) with `npm install -g grunt`, a build tool used to automate certain tasks. 
- Switch to the production branch. `git checkout production`
- Pull the changes. `git pull master`
- Minify the Javscript and angular HTML templates `grunt` 
    - just running `grunt` will trigger the default task, which is to minify javascript and compile the html templates into one file
- `git add .` `git commit -m "built"` `git push origin production`
- Switch back to master branch! `git checkout master` If you forget this, you will be editing the wrong branch!

I have a shell script that does this all for me, but I figured it's important to understand how the deployment process works.
