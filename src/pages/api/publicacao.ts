import type { NextApiResponse } from "next";
import type { repostaPadraoMsg } from "../../../types/respostaPadrao";
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../../middlewares/conectaMongoDB';
import {validarTokenJwt} from '../../../middlewares/validarTokenJwt';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<repostaPadraoMsg>) => {
        
        try{
            if(!req || !req.body){
                return res.status(400).json({error : 'Parametros de entrada não informados'})
            }
            const {descricao} = req?.body;

                if(!descricao || descricao.length < 2){
                    return res.status(400).json({error : 'Descricao nao e valida'})
                }
        
                if(!req.file){
                    return res.status(400).json({error : 'A imagem e obrigatoria'})
                }
        
                return res.status(200).json({msg : 'A publicacao esta valida'})   
        
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
