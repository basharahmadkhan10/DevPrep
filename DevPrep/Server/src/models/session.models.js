import mongoose from 'mongoose';
const sessionSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    ip:{
        type:String
    },
    userAgent:{
        type:String
    },
    refreshToken:{
        type:String,
        default:""
    },
    revoke:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
const sessionModel=mongoose.model('session',sessionSchema);
export default sessionModel;