
var express=require("express");
var app=express();

var bodyParser=require("body-parser");
app.use(bodyParser());
app.use(express.static("public"));
var multer=require('multer');
//app.use(multer({dest:"./uploads"}));
var uploader = multer({dest: "./uploads"});
var middleware_upload = uploader.single('imagen');


var swig=require('swig');
var MongoClient=require('mongodb').MongoClient;

const crypto=require('crypto');
const secreto='abcdefg';


var cloudinary=require('cloudinary');

cloudinary.config({
    cloud_name:"dht4aj0pv",
    api_key:"216922815544964",
    api_secret:"4RClXmOoPzODWV2vxAR7qVUjlvM"
});

var jwt=require('jsonwebtoken');

var rutasProtegidas = express.Router();  
 
rutasProtegidas.use(function(req, res, next) { 
 
  var token = req.body.token || req.query.token || 
  req.headers['token']; 
   
  console.log("token: "+token); 
   
  if (token) { 
    // verificar el token 
    jwt.verify(token, 'secreto', function(err, infoToken) {       
      if (err || (Date.now()/1000 - infoToken.tiempo) > 3600 ){ 
        return res.json({  
            acceso : false,  
            mensaje: 'Token invalido, renuevalo'  
        });     
      } else { 
        console.log("Usuario: "+infoToken.usuario) 
        console.log("Lleva activo : "+ 
                (Date.now()/1000 - infoToken.tiempo) +" segundos") 
        // dejamos correr la petición 
        res.usuario = infoToken.usuario; 
         next(); 
      } 
    }); 
  } else { 
    res.status(403) ;
    res.json({  
        acceso : false,  
        mensaje: 'No hay Token'  
    }); 
  } 
}); 

//app.use('/alumno', rutasProtegidas); 
//app.use('/alumno'); 
 

        
    

function Alumnos(Nombre,Apellido1,Apellido2,Email,Telefono,DNI,Detalles)
{
    this.nombre=Nombre;
    this.apellido1=Apellido1;
    this.apellido2=Apellido2;
    this.email=Email;
    this.telefono=Telefono;
    this.DNI=DNI;
    this.detalles=Detalles;
}

function AlumnosImagenes(Imageurl,idAlumno)
{
    this.imageurl=Imageurl;
    this.idalumno=idAlumno;
}

function Detalles(Estudio,Convocatoria,Empresas)
{
   this.estudio=Estudio;
   this.convocatoria=Convocatoria;
   this.empresas=Empresas;
}

function Empresas(Nombre,Estado)
{
    this.nombre=Nombre;
    this.estado=Estado;
}

function Usuarios(usuario,contrasena)
{
    
    this.usuario=usuario;
    this.contrasena=contrasena;
   
}

function Convocatorias(Nombre,FechaInicio,FechaFin,Estado,Estudios)
{
    this.nombre=Nombre;
    this.fechainicio=FechaInicio;
    this.fechafin=FechaFin;
    this.estadoactivo=Estado;
    this.estudios=Estudios;
    
}

function Estudios(Nombre)
{
    this.nombre=Nombre;
}

function Empresas(Nombre,CIF,Direccion,Telefono,Email)
{
    this.nombre=Nombre;
    this.cif=CIF;
    this.direccion=Direccion;
    this.telefono=Telefono;
    this.email=Email;
}


function GestionEmpresa(Empresa,Convocatoria,Estudio,Alumnosgestion)
{
    this.empresa=Empresa;
    this.convocatoria=Convocatoria;
    this.estudio=Estudio;
    this.alumnosgestion=Alumnosgestion;
}

function Alumnosgestion(Nombre,Estado)
{
    this.nombre=Nombre;
    this.estado=Estado;
}

function GestionAlumno(Nombre,Convocatoria,Estudio,Empresagestion)
{
    this.nombre=Nombre;
    this.convocatoria=Convocatoria;
    this.estudio=Estudio;
    this.empresagestion=Empresagestion;
}


