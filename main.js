
var express=require("express");
var app=express();

var bodyParser=require("body-parser");
app.use(bodyParser());
app.use(express.static("public"));

var swig=require('swig');
var MongoClient=require('mongodb').MongoClient;

const crypto=require('crypto');
const secreto='abcdefg';

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

app.use('/alumno', rutasProtegidas); 
 

        
    

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
        console.log(req.body.detalles);
         
        var alumno = new Alumnos(req.body.nombre,req.body.apellido1,req.body.apellido2,req.body.email,req.body.telefono,req.body.DNI,req.body.detalles); 
          
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

app.listen(8080,function(){
    
    console.log("servidoractivo");
});

//app.listen(process.env.PORTcco,function(){
//    
//    console.log("servidoractivo");
//});





