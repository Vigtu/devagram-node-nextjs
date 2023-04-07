import type{NextApiRequest, NextApiResponse} from 'next';
import {conectarMongoDB} from '../../../middlewares/conectaMongoDB';
import type {repostaPadraoMsg} from '../../../types/respostaPadrao';
import md5 from 'md5';
import {usuarioModel} from '../../../models/usuarioModels';

const endpointLogin =  async (
    req: NextApiRequest,
    res : NextApiResponse<repostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body

        const usuarioEcontrados = await usuarioModel.find({email : login, senha : md5(senha)})
        if(usuarioEcontrados && usuarioEcontrados.length > 0){
                const usuarioEcontrado = usuarioEcontrados[0];
                return  res.status(200).json({msg : `Usuario ${usuarioEcontrado.nome} autenticado com sucesso`});
            }
            return res.status(405).json({error : 'Usuario ou senha não encontrados'});
    } 
    return res.status(405).json({error : 'Metodo informado nao é valido'});
}

export default conectarMongoDB(endpointLogin);