//Insertar un registro en la base de datos
app.post("/alumno",function(req,res){
     
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
  
         
        var alumno = new Alumnos(req.body.nombre,req.body.apellido1,req.body.apellido2,req.body.email,req.body.telefono,req.body.DNI,resulturl,req.body.detalles); 
          
        var collection = db.collection('Alumnos'); 
        collection.insert(alumno, function (err, result) { 
            if (err) { 
              res.status(404);//no found
              res.json({
                 mensaje: "Error al insertar un alumno",
                 insertado:false
              });
            } else { 
             res.status(201);//create
             res.json({
                 insertado:true
             });
            } 
            // Cerrar el cliente 
            db.close(); 
            });
        
      } 
    }); 
});


//Obtener todo de la base de datos
app.get("/alumnos",function(req,res){ 
    
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
         
        //var alumno = new Alumnos(req.body.Nombre,req.body.Apellido1,req.body.Apellido2,req.body.Email,req.body.Estudio.req.body.Convocatoria); 
          
        var collection = db.collection('Alumnos'); 
        collection.find({}).toArray(function(err, result){
            
            if(err)
            {
              res.status(400);//Bad request
              res.json({
                 mensaje: "Error al buscar la lista de coches",
                 busqueda:false
              });
            }else{
                db.close();
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
            }
        });
      } 
    }); 
});

//Obtener un solo elemento
app.get("/alumnos/:id",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);//bad request
         res.json({
             conexion:false
         });
      } else { 
          
        var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
          
        var collection = db.collection('alumnos'); 
        collection.find({_id:id}).toArray(function(err, result){ 
            db.close();
            if(err)
            {
                res.status(400);
                res.json({
                 mensaje: "Error al buscar un alumno",
                 busqueda:false
              });
            }else{
                db.close();
                
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
    
            } 
        });
      } 
    }); 
});


//Obtener usuario y contraseña
app.post("/autenticar",function(req,res){ 
    console.log(req.body.contrasena + " " + req.body.email);
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
          
         res.status(500);
         res.json({
             autenticado:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        
        //var passwordSeguro=crypto.createHmac('sha256',secreto).update(req.body.contrasena).digest('hex');
      
        //var usu = new Usuarios(req.body.email, passwordSeguro);
        var usu = new Usuarios(req.body.email, req.body.contrasena);
        
          console.log(usu) ;
        var collection = db.collection('Usuarios'); 
        collection.find({email:usu.usuario,contrasena:usu.contrasena}).toArray(function(err, usu){ 
            console.log(usu.length);
            if (err||usu.length==0) { 
              res.status(400);
              res.json({
                  autenticado:false
              });
            } else { 
               
                var token=jwt.sign({usuario:usu[0].usuario,tiempo:Date.now()/1000},"secreto");
                res.status(201);//ok
                res.json({
                    autenticado:true,
                    token:token
                });
                
                
            } 
            // Cerrar el cliente 
            db.close();  
        });
      } 
    }); 
});


//Modificar un elemento
app.post("/alumnos/:id",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
          
          var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
         
        var alumno = new Alumnos(req.body.nombre,req.body.apellido1,req.body.apellido2,req.body.email,req.body.telefono,req.body.DNI,req.body.detalles);
          
        var collection = db.collection('Alumnos'); 
        collection.update({_id:id},alumno,function(err, result){ 
            if(err){
                
                res.status(404);//no found
                res.json({
                  modificado:false
              });
            }else
            {
                res.status(201);//ok 
                res.json({
                    modificado:true
                });
                
                
            }
             // Cerrar el cliente 
            db.close(); 
      
     }); 
      } 
    }); 
});


//Eliminar un elemento
app.delete("/alumnos/:id",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
          
          var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
         
                 
        var collection = db.collection('Alumnos'); 
        collection.remove({_id:id},(function(err, result){ 
             if (err) { 
              res.status(404);//no found
                res.json({
                  eliminado:false
              });
            } else { 
                        
                res.status(200);//ok
                res.json({
                eliminado:true
             });
               
              db.close(); 
            } 
   
        }));
      } 
    }); 
});

