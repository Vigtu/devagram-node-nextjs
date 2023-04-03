import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';

export const conectarMongoDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {

        // verificar se o banco esta conectado, seguir ao endpoint (se estiver on)
        // seguir para o endpoint ou proximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }

        //ja que nao esta conectado vamos conecta

        const {DB_CONEXAO_STRING} = process.env;

        //se a env estiver vazia, aborta o uso do sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).jason({erro : 'ENV de configuracao do banco, nao informado'});
        }
        
        mongoose.connection.on('connected', () => console.log('Banco de dados conectado!'));
        mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar ao banco: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);


        // seguimento do endpoint
        return handler(req, res);
    }

