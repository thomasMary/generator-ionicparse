module.exports = {
  prompts: [{
    type: 'checkbox',
    name: 'authentification provider',
    message: 'Which Authentification provider would you like to include?',
    choices: [{
      value: 'https://github.com/ManifestWebDesign/twitter-connect-plugin.git',
      name: 'Twitter',
      checked: false
    },
    {
      value: 'https://github.com/phonegap/phonegap-facebook-plugin.git',      
      name: 'Facebook',
      checked: false
    },
    {
      value: 'todo',      
      name: 'Username/Password',
      checked: false
    }
    ]
  }]
};