//Obtener todo de la base de datos estudios
app.get("/estudios",function(req,res){ 
    
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
         
        //var alumno = new Alumnos(req.body.Nombre,req.body.Apellido1,req.body.Apellido2,req.body.Email,req.body.Estudio.req.body.Convocatoria); 
          
        var collection = db.collection('Estudios'); 
        collection.find({}).toArray(function(err, result){
            
            if(err)
            {
              res.status(400);//Bad request
              res.json({
                 mensaje: "Error al buscar la lista de estudios",
                 busqueda:false
              });
            }else{
                db.close();
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
            }
        });
      } 
    }); 
});
    
    
    //Insertar un registro en la base de datos convocatorias
app.post("/convocatoria",function(req,res){
     
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        
        var convocatoria = new Convocatorias(req.body.nombre,req.body.fechainicio,req.body.fechafin,req.body.estadoactivo,req.body.estudios); 
          
        var collection = db.collection('Convocatorias'); 
        collection.insert(convocatoria, function (err, result) { 
            if (err) { 
              res.status(404);//no found
              res.json({
                 mensaje: "Error al insertar una convocatoria",
                 insertado:false
              });
            } else { 
             res.status(201);//create
             res.json({
                 insertado:true
             });
            } 
            // Cerrar el cliente 
            db.close(); 
        }); 
      } 
    }); 
});


//Modifica una convocatoria
app.post("/convocatorias/:id",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
          
          var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
         
        var convocatoria = new Convocatorias(req.body.nombre,req.body.fechainicio,req.body.fechafin,req.body.estadoactivo,req.body.estudios); 
          
        var collection = db.collection('Convocatorias'); 
        collection.update({_id:id},convocatoria,function(err, result){ 
            if(err){
                
                res.status(404);//no found
                res.json({
                  modificado:false
              });
            }else
            {
                res.status(201);//ok 
                res.json({
                    modificado:true
                });
                
                
            }
             // Cerrar el cliente 
            db.close(); 
      
     }); 
      } 
    }); 
});

    
//Obtener todo de la base de datos convocatorias
app.get("/convocatorias",function(req,res){     
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
         
        //var alumno = new Alumnos(req.body.Nombre,req.body.Apellido1,req.body.Apellido2,req.body.Email,req.body.Estudio.req.body.Convocatoria); 
          
        var collection = db.collection('Convocatorias'); 
        collection.find({}).toArray(function(err, result){
            
            if(err)
            {
              res.status(400);//Bad request
              res.json({
                 mensaje: "Error al buscar la lista de convocatorias",
                 busqueda:false
              });
            }else{
                db.close();
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
            }
        });
      } 
    }); 
});


//Obtener todo de la base de datos estudios
app.get("/empresas",function(req,res){ 
    
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        
          
        var collection = db.collection('Empresas'); 
        collection.find({}).toArray(function(err, result){
            
            if(err)
            {
              res.status(400);//Bad request
              res.json({
                 mensaje: "Error al buscar la lista de empresas",
                 busqueda:false
              });
            }else{
                db.close();
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
            }
        });
      } 
    }); 
});


//Insertar un registro en la base de datos convocatorias
app.post("/empresa",function(req,res){
      
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        
        var empresa = new Empresas(req.body.nombre,req.body.cif,req.body.direccion,req.body.telefono,req.body.email); 
          
        var collection = db.collection('Empresas'); 
        collection.insert(empresa, function (err, result) { 
            if (err) { 
              res.status(404);//no found
              res.json({
                 mensaje: "Error al insertar una empresa",
                 insertado:false
              });
            } else { 
             res.status(201);//create
             res.json({
                 insertado:true
             });
            } 
            // Cerrar el cliente 
            db.close(); 
        }); 
      } 
    }); 
});
    
        
//Modifica una empresa
app.post("/empresas/:id",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
          
          var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
         
        var empresa = new Empresas(req.body.nombre,req.body.cif,req.body.direccion,req.body.telefono,req.body.email); 
          
        var collection = db.collection('Empresas'); 
        collection.update({_id:id},empresa,function(err, result){ 
            if(err){
                
                res.status(404);//no found
                res.json({
                  modificado:false
              });
            }else
            {
                res.status(201);//ok 
                res.json({
                    modificado:true
                });
                
                
            }
             // Cerrar el cliente 
            db.close(); 
      
     }); 
      } 
    }); 
});


