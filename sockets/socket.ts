

// Configuracion y opciones de los sockets

import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();


export const conectarCliente = (cliente: Socket) =>{
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

// Desconectar un cliente
export const desconectar = (cliente: Socket ) =>{

    cliente.on('disconnect', () => {
        console.log('Desconectar!!');
        usuariosConectados.borrarUsuario(cliente.id);
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

        

        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado..:!`
        });
        // io.emit('configurar-usuario', payload.nombre);
    })
}

