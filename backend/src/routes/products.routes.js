// Capa de RUTAS: solo define qué URL y método llama a qué controlador.
// El CRUD de administrador (POST/PUT/DELETE) llega con su historia de usuario.
import { Router } from 'express';
import * as productsController from '../controllers/products.controller.js';

const router = Router();

router.get('/', productsController.list);

export default router;
