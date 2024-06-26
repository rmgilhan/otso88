import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
    const {user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');   
    const [isActive, setIsActive] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    function authenticate(e) {
        // Prevents page redirection via form submission
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`,{
            method: 'POST',
            headers: {
                    "Content-Type": "application/json"
                    },
            body: JSON.stringify({
                email: email,
                password: password
                })
                })
                .then(res => res.json())
                .then(data => {

                if(typeof data.access !== "undefined"){
                    localStorage.setItem("token", data.access);
                    // invoked the retrieveUserDetails function providing the token to be used to retrieve user details.
                    retrieveUserDetails(data.access);
                    // alert("Login successful");
                        
                    Swal.fire({
                        title: "Login Successful",
                        icon: "success",
                        text: "Welcome to Otso. Quality Products, Unmatched Service"
                    })

                    }
                    else{
                        Swal.fire({
                            title: "Authentication failed",
                            icon: "error",
                            text: "Check your login details and try again"
                        })
                    }

                    
                })
                // Clear input fields after submission
                setEmail('');
                setPassword('');
            }


        const retrieveUserDetails = (token) => {
                fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`,{
                headers: {
                    "Authorization": `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);

                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                    })

                });
            }

            useEffect(() => {

            setIsActive(email !== '' && password !== '');
                  
            }, [email, password]);

            function clearForm(){
                setEmail('');
                setPassword('');
            }
            return (    

                    (user.id !== null) ?
                        <Navigate to="/products" />
                    :
                    <Container className="d-flex justify-content-center align-items-center" style={{ height: '85vh' }}>   
                        <Row>
                            <Col x={12}>
                                <Form onSubmit={(e) => authenticate(e)} className="border border-1 border-success rounded-2 mt-5 px-5">
                                       <h3 className="text-center mt-3 text-success">Login</h3>
                                       <Form.Group controlId="userEmail" className="mt-3 px-3 fw-bolder lh-base fs-7 text-success">
                                           <Form.Label>Email address</Form.Label>
                                           <Form.Control className="my-1 fs-7 pe-5"
                                               type="email" 
                                               placeholder="Enter email"
                                               value={email}
                                               onChange={(e) => setEmail(e.target.value)}
                                               required
                                           />
                                       </Form.Group>

                                       <Form.Group controlId="password" className="mt-3 px-3 fw-bolder lh-base fs-7 text-success">
                                           <Form.Label>Password</Form.Label>
                                           <InputGroup className="my-1 fs-7">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                autoComplete="current-password"
                                            />
                                            <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </InputGroup.Text>
                                        </InputGroup>
                                        </Form.Group>
                                           <Button className="m-4 ms-5 accent"
                                                  variant="success"
                                                  type="submit"
                                                  id="submitBtn"
                                                  disabled={!isActive}
                                                >
                                                  Submit
                                           </Button>
                                           <Button className="d-inline accent"
                                             variant="secondary"
                                             type="button"
                                             id="cancelBtn"
                                             onClick={clearForm}
                                           >
                                             Cancel
                                           </Button>
                                   </Form>

                            </Col>
                        </Row>

                     
                    </Container>     
            )
        }
