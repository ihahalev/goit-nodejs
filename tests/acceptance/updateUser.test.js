const supertest = require('supertest');
const should = require('should');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const fs = require('fs').promises;
const ContactsServer = require('../../contactsServer');
const UserModel = require('../../database/models/UserModel');
const configEnv = require('../../config.env');
const userModel = require('../types/userModel');

describe('PATCH /api/users/avatars', () => {
  let server;

  let token;
  const email = 'some@mail.com';
  const password = 'passwordHash';
  let genUser;

  before(async () => {
    const contactsServer = new ContactsServer();
    server = await contactsServer.start().catch(console.error);
    genUser = () =>
      sinon.createStubInstance(userModel, {
        updateUser: sinon.fake(),
      });
  });

  after(() => {
    sinon.restore();
    server.close();
  });

  it('Should return 401 Unauthorized', async () => {
    await supertest(server)
      .patch('/api/users/avatars')
      .set('Content-Type', 'multipart/form-data')
      .field('', '')
      .expect(401);
  });

  // context('when update User', () => {
  //   let sandbox;
  //   let hashPassswordStub;
  //   let findByIdStub;
  //   let updateUserStub;
  //   before(() => {
  //     // sandbox = sinon.createSandbox();
  //     // hashPassswordStub = sandbox.stub(UserModel, 'hashPasssword').returns(password);
  //     // findByIdStub = sandbox.stub(UserModel, 'findById').returns({password});
  //   });
  //   let userTest;
  //   before(async () => {
  //     userTest = await UserModel.create({
  //       email: 'some@mail.com',
  //       password: 'passwordHash',
  //     });
  //   });
  //   after(() => {
  //     UserModel.findByIdAndDelete(userTest._id);
  //   });
  //   after(() => sinon.restore());
  // });

  it('Should return 201 Success', async () => {
    const user = genUser();
    token = jwt.sign(faker.random.word(), configEnv.jwtPrivateKey);
    sinon.replace(UserModel, 'hashPasssword', sinon.fake.returns(password));
    sinon.replace(UserModel, 'findOne', sinon.fake.returns({ _id: 1, token }));

    user.set(token);
    sinon.replace(UserModel, 'findById', sinon.fake.returns(user));

    // sinon.replace(UserModel, 'findByIdAndUpdate', sinon.fake());

    const res = await supertest(server)
      .patch('/api/users/avatars')
      .set('Authorization', token)
      .set('Content-Type', 'multipart/form-data')
      .field('subscription', 'pro')
      .attach('avatar', 'public/images/Untitled.png')
      .expect(200);
    await fs.unlink(res.body.data.avatarPath);

    should.exist(res.body);
    res.body.should.have.property('success').which.is.a.Boolean();
    res.body.should.have.property('data').which.is.a.Object();
    res.body.data.should.not.have.property('password');
    res.body.data.should.have.property('avatarPath');

    // const createdUser = await userModel.findById(responseBody.id);
    // should.exists(createdUser);
  });
});
