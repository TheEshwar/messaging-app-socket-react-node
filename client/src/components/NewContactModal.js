import React, { useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useContacts } from "../contexts/ContactsProvider";

function NewContactModal({ setModalOpen, closeModal }) {
	const idRef = useRef();
	const nameRef = useRef();

	const { createContact } = useContacts();

	function handleSubmit(e) {
		e.preventDefault();

		createContact(idRef.current.value, nameRef.current.value);
		setModalOpen(false);
	}
	return (
		<>
			<Modal.Header closeButton>Create Contact</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label>ID</Form.Label>
						<Form.Control
							type="text"
							ref={idRef}
							required
						></Form.Control>
					</Form.Group>

					<Form.Group>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							ref={nameRef}
							required
						></Form.Control>
					</Form.Group>
					<Button type="submit">Create</Button>
				</Form>
			</Modal.Body>
		</>
	);
}

export default NewContactModal;
