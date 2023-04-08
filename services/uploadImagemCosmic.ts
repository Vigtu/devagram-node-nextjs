import multer from "multer";
import cosmicjs from 'cosmicjs';

const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACAO, 
    BUCKET_AVATARES,
    BUCKET_PUBLICACAO } = process.env;

const cosmic = cosmicjs();
const bucketAvatares = cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES
});

const bucketPublicacoes = cosmic.bucket({
    slug: BUCKET_PUBLICACAO,
    write_key: CHAVE_GRAVACAO_PUBLICACAO
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){
        const media_object = {
            originalname : req.file.originalname,
            buffer : req.file.buffer
        };
    

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media : media_object});
        }else{
            return await bucketAvatares.addMedia({media : media_object});
        }
    
    }
}

export{upload, uploadImagemCosmic};