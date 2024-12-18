import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import Token from '../../models/Token';
import { AuthEmail } from '../../emails/AuthEmail';
import { generateToken } from '../../utils/token';
import { hashPassword } from '../../utils/auth';

jest.mock('../../emails/AuthEmail');
jest.mock('../../logs/logger');

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
  });

  describe('POST /api/v1/auth/create-account', () => {
    it('should create a new user account successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/create-account')
        .send(userData)
        .expect(200);

      expect(response.text).toBe('Cuenta creada, revisa tu email');

      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
      
      const token = await Token.findOne({ user: user._id });
      expect(token).toBeTruthy();

      expect(AuthEmail.sendConfirmatioEmail).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate user and return JWT', async () => {
      const hashedPassword = await hashPassword('password123');
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        confirmed: true
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.text).toBeTruthy();
    });
  });

  describe('POST /api/v1/auth/confirm-account', () => {
    it('should confirm account successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        confirmed: false
      });

      const token = await Token.create({
        token: '123456',
        user: user._id
      });

      const response = await request(app)
        .post('/api/v1/auth/confirm-account')
        .send({ token: token.token })
        .expect(200);

      expect(response.text).toBe('Cuenta confirmada, ahora puedes iniciar sesión');

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.confirmed).toBe(true);

      const tokenExists = await Token.findOne({ token: token.token });
      expect(tokenExists).toBeNull();
    });
  });

  describe('POST /api/v1/auth/request-code', () => {
    it('should send new confirmation code successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        confirmed: false
      });

      const response = await request(app)
        .post('/api/v1/auth/request-code')
        .send({ email: user.email })
        .expect(200);

      expect(response.text).toBe('Se envio un nuevo token a tu e-mail');

      const token = await Token.findOne({ user: user._id });
      expect(token).toBeTruthy();

      expect(AuthEmail.sendConfirmatioEmail).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should send password reset token successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        confirmed: true
      });

      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: user.email })
        .expect(200);

      expect(response.text).toBe('Revisa tu email');

      const token = await Token.findOne({ user: user._id });
      expect(token).toBeTruthy();

      expect(AuthEmail.sendPasswordResetToken).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/auth/validate-token', () => {
    it('should validate token successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        confirmed: true
      });

      const token = await Token.create({
        token: '123456',
        user: user._id
      });

      const response = await request(app)
        .post('/api/v1/auth/validate-token')
        .send({ token: token.token })
        .expect(200);

      expect(response.text).toBe('Token valido, Define tu nuevo password');
    });
  });

  describe('POST /api/v1/auth/update-password/:token', () => {
    it('should update password successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'oldPassword123',
        confirmed: true
      });

      const token = await Token.create({
        token: '123456',
        user: user._id
      });

      const response = await request(app)
        .post(`/api/v1/auth/update-password/${token.token}`)
        .send({
          password: 'newPassword123',
          password_confirmation: 'newPassword123'
        })
        .expect(200);

      expect(response.text).toBe('Password reestablecido correctamente');

      const updatedUser = await User.findById(user._id);
      const tokenExists = await Token.findOne({ token: token.token });
      expect(tokenExists).toBeNull();
    });
  });
});