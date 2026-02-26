'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import clienteroutes from '../src/Cliente/cliente.routes.js';
import empleadoroutes from '../src/Empleado/empleado.routes.js';
import cuentaroutes from '../src/Cuenta/cuenta.routes.js'

const BASE_PATH = '/NovaCoin/Admin/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/cliente`, clienteroutes);
    app.use(`${BASE_PATH}/empleados`, empleadoroutes);
    app.use(`${BASE_PATH}/cuenta`, cuentaroutes);
    app.get(`${BASE_PATH}/health`, (req, res) =>{
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'NovaCoin Admin Server'
        })
    })


    app.use((req, res) =>{
        res.status(404).json({
            success: false,
            message: 'EndPoint no encontrado'
        })
    })
}


const middlewares = (app) => {
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(requestLimit);
}

export const initServer = async () =>{
    const app = express();
    const PORT = process.env.PORT || 3020;
    app.set('trust proxy', 1)

    try{
        middlewares(app);
        await dbConnection();
        routes(app);  
        
        app.listen(PORT, () =>{
            console.log(`Áurea Restaurant Admin running on por ${PORT}`);
            console.log(`Health check endpoint: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    }catch(err){
        console.error(`Áurea Restaurant - Error al iniciar el servidor: ${err.message}`)
        process.exit(1);
    }
}