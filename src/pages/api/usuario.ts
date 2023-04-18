import type { NextApiRequest, NextApiResponse } from "next";
import type { repostaPadraoMsg } from '../../../types/respostaPadrao';
import { validarTokenJwt } from '../../../middlewares/validarTokenJwt';
import { conectarMongoDB } from '../../../middlewares/conectaMongoDB';
import { usuarioModel } from "../../../models/usuarioModels";
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '../../../services/uploadImagemCosmic';

const handler = nc()
    .use(upload.single('file'))
    .put(async(req : any, res: NextApiResponse<repostaPadraoMsg>) => {
        try{

            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({error : 'Usuario nao encontrado'});
            }

            const {nome} = req.body;

            console.log("Nome antes da verificação:", nome);

            if(nome && nome.length >= 2){
                usuario.nome = nome;
            }

            console.log("Nome após a verificação:", usuario.nome);

            const {file} = req;
            if(file && file.originalname){

                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                }
            }

            // alterar os dados do DB
            await usuarioModel.findByIdAndUpdate(usuario._id, usuario, { new: true });
          

            return res.status(200).json({msg : 'Usuario alterado com sucesso'});

        }catch(e){
            console.log(e);
            return res.status(400).json({error : 'Nao foi possivel atualizar o usuario' + e})
        }
    })
    .get(async (req : NextApiRequest, res : NextApiResponse<repostaPadraoMsg | any>) => {
    
        try{
            // como pegar os dados do usuario logado
            // id do usuario 
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
            //usuario.senha = null;
            return res.status(200).json(usuario);
    
        }catch(e){
            console.log(e);
            return res.status(400).json({error : 'Nao foi possivel obter dados do usuario'})
        }
    
    });

export const  config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJwt(conectarMongoDB(handler));
