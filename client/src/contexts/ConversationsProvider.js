import React, { useCallback, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";

const ConversationsContext = React.createContext();

export function useConversations() {
	return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
	const [conversations, setConversations] = useLocalStorage(
		"conversations",
		[]
	);
	const [selectedConversationIndex, setSelectedConversationIndex] =
		useState(0);
	const { contacts } = useContacts();
	const socket = useSocket()

	function createConversation(recipients) {
		setConversations((prevConversations) => {
			return [...prevConversations, { recipients, messages: [] }];
		});
	}

	const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
		setConversations(prevConversations => {
			let madeChange = false;
			const newMessage = {sender, text}
			const newConversations = prevConversations.map(conversation=>{
				if(arrayEquality(conversation.recipients, recipients)){
					madeChange = true
				console.log("34");

					return {
						...conversation,
						messages: [...conversation.messages, newMessage]
					}
				}
				return conversation
			})
			if(madeChange){
				console.log("42");
				return newConversations
			}
			else{
				console.log("46");

				return [
					...prevConversations, 
					{recipients, messages: [newMessage]}
				]
			}
		})
	}, [setConversations])

	useEffect(()=>{
		if(socket ==  null) return 

		socket.on('receive-message', addMessageToConversation)

		return ()=>socket.off('receive-message')
	}, [socket, addMessageToConversation])

	function sendMessage(recipients, text){
		socket.emit('send-message', {recipients, text})
		addMessageToConversation({recipients, text, sender: id})
	}

	const formattedConversations = conversations.map((conversations, index) => {
		const recipients = conversations.recipients.map((recipient) => {
			const contact = contacts.find((contact) => {
				return contact.id === recipient;
			});
			const name = (contact && contact.name) || recipient;
			return { id: recipient, name };
		});

		const messages = conversations.messages.map(message => {
			const contact = contacts.find(contact => {
				return contact.id === message.sender
			})

			const name = (contact && contact.name) || message.sender;
			const fromMe = id === message.sender

			return {...message, senderName: name, fromMe}
		})

		const selected = index === selectedConversationIndex;
		return { ...conversations, messages, recipients, selected };
	});

	const value = {
		conversations: formattedConversations,
		selectedConversation: formattedConversations[selectedConversationIndex],
		sendMessage,
		selectConversationIndex: setSelectedConversationIndex,
		createConversation,
	};

	return (
		<ConversationsContext.Provider value={value}>
			{children}
		</ConversationsContext.Provider>
	);
}

function arrayEquality(a,b){
	if(a.length !== b.length){
		return false;
	}
	a.sort()
	b.sort()

	return a.every((element, index)=>{
		return element === b[index]
	})
}