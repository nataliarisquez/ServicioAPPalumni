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

module.exports=Alumnos;


