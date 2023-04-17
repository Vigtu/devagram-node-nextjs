import type { NextApiRequest, NextApiResponse } from "next";
import type { repostaPadraoMsg } from '../../../types/respostaPadrao';
import { validarTokenJwt } from '../../../middlewares/validarTokenJwt';
import { conectarMongoDB } from '../../../middlewares/conectaMongoDB';
import { usuarioModel } from "../../../models/usuarioModels";
import usuario from "./usuario";
import { publicacaoModel } from "../../../models/publicacaoModels";

const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse<repostaPadraoMsg | any>) => {
    try {
        if (req.method === 'GET') {

            // receber informação do id do usuário
            // e verifica se ele existe (e é válido)
            if (req?.query?.id) {

                const usuario = await usuarioModel.findById(req?.query?.id);
                if (!usuario) {
                    return res.status(400).json({ error: 'Usuário não encontrado' })
                }

                // como buscar suas publicações
                const publicacoes = await publicacaoModel
                    .find({ idUsuario: usuario._id })
                    .sort({ data: -1 });

                return res.status(200).json(publicacoes);

            } else {
                return res.status(400).json({ error: 'ID do usuário não fornecido' });
            }
        }

        return res.status(405).json({ error: 'Método informado não é válido' })

    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Não foi possível obter o feed' });
    }
}

export default validarTokenJwt(conectarMongoDB(feedEndPoint));
