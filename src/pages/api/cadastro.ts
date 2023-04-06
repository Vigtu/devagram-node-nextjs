import type {NextApiRequest, NextApiResponse} from 'next';
import type {repostaPadraoMsg} from '../../../types/respostaPadrao';
import type {CadastroRequisicao} from '../../../types/cadastroRequisicao';
import {usuarioModel} from '../../../models/usuarioModels'

const endpointCadastro = 
    async (req : NextApiRequest, res : NextApiResponse<repostaPadraoMsg>) => {

    if(req.method === 'POST'){
        const usuario = req.body as CadastroRequisicao;

        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({error : 'Nome invalido'});
        }

        if(!usuario.email || usuario.email.length < 5 
            || !usuario.email.includes('@')
            || !usuario.email.includes('.')){
            return res.status(400).json({error : 'Email invalido'});
        }

        if(!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({error : 'Senha invalida'});
        }
        //salvar banco de dados
        await usuarioModel.create(usuario); 
        return res.status(200).json({msg : 'Usuario cadastrado com sucesso'});
    }   
    return res.status(405).json({error : 'Metodo informado nao é valido'});
}

export default endpointCadastro;