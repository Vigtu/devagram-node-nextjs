import type {NextApiRequest, NextApiResponse} from 'next';
import type {repostaPadraoMsg} from '../../../types/respostaPadrao';
import type {CadastroRequisicao} from '../../../types/cadastroRequisicao';
import {usuarioModel} from '../../../models/usuarioModels';
import md5 from 'md5';  
import {conectarMongoDB} from '../../../middlewares/conectaMongoDB';
import {upload, uploadImagemCosmic} from '../../../services/uploadImagemCosmic';
import nc from 'next-connect';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : NextApiRequest, res : NextApiResponse<repostaPadraoMsg>) => {
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

         //validacao de usuario existente 
         const usuariosMesmoEmail = await usuarioModel.find({email : usuario.email});
         if(usuariosMesmoEmail && usuariosMesmoEmail.length > 0){
             return res.status(400).json({error : 'Ja existe uma conta com esse email formado'});
         }
         
         // enviar imagem do multer para o cosmic

         const image = await uploadImagemCosmic(req);

         //salvar banco de dados
         const usuarioSalvamento = {
             nome : usuario.nome,
             email : usuario.email,
             senha : md5(usuario.senha),
             avatar : image?.media?.url
         }
         await usuarioModel.create(usuarioSalvamento); 
         return res.status(200).json({msg : 'Usuario cadastrado com sucesso'});
         
});

export const config = {
    api : {
        bodyParser : false
    }
}

export default conectarMongoDB(handler);