app.get("/estados",function(req,res){ 
    
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
         
        //var alumno = new Alumnos(req.body.Nombre,req.body.Apellido1,req.body.Apellido2,req.body.Email,req.body.Estudio.req.body.Convocatoria); 
          
        var collection = db.collection('Estados'); 
        collection.find({}).toArray(function(err, result){
            
            if(err)
            {
              res.status(400);//Bad request
              res.json({
                 mensaje: "Error al buscar la lista de estados",
                 busqueda:false
              });
            }else{
                db.close();
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
            }
        });
      } 
    }); 
});




//Insertar un registro en la base de datos convocatorias
app.post("/empresa",function(req,res){
      
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        
        var empresa = new Empresas(req.body.nombre,req.body.cif,req.body.direccion,req.body.telefono,req.body.email); 
          
        var collection = db.collection('Empresas'); 
        collection.insert(empresa, function (err, result) { 
            if (err) { 
              res.status(404);//no found
              res.json({
                 mensaje: "Error al insertar una empresa",
                 insertado:false
              });
            } else { 
             res.status(201);//create
             res.json({
                 insertado:true
             });
            } 
            // Cerrar el cliente 
            db.close(); 
        }); 
      } 
    }); 
});
    
        
//Modifica una empresa
app.post("/empresas/:id",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
          
          var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
         
        var empresa = new Empresas(req.body.nombre,req.body.cif,req.body.direccion,req.body.telefono,req.body.email); 
          
        var collection = db.collection('Empresas'); 
        collection.update({_id:id},empresa,function(err, result){ 
            if(err){
                
                res.status(404);//no found
                res.json({
                  modificado:false
              });
            }else
            {
                res.status(201);//ok 
                res.json({
                    modificado:true
                });
                
                
            }
             // Cerrar el cliente 
            db.close(); 
      
     }); 
      } 
    }); 
});

//Obtener todo de la base de datos estudios
app.get("/gestionempresas",function(req,res){ 
    
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        
          
        var collection = db.collection('GestionEmpresa'); 
        collection.find({}).toArray(function(err, result){
            
            if(err)
            {
              res.status(400);//Bad request
              res.json({
                 mensaje: "Error al buscar la lista de gestion de empresas",
                 busqueda:false
              });
            }else{
                db.close();
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
            }
        });
      } 
    }); 
});



//Insertar un registro en la base de datos
app.post("/gestionempresas",function(req,res){
     
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        console.log(req.body.detalles);
         
        var gestionempresa = new GestionEmpresa(req.body.empresa,req.body.convocatoria,req.body.estudio,req.body.alumnosgestion); 
          
        var collection = db.collection('GestionEmpresa'); 
        collection.insert(gestionempresa, function (err, result) { 
            if (err) { 
              res.status(404);//no found
              res.json({
                 mensaje: "Error al insertar una gestión de empresa",
                 insertado:false
              });
            } else { 
             res.status(201);//create
             res.json({
                 insertado:true
             });
            } 
            // Cerrar el cliente 
            db.close(); 
        }); 
      } 
    }); 
});



//Modifica una empresa
app.post("/gestionempresas/:id",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
          
          var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
         
        var empresa = new GestionEmpresa(req.body.empresa,req.body.convocatoria,req.body.estudio,req.body.alumnosgestion); 
          
        var collection = db.collection('GestionEmpresa'); 
        collection.update({_id:id},empresa,function(err, result){ 
            if(err){
                
                res.status(404);//no found
                res.json({
                  modificado:false
              });
            }else
            {
                res.status(201);//ok 
                res.json({
                    modificado:true
                });
                
                
            }
             // Cerrar el cliente 
            db.close(); 
      
     }); 
      } 
    }); 
});


