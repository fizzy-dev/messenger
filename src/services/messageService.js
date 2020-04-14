import messageModel from "./../models/messageModel";
import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";
let getAllConversationItems=(currentUserId)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let contacts=await contactModel.getContacts(currentUserId,15); //lay id 10 contact 
		    let userConversationsPromise= contacts.map(async (contact)=>{
			    if(currentUserId == contact.contactId){
					let getUserContact = await userModel.findUserById(contact.userId);
					getUserContact.updatedAt= contact.updatedAt;
					return getUserContact;
				}else{
				    let getUserContact= await userModel.findUserById(contact.contactId);
				    getUserContact.updatedAt=contact.updatedAt;
				    return getUserContact;
				    }
		        });	
		    let userConversations = await Promise.all(userConversationsPromise);
		    let groupConversations= await chatGroupModel.getChatGroups(currentUserId,10); //LAY 10  GROUP 
		    let allConversations= userConversations.concat(groupConversations);	
		    allConversations = _.sortBy(allConversations,(item)=>{
		    	return -item.updatedAt;
		    });	
		    resolve({
		    	userConversations:userConversations,
		    	groupConversations:groupConversations,
		    	allConversations:allConversations
		    });
		}catch(error){
			reject(error);
		}
	})

}

module.exports ={
	getAllConversationItems:getAllConversationItems
}