import mongoose, { Schema, Model } from 'mongoose';

interface Usuario {
  nome: string;
  email: string;
  senha: string;
  avatar?: string;
  seguidores?: number;
  seguindo?: number;
  publicacoes?: number;
}

const usuarioSchema = new Schema<Usuario>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  avatar: { type: String },
  seguidores: { type: Number, default: 0 },
  seguindo: { type: Number, default: 0 },
  publicacoes: { type: Number, default: 0 },
});

let usuarioModel: Model<Usuario>;
try {
  usuarioModel = mongoose.model<Usuario>('usuarios');
} catch (error) {
  usuarioModel = mongoose.model<Usuario>('usuarios', usuarioSchema);
}
export { usuarioModel };
