import type{NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../../middlewares/conectaMongoDB';
import type {repostaPadraoMsg} from '../../../types/respostaPadrao';

const endpointLogin = (
    req: NextApiRequest,
    res : NextApiResponse<repostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body

        if(login === 'admin@admin.com' &&
            senha === 'admin@123'){
                return  res.status(200).json({msg : 'Usuario autenticado com sucesso'});
            }
            return res.status(405).json({error : 'Usuario ou senha não encontrados'});
    } 
    return res.status(405).json({error : 'Metodo informado nao é valido'});
}

export default conectarMongoDB(endpointLogin);