

// Configuracion y opciones de los sockets

import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();


export const conectarCliente = (cliente: Socket, io: socketIO.Server) =>{
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

// Desconectar un cliente
export const desconectar = (cliente: Socket, io:socketIO.Server ) =>{

    cliente.on('disconnect', () => {
        console.log('Desconectar!!');
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });

}

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: {de:string, cuerpo: string})=>{
        console.log('Mensaje recibido', payload);  
        io.emit('mensaje-nuevo', payload);
    })
}

export const configurarUsuario =(cliente: Socket, io: socketIO.Server)=>{
    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: any) => {
        
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre)

        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado..:!`
        });
        // io.emit('configurar-usuario', payload.nombre);
    })
}


export const obtenerUsuario = (cliente: Socket,io: socketIO.Server) => {
    cliente.on('obetener-usuarios', () => {   
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    })
} 
