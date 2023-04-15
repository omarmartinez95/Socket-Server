

import {Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

export const router = Router();


router.get('/mensajes', (req: Request, res: Response)=>{
    res.json({
        ok: true,
        mensaje: 'Todo esta bien'
    })
});

router.post('/mensajes', (req: Request, res: Response)=>{

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
    };

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        cuerpo,
        de
    })
});

router.post('/mensajes/:id', (req: Request, res: Response)=>{

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    })
});

// servicios para obtener ids de los usuarios
router.get('/usuarios', async(req: Request, res: Response)=>{
    const server = Server.instance;
    await server.io.fetchSockets()
        .then((sockets: any[]) => {
            if(sockets.length > 0){
                let aux: string[] = [];
                sockets.forEach((ele: any)=>{
                    aux.push(ele.id);
                })
                return res.json({
                    ok: true,
                    clientes: aux
                })
            } else {
                return res.json({
                    ok: false,
                    clientes: []
                })
            }
        })
        .catch(err => {
            return res.json({
              ok: false,
              clientes: [],
            });
        })
})

// Obtener usuarios y nombres
router.get('/usuarios/detalle', (req: Request, res:Response)=>{

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista();
    })

})

export default router;