import mongoose from "mongoose";
let Schema = mongoose.Schema;
let MessageSchema =new Schema({
	senderId:String,
	receiverId:String,
	conversationType:String,
	messageType:String,
	sender:{
		id:String,
		name:String,
		avatar:String
	},
	receiver:{
		id:String,
		name:String,
		avatar:String
	},
	text:String,
	file:{data:Buffer,contentType:String,fileName:String},
	createdAt:{type:Number,default:Date.now},
	updatedAt:{type:Number,default:null},
	deletedAt:{type:Number,default:null}
});

MessageSchema.statics={
	createNew(item){
		return this.create(item);
	},
	getMessagesPersonal(senderId,receiverId,limit){
		return this.find({
			$or:[{$and:[{"senderId":senderId},{"receiverId":receiverId}]},
			{$and:[{"senderId":receiverId},{"receiverId":senderId}]}]
		}).sort({"createdAt":1}).limit(limit).exec();
	},
	getMessagesInGroup(receiverId,limit){
		return this.find({"receiverId":receiverId}).sort({"createdAt":1}).limit(limit).exec();
	}
};

const CONVERSATION_TYPE={
	PERSONAL:"personal",
	GROUP:"group"
}
const MESSAGE_TYPES={
	TEXT:"text",
	IMAGE:"image",
	FILE:"file"
}

module.exports ={
	model:mongoose.model("message",MessageSchema),
	conversationTypes:CONVERSATION_TYPE,
	messageTypes:MESSAGE_TYPES
};