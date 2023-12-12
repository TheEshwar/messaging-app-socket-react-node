import React, { useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

function Login({onIdSubmit}) {
	const idRef = useRef();

    function handleSubmit(e){
        e.preventDefault();
        onIdSubmit(idRef.current.value)
    }

    function createNewId(e){
        e.preventDefault();
        let tid = uuidv4();
        onIdSubmit(tid)
        console.log("uuidv4 :- ", tid);
    }

	return (
		<Container
			className="align-items-center d-flex"
			style={{ height: "100vh" }}
		>
			<Form onSubmit={handleSubmit} className="w-100">
				<Form.Group>
					<Form.Label>Enter your id</Form.Label>
					<Form.Control
						type="text"
						ref={idRef}
						required
					></Form.Control>
				</Form.Group>
				<Button type="submit" className="mr-2">
					Login
				</Button>
				<Button onClick={createNewId} variant="secondary">Create new id</Button>
			</Form>
		</Container>
	);
}

export default Login;
