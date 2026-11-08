// Plugin compartido: al convertir un documento a JSON (res.json),
// cambia `_id` de Mongo por `id` (string) y quita `__v`, como pide el Contrato de API.
export default function toJSONPlugin(schema) {
  schema.set('toJSON', {
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  });
}
