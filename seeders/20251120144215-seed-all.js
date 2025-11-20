'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Users
    const users = require('../data/users.json');
    users.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.password = bcrypt.hashSync(el.password, 10);
    });
    await queryInterface.bulkInsert('Users', users, {});

    // 2. Profiles
    const profiles = require('../data/userProfiles.json');
    profiles.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert('UserProfiles', profiles, {});

    // 3. Posts
    const posts = require('../data/posts.json');
    posts.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert('Posts', posts, {});

    // 4. Tags & PostTags
    const tags = require('../data/tags.json');
    tags.forEach(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert('Tags', tags, {});

    const postTags = require('../data/postTags.json');
    postTags.forEach(el => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert('PostTags', postTags, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PostTags', null, {});
    await queryInterface.bulkDelete('Tags', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('UserProfiles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};