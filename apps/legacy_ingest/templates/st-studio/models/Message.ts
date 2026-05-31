import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  from: string; // telefone ou email
  to: string;
  content: string;
  type: 'whatsapp' | 'email' | 'website';
  direction: 'incoming' | 'outgoing';
  leadId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['whatsapp', 'email', 'website'],
      required: true,
    },
    direction: {
      type: String,
      enum: ['incoming', 'outgoing'],
      required: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

