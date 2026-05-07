const {Schema,model} =require("mongoose")
const blogschema =new Schema({
    title:{
        type: String,
        require: true,
    },
    body:{
        type:String,
        require: true,
    },
    coverImgUrl:{
        type:String,
        require:false,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
},{timestamps: true})
const blog =model('blog',blogschema)
module.exports=blog