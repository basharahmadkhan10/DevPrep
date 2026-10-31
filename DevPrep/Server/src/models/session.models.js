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

// Index for rapid session verification and revocation lookup
sessionSchema.index({ user: 1, revoke: 1 });
// TTL index to automatically purge expired sessions after 7 days
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const sessionModel=mongoose.model('session',sessionSchema);
export default sessionModel;