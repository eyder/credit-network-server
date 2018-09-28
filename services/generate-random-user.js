var rp = require('request-promise');

function generateRandomUser() {
    return rp.get('https://randomuser.me/api/', { json: true })
        .then(response => {
            return {
                id: response.results[0].id.value ? response.results[0].id.value : new Date().getTime(), 
                name: response.results[0].name.first + ' ' + response.results[0].name.last,
                email: response.results[0].email,
                picture: response.results[0].picture.thumbnail,
                connections: []
            };
        });
}

module.exports = generateRandomUser;
