/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Product = Promise.promisifyAll(mongoose.model('Product'));

var seedUsers = function () {
    var products = [
        {
            title: 'Tamagotchi',
            description: 'The best pet you\'ll ever have',
            price: 99.99,
            quantity: 10,
            category: ['toys'],
            photo: ['http://media3.popsugar-assets.com/files/2013/03/13/4/192/1922507/03bceceac28b09b1_tamagotchi-ios-app.xxxlarge/i/Tamagotchi-iPhone-App.jpg']
        },
         {
            title: 'Pogs',
            description: 'Don\'t touch my slammer',
            price: 1.99,
            quantity: 100,
            category: ['toys'],
            photo: ['http://toysfromthe90s.com/wp-content/uploads/2015/03/pogs.jpg']
        },
        {
            title: 'Britney and Justin Poster',
            description: 'Britney and Justin forever',
            price: 229.99,
            quantity: 5,
            category: ['posters'],
            photo: ['http://cdn.buzznet.com/assets/users16/pattygopez/default/justin-timberlake-britney-spears--large-msg-131118867529.jpg']
        },
        {
            title: 'Sega Genesis',
            description: 'The last system you\'ll ever need',
            price: 200.00,
            quantity: 33,
            category: ['video games','toys'],
            photo: ['https://upload.wikimedia.org/wikipedia/commons/6/6a/Sega-Genesis-Mk2-6button.jpg']
        },
         {
            title: 'Peanut (Royal Blue) Beanie Baby',
            description: 'The rarest beanie baby around',
            price: 10000.00,
            quantity: 2,
            category: ['toys', 'stuffed animals'],
            photo: ['http://i.ebayimg.com/00/s/NDE3WDMyMA==/z/82UAAOSw34FVBq1m/$_32.JPG']
        },
        {
            title: 'Plaid Shirt',
            description: 'Don\'t leave home without one',
            price: 10.00,
            quantity: 1000,
            category: ['clothing'],
            photo: ['https://i.s-jcrew.com/is/image/jcrew/22024_WD7145?$pdp_fs418$', 'http://www.plaidshirts.xyz/wp-content/uploads/2015/05/Plaid-Shirt-for-Men-in-Green-Long-Sleeve.jpg']
        },
         {
            title: 'Spice Girls CD',
            description: 'Spice up your life',
            price: 18.99,
            quantity: 1000,
            category: ['music'],
            photo: ['http://365thingsaustin.com/wp-content/uploads/2015/04/wallpaper_spice_girls.jpg']
        },
         {
            title: 'Backstreet Boys CD',
            description: 'Backstreet\s back',
            price: 18.99,
            quantity: 1000,
            category: ['music'],
            photo: ['http://groundctrl.s3.amazonaws.com/clients/groundctrl/media/03/01/large.2st3t71n944c.jpg']
        },
          {
            title: 'Legend of Zelda: Ocarina of Time',
            description: 'The legend begins (on N64)',
            price: 59.99,
            quantity: 222,
            category: ['video games','toys'],
            photo: ['https://upload.wikimedia.org/wikipedia/en/8/8e/The_Legend_of_Zelda_Ocarina_of_Time_box_art.png']
        },
         {
            title: 'Nintendo 64',
            description: 'The craziest graphics ever you\'ve ever seen',
            price: 260.99,
            quantity: 300,
            category: ['video games','toys'],
            photo: ['https://upload.wikimedia.org/wikipedia/commons/8/82/Nintendo_64.jpg']
        },
        {
            title: 'Black Lotus Magic the Gathering Card (Beta Edition)',
            description: 'One card to rule them all',
            price: 30000.00,
            quantity: 1,
            category: ['toys'],
            photo: ['http://img4.wikia.nocookie.net/__cb20150201165002/bindingofisaac/images/a/a0/Black_lotus_from_Magic_The_Gathering.jpg']
        },
        {
            title: 'Windbreaker',
            description: 'Wear it in all conditions',
            price: 50.00,
            quantity: 300,
            category: ['clothing'],
            photo: ['http://picture-cdn.wheretoget.it/yu7qzh-l.jpg', 'https://s-media-cache-ak0.pinimg.com/236x/67/9c/25/679c2555a7a2de397cc7227e9e5163a5.jpg']
        },
         {
            title: 'Snow Beach Ski Jacket',
            description: 'Raekwon says what up',
            price: 3000.00,
            quantity: 5,
            category: ['clothing'],
            photo: ['https://s-media-cache-ak0.pinimg.com/564x/3d/b1/a7/3db1a7d9f9a2072aa4c8cdc0dacb5296.jpg']
        },
        {
            title: 'Power Rangers Megazord',
            description: 'Mighty morphin',
            price: 101.00,
            quantity: 250,
            category: ['toys'],
            photo: ['http://ecx.images-amazon.com/images/I/71qpJeAuVHL._SL1436_.jpg']
        },
        {
            title: 'Super Soaker 50',
            description: 'Wetter is better',
            price: 55.00,
            quantity: 450,
            category: ['toys'],
            photo: ['http://uncrate.com/assets_c/2009/04/super-soaker-50-cropped-thumb-960x640-5191.jpg']
        },
        {
            title: 'Furby',
            description: 'Feed me',
            price: 99.99,
            quantity: 222,
            category: ['toys'],
            photo: ['https://upload.wikimedia.org/wikipedia/en/7/70/Furby_picture.jpg']
        }

       
    ];


    return Product.createAsync(products);

};

connectToDb.then(function () {
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
