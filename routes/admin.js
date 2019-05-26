const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const mongoose = require('mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
    databases: [mongoose],
    rootPath: '/admin',
    branding: {
        logo: '/img/logo.png',
        companyName: 'Lio'
    }
});

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: 'admin-bro',
    cookiePassword: process.env.JWTSECRET,
    authenticate: async (email, password) => {
        const user = await User.findOne({ email });

        if (user) {
            const validCredentials = await bcrypt.compare(password, user.password);
            const isAdmin = user.type === 'admin';

            if (validCredentials && isAdmin) {
                return user;
            }
        }

        return null;
    }
});

module.exports = router;
