import mongoose, {Model, Schema} from "mongoose";
import { Entry } from "../interfaces";

export interface IEntry extends Entry{

}

const entrySchema = new Schema({
    description:{
        type: String,
        required: true
    },
    createdAt:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum:{
            values: ['pending', 'in-progress', 'finished'],
            message: '{VALUE} no es un estado válido'
        },
        default: 'pending'
    }
});


const EntryModel:Model<IEntry> = mongoose.models.Entry || mongoose.model('Entry', entrySchema);


export default EntryModel;