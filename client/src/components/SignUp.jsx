import React from 'react';
import {Link} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';

const SignUp = (props) => {
    const validationSchema = Yup
        .object()
        .shape({
            name: Yup
                .string()
                .min(2,'Name is too short!')
                .max(30,'Name is too long!')
                .required('Name is required!'),
            username: Yup
                .string()
                .min(3,'Username is too short!')
                .max(30)
                // .matches(/([a-zA-Z0-9])\w+/g,'Only Alpha-numeric characters are allowed!')
                .required('Username is required!'),
            email: Yup
                .string()
                .trim()
                .email('Not a valid email!')
                .required('Email is required!'),
            password: Yup
                .string()
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,'Password must atleast 8 characters long and must have atleast one lower-case, one upper-case, one symbols and one digit.')
                .required('Password is required!')
        })
    return (
        <div className="App">
            <header>
                <h3>Sign Up</h3>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/login">Log In</Link>
                </nav>
            </header>
            <Formik
                initialValues={{
                name: '',
                username: '',
                email: '',
                password: ''
            }}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting}) => {
                setTimeout(() => {
                    fetch('/signup', {  
                        method: 'POST',  
                        headers: {  
                          'content-type': 'application/json' 
                        },  
                         body: JSON.stringify(values)
                    })
                    .then(async resp => {  
                        if(resp.status === 200){
                            const {token} = await resp.json(); 
                            Cookies.set('access-token', `${token}`, { expires: 7 });
                            props.history.push('/dashboard')
                        }
                        else {
                            const {message} = await resp.json();
                            console.log(message);
                        }
                    })  
                    .catch(error => console.log('Request failure: ', error));
                    setSubmitting(false);
                }, 400);
            }}>
                {({isSubmitting}) => (
                    <Form>
                        <label>Name</label>
                        <Field type="text" name="name"/>
                        <ErrorMessage
                            name="name"
                            render={msg => <div className="error-message">{msg}</div>}/>
                        <label>Username</label>
                        <Field type="text" name="username"/>
                        <ErrorMessage
                            name="username"
                            render={msg => <div className="error-message">{msg}</div>}/>
                        <label>Email</label>
                        <Field type="email" name="email"/>
                        <ErrorMessage
                            name="email"
                            render={msg => <div className="error-message">{msg}</div>}/>
                        <label>Password</label>
                        <Field type="password" name="password"/>
                        <ErrorMessage
                            name="password"
                            render={msg => <div className="error-message">{msg}</div>}/>
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default SignUp;