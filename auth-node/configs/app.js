'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions }   from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection }  from './db.configuration.js';
import { requestLimit }  from './rateLimit.configuration.js';
import { swaggerDocs }   from './documentation.js';

import empleadoroutes    from '../src/Empleado/empleado.routes.js';
import prestamoroutes    from '../src/Prestamo/prestamo.routes.js';
import transaccionroutes from '../src/Transaccion/transaccion.routes.js';

import { adminCuentaRouter, userCuentaRouter } from '../src/Cuenta/cuenta.routes.js';

const ADMIN_PATH = '/NovaCoin/Admin/v1';
const USER_PATH  = '/NovaCoin/v1';

const routes = (app) => {

    app.use(`${ADMIN_PATH}/empleados`,   empleadoroutes);
    app.use(`${ADMIN_PATH}/cuenta`,      adminCuentaRouter);
    app.use(`${ADMIN_PATH}/prestamo`,    prestamoroutes);
    app.use(`${ADMIN_PATH}/transaccion`, transaccionroutes);

    app.use(`${USER_PATH}/cuenta`, userCuentaRouter);

    app.get(`${ADMIN_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'NovaCoin Admin Server'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `El endpoint [${req.method}] ${req.originalUrl} no fue encontrado.`
        });
    });
};

const middlewares = (app) => {
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(requestLimit);
};

export const initServer = async () => {

    const app  = express();
    const PORT = process.env.PORT || 3020;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        await dbConnection();
        swaggerDocs(app);
        routes(app);

        app.listen(PORT, () => {
            console.log(`NovaCoin Admin Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};