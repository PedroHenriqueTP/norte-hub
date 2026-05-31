import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  description: string;
  category: string;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['unhas', 'tatuagem', 'cabelo', 'maquiagem', 'outros'],
    },
    images: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio: Model<IPortfolio> = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;

