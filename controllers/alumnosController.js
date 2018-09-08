module.exports=class alumnosController{
    constructor() {
        this.alumnos = new Array();
    }

    get(req, res) {
        res.send(200,this.alumnos);
    }

    post(req, res) {

        var alumno = {
            nombre: req.body.nombre,
            apellido1: req.body.apellido1,
            apellido2: req.body.apellido2,
            email: req.body.email,
            telefono: req.body.telefono,
            DNI: req.body.DNI,
            detalles: req.body.detalles
        };


        this.alumnos.push(alumno);

        res.send(201,res.header('Location', '/alumnos/' + alumno.sku));
    };
}

