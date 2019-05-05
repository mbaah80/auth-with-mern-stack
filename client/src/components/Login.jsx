import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';

const Login = (props) => {
    const [userExist, setUserExist] = useState('');
    const validationSchema = Yup
        .object()
        .shape({
            username: Yup
                .string()
                .required('Username is required!'),
            password: Yup
                .string()
                .required('Password is required!')
        })
    return (
        <div className="App">
            <header>
                <h3>Login</h3>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/signup">Sign Up</Link>
                </nav>
            </header>
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                validationSchema={validationSchema} 
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        fetch('/login', {  
                            method: 'POST',  
                            headers: {  
                              'content-type': 'application/json' 
                            },  
                             body: JSON.stringify(values)
                        })
                        .then(async resp => {  
                            if(resp.status === 200){
                                const { token, user } = await resp.json();
                                Cookies.set('access-token', `${token}`, { expires: 7 });
                                props.history.push('/dashboard');
                            }
                            else {
                                const {message} = await resp.json();
                                setUserExist(message);
                            }
                        })  
                        .catch(error => console.log('Request failure: ', error));
                        setSubmitting(false);
                    }, 400);
                    
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        {userExist !== '' ? <span className="error-message">{userExist}</span> : null}
                        <label>Username</label>
                        <Field type="text" name="username"/>
                        <ErrorMessage name="username" render={msg => <div className="error-message">{msg}</div>}/>
                        <label>Password</label>
                        <Field type="password" name="password"/>
                        <ErrorMessage name="password" render={msg => <div className="error-message">{msg}</div>}/>
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;