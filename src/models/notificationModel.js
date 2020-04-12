import mongoose from "mongoose";
let Schema = mongoose.Schema;
let NotificationSchema =new Schema({
	senderId:String,
	receiverId:String,
	type:String,
	isRead:{type:Boolean,default:false},
	createdAt:{type:Number,default:Date.now}
});

NotificationSchema.statics={
	createNew(item){
		return this.create(item);
	},
	removeRequestContactNotification(senderId,receiverId,type){
		return this.remove({
			$and:[
			{"senderId":senderId},
			{"receiverId":receiverId},
			{"type":type}
			]
		}).exec();
	},
	getByUserAndLimit(userId,limit){
		return this.find({"receiverId":userId}).sort({"createdAt":-1}).limit(limit).exec();
	},
	getUnreadNotifications(userId){
		return this.count({$and:[
			{"receiverId":userId},
			{"isRead":false}]}).exec();
	},
	readMore(userId,skipNumber,limit){
		return this.find({"receiverId":userId}).sort({"createdAt":-1}).skip(skipNumber).limit(limit).exec();  
	},
	markAllAsRead(userId,targetUsers){
		return this.updateMany({
			$and:[{"receiverId":userId},{"senderId":{$in:targetUsers}}]
		},{"isRead":true}).exec();
	}
}
const NOTIFICATION_TYPES={
	ADD_CONTACT:"add_contact",
	ADD_CONTACT_SUCCESS:"add_contact_success"
}
const NOTIFICATION_CONTENTS={
	getContent:(notificationType,isRead,userId,userName,userAvatar,)=>{
		if(notificationType===NOTIFICATION_TYPES.ADD_CONTACT){
			if(!isRead){
			return '<div class="notification-unread" data-uid="'+userId+'"><img class="avatar-small" src="images/users/'+userAvatar+'" alt="">  <strong>'+userName+'</strong> đã gửi cho bạn một lời mời kết bạn!</div>';
              }
   			return '<div data-uid="'+userId+'"><img class="avatar-small" src="images/users/'+userAvatar+'" alt="">  <strong>'+userName+'</strong> đã gửi cho bạn một lời mời kết bạn!</div>';

		}
		if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT_SUCCESS){
			if(!isRead){
			return '<div class="notification-unread" data-uid="'+userId+'"><img class="avatar-small" src="images/users/'+userAvatar+'" alt="">  <strong>'+userName+'</strong> đã chấp nhận yêu cầu kết bạn!</div>';
              }
   			return '<div data-uid="'+userId+'"><img class="avatar-small" src="images/users/'+userAvatar+'" alt="">  <strong>'+userName+'</strong> đã chấp nhận yêu cầu kết bạn!</div>';

		}
		return "add_contact loi";
	}
}

module.exports ={
	model:mongoose.model("notificaion",NotificationSchema),
	types:NOTIFICATION_TYPES,
	contents:NOTIFICATION_CONTENTS
};