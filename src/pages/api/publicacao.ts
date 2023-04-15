import type { NextApiResponse } from "next";
import type { repostaPadraoMsg } from "../../../types/respostaPadrao";
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../../middlewares/conectaMongoDB';
import {validarTokenJwt} from '../../../middlewares/validarTokenJwt';
import {publicacaoModel} from '../../../models/publicacaoModels';
import {usuarioModel} from '../../../models/usuarioModels';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<repostaPadraoMsg>) => {
        
        try{
            const{userId} = req.query;
            const usuario = await usuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({error : 'Usuario não informado'})
            }


            if(!req || !req.body){
                return res.status(400).json({error : 'Parametros de entrada não informados'})
            }
            const {descricao} = req?.body;

            if(!descricao || descricao.length < 2){
                return res.status(400).json({error : 'Descricao nao e valida'})
            }
        
            if(!req.file || !req.file.originalname){
                 return res.status(400).json({error : 'A imagem e obrigatoria'})
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto : image.media.url,
                data : new Date()
    
            }
                
            await publicacaoModel.create(publicacao);
            return res.status(200).json({msg : 'A publicacao criada com sucesso '})   
        
        }catch(e){
            console.log(e); 
            return res.status(400).json({error : 'Erro ao cadastrar publicacao'})
        }
});


export const  config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJwt(conectarMongoDB(handler)); 
