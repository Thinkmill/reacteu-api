# ReactEU API Server

ReactEurope [KeystoneJS](http://keystonejs.com) API Server

Full Instructions and documentation coming as soon as we can publish them after the conference :)

## Getting Started

Build/run -- **requires** mongod to be running

``` bash
git clone git@github.com:Thinkmill/reacteu-api.git
cd reacteu-api
npm install
npm start
```

Keystone will automatically create a new admin user in your database as specified in the `updates/1.0.0-admins.js` script.

The default username is `react@thinkmill.com.au` and the default password is `react`. You can change these by editing the update script before starting the server, or afterwards using the Admin UI.

## License

Copyright (c) 2015 Thinkmill. Made available under The MIT License (MIT).
