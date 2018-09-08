"use strict"

var alumnosController = require('../controllers/alumnosController.js');

module.exports = class Routes {  
    static register(server) {

        const controller = new alumnosController();

        server.get('/alumnos', (req,res,next) =>
        {
            controller.get(req,res);
            next();
        });

        server.get('/alumnos/:id', (req,res,next) =>
        {
            controller.post(req,res);
            next();
        });
        server.post('/alumno', (req,res,next) =>
        {
            controller.post(req,res);
            next();
        });
        server.post('/alumnos/:id', (req,res,next) =>
        {
            controller.post(req,res);
            next();
        });
        server.delete('/alumnos/:id', (req,res,next) =>
        {
            controller.post(req,res);
            next();
        });
         
    }
}


