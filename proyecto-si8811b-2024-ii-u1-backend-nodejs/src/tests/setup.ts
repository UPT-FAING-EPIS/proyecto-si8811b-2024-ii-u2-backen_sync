import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from 'dotenv';
import dotenv from 'dotenv';


// Carga las variables de entorno específicas para pruebas
dotenv.config({ path: '.env.test' });

config();

let mongoServer: MongoMemoryServer;

// Prevenir que el servidor intente conectarse a la BD real
jest.mock('../config/db', () => ({
  connectDB: jest.fn(),
}));

// Crear archivo de prueba antes de todas las pruebas
beforeAll(async () => {
  // Configuración del MongoMemoryServer
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);
});

// Limpiar las colecciones antes de cada prueba
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Eliminar archivo de prueba y desconectar MongoDB después de todas las pruebas
afterAll(async () => {
  // Desconectar MongoDB y detener el servidor en memoria
  await mongoose.disconnect();
  await mongoServer.stop();
});
