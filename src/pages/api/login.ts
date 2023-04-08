import type{NextApiRequest, NextApiResponse} from 'next';
import {conectarMongoDB} from '../../../middlewares/conectaMongoDB';
import type {repostaPadraoMsg} from '../../../types/respostaPadrao';
import type {LoginResposta} from '../../../types/loginResposta';
import md5 from 'md5';
import {usuarioModel} from '../../../models/usuarioModels';
import jwt from 'jsonwebtoken';

const endpointLogin =  async (
    req: NextApiRequest,
    res : NextApiResponse<repostaPadraoMsg | LoginResposta>
) => {

    const{MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({error : 'ENV Jwt nao informada'});
    }

    if(req.method === 'POST'){
        const {login, senha} = req.body

        const usuarioEcontrados = await usuarioModel.find({email : login, senha : md5(senha)})
        if(usuarioEcontrados && usuarioEcontrados.length > 0){
                const usuarioEcontrado = usuarioEcontrados[0];

                const token = jwt.sign({_id : usuarioEcontrado._id}, MINHA_CHAVE_JWT);
                return  res.status(200).json({
                    nome : usuarioEcontrado.nome, 
                    email : usuarioEcontrado.email, 
                    token});
            }
            return res.status(405).json({error : 'Usuario ou senha não encontrados'});
    } 
    return res.status(405).json({error : 'Metodo informado nao é valido'});
}

export default conectarMongoDB(endpointLogin);