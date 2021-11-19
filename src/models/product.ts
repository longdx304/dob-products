import { Document, model, Model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

enum ProductType {
  Simple = 'simple',
  Configurable = 'configurable',
}

interface Attribute {
  attrName: string;
  attrValue: string[];
  useForVariant: boolean;
}

interface ProductAttrs {
  name: string;
  type: ProductType;
  sku: string;
  attributes?: Attribute[];
}

interface ProductDoc extends Document {
  name: string;
  type: ProductType;
  sku: string;
  attributes?: Attribute[];
  version: number;
}

interface ProductModel extends Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(ProductType),
      default: ProductType.Simple,
    },
    sku: {
      type: String,
      unique: true,
    },
    attributes: {
      type: [{}],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = model<ProductDoc, ProductModel>('Product', productSchema);

export { Product, ProductType };
