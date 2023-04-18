import type { NextApiRequest, NextApiResponse } from "next";
import type {repostaPadraoMsg} from '../../../types/respostaPadrao';
import { conectarMongoDB } from "../../../middlewares/conectaMongoDB";
import { validarTokenJwt } from "../../../middlewares/validarTokenJwt";
import { usuarioModel } from "../../../models/usuarioModels";

const pesquisaEndpoint
 = async (req : NextApiRequest, res: NextApiResponse<repostaPadraoMsg | any[]>) => {

    try{
        if(req.method === 'GET'){

            const {filtro} = req.query;
            // um campo só de busca

            if(!filtro){
                return res.status(400).json({error : 'Favor informar ao menos 2 caracteres de busca'});
            }

            const usuariosEncontrados = await usuarioModel.find({
                nome : {$regex : filtro, $options: 'i'}
            });

            return res.status(200).json(usuariosEncontrados);

        }
        return res.status(405).json({error : 'Metodo nao é valido'});

    }catch(e){
        console.log(e);
        return res.status(500).json({error : 'Nao foi possivel buscar usuarios' + e });
    }
}

export default validarTokenJwt(conectarMongoDB(pesquisaEndpoint));