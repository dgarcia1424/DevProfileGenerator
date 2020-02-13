var fs = require('fs');
var inquirer = require('inquirer');
var axios = require('axios');
var pdf = require('html-pdf');


async function getUser(user) {
    try {
      const response = await axios.get(`https://api.github.com/users/${user}`);
      const { 
            name, 
            avatar_url, 
            bio, 
            followers, 
            following, 
            public_repos, 
            location 
        } = response.data;
        var options = { format: 'Letter', orientation: 'landscape' };
        pdf.create(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
      <style>
          .container{
              margin-top: 1em;
          }
      </style>
      <title>Document</title>
      </head>
      <body>
          <div class="container shadow border">
              <div id="mainContent" class="row bg-light">
                  <img class="col-md-4 col-sm-6" src="${avatar_url}" alt="profile image">
                  <div class="col-md-8 col-sm-6">
                      <h1 class="border-bottom">${name}</h1>
                      <a class="text-light bg-dark"href="https://github.com/${user}"><i class="fab fa-github"></i>GitHub</a>
                      <a class="text-light bg-dark"href="https://www.google.com/maps/place/${location}"><i class="fas fa-map-marked"></i>${location}</a>
                      <p id="bio">${bio}</p>
                  </div>
              </div>
              <div id="secondaryContent" class="row bg-dark text-light">
                  <p class="col-sm-4" id="followers">${followers} followers</p>
                  <p class="col-sm-4" id="following">following: ${following}</p>
                  <p class="col-sm-4" id="public-repos">${public_repos} public gitHub repos</p>
              </div>
          </div>
      </body>
      </html>
      `, options).toFile(`${user}.pdf`, function(err, res) {
        if (err) return console.log(err);
      });
        
    } catch (error) {
        console.error(error);
    }
}

inquirer
    .prompt({
        name: "user",
        message: "GitHub username:"
    },
    {
      message: "What is your favorite color?",
      name: "color",
    })
    .then(answer => {
        getUser(answer.user)
    });