//Obtener todo de la base de datos gestion alumnos
app.get("/gestionalumnos",function(req,res){ 
    
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        
          
        var collection = db.collection('GestionAlumno'); 
        collection.find({}).toArray(function(err, result){
            
            if(err)
            {
              res.status(400);//Bad request
              res.json({
                 mensaje: "Error al buscar la lista de gestion de alumnos",
                 busqueda:false
              });
            }else{
                db.close();
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
            }
        });
      } 
    }); 
});



//Insertar un registro en la base de datos
app.post("/gestionalumnos",function(req,res){
     
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
        console.log(req.body.detalles);
         
        var gestionalumno = new GestionAlumno(req.body.nombre,req.body.convocatoria,req.body.estudio,req.body.empresagestion); 
          
        var collection = db.collection('GestionAlumno'); 
        collection.insert(gestionalumno, function (err, result) { 
            if (err) { 
              res.status(404);//no found
              res.json({
                 mensaje: "Error al insertar una gestión de alumno",
                 insertado:false
              });
            } else { 
             res.status(201);//create
             res.json({
                 insertado:true
             });
            } 
            // Cerrar el cliente 
            db.close(); 
        }); 
      } 
    }); 
});





//Modifica una empresa
app.post("/gestionalumnos",function(req,res){ 
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
          
          var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
         
        var gestionalumno = new GestionAlumno(req.body.nombre,req.body.convocatoria,req.body.estudio,req.body.empresagestion); 
          
        var collection = db.collection('GestionAlumno'); 
        collection.update({_id:id},gestionalumno,function(err, result){ 
            if(err){
                
                res.status(404);//no found
                res.json({
                  modificado:false
              });
            }else
            {
                res.status(201);//ok 
                res.json({
                    modificado:true
                });
                
                
            }
             // Cerrar el cliente 
            db.close(); 
      
     }); 
      } 
    }); 
});



app.get("/subirimagen/:id",function(req,res){
 
    MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
     
      if (err) { 
         res.status(500);//bad request
         res.json({
             conexion:false
         });
      } else { 
          
        var id=require('mongodb').ObjectID(req.params.id);
        console.log("Conectado al servidor") ;
          
        var collection = db.collection('AlumnosImagen'); 
        collection.find({idalumno:id}).toArray(function(err, result){ 
            db.close();
            if(err)
            {
                res.status(400);
                res.json({
                 mensaje: "Error al buscar un alumno",
                 busqueda:false
              });
            }else{
                db.close();
                
                res.status(200);//ok
                res.send(JSON.stringify(result)); 
    
            } 
        });
      } 
    }); 
});



//Insertar un registro en la base de datos
app.post("/subirimagen",middleware_upload,function(req,res){
     
    
MongoClient.connect('mongodb://admin:adminx1@ds143262.mlab.com:43262/alumniapp',
 function(err, db) { 
      if (err) { 
         res.status(500);
         res.json({
             conexion:false
         });
      } else { 
        console.log("Conectado al servidor") ;
                  
                 
        var resulturl;
         console.log(req.file);
         cloudinary.uploader.upload(req.file.path, function(result) 
         { 
             console.log(result);
            resulturl=result.url;
            var alumno = new AlumnosImagenes(req.body.imageurl,req.body.idalumno); 
          
            var collection = db.collection('AlumnosImagen'); 
            collection.insert(alumno, function (err, result) { 
            if (err) { 
              res.status(404);//no found
              res.json({
                 mensaje: "Error al insertar un alumno",
                 insertado:false
              });
            } else { 
             res.status(201);//create
             res.json({
                 insertado:true
             });
            } 
            // Cerrar el cliente 
            db.close(); 
            });
       
       }); 
      } 
    }); 
});





app.listen(process.env.PORT|| 8080,function(){
    
   console.log("servidoractivo");
});





