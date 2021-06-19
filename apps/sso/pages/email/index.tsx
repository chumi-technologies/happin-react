import React, { useState } from 'react';
import Link from 'next/Link';
import { firebaseClient } from '../../api/firebaseClient';
import { FormControl, FormErrorMessage, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import classNames from 'classnames';
import { Formik, Form, Field, FieldProps } from 'formik';
import { PreviewCloseOne, PreviewOpen } from '@icon-park/react';
import { useAppState } from '../../contexts/state';

export default function EmailLogin() {
  const [showPWD, setShowPWD] = useState(false)
  const [roleCur, setRoleCur] = useState(0);
  const roleList = ['Fan', 'Organizer']
  const { signin, toggleMode } = useAppState();

  function validateEmail(value: string) {
    if (!value) {
      return "Email is required";
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }
    return false
  }
  function validatePass(value: string) {
    if (!value) {
      return "Password is required";
    }
    return false
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mt-6">Log In with your email</h2>
          <div className="toggle-tab average w-52 mt-10">
            {roleList.map((item, index) => (
              <div
                key={index}
                className={classNames('toggle-tab-item', { active: roleCur === index })}
                onClick={() => setRoleCur(index)}
              >{item}</div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-sm mx-auto mt-8">
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={async ({email, password}, actions) => {
              actions.setSubmitting(false)
              const res = await firebaseClient.auth().signInWithEmailAndPassword(email, password);
              const parsed = JSON.parse(JSON.stringify(res));
              console.log(parsed.user.stsTokenManager.accessToken)
              // window.location.href = '/';
            }}
          >
            {(props) => (
              <Form>
                <Field name="email" validate={validateEmail}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={!!form.errors.email && !!form.touched.email}>
                      <Input {...field} id="email" placeholder="Mail Address" />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="password" validate={validatePass}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={!!form.errors.password && !!form.touched.password}>
                      <InputGroup size="md" mt="1rem">
                        <Input
                          {...field}
                          id="password"
                          type={showPWD ? "text" : "password"}
                          placeholder="Password"
                        />
                        <InputRightElement width="3rem">
                          <div className="leading-none p-1" onClick={() => setShowPWD(s => !s)}>
                            {showPWD ? <PreviewOpen size="18" fill="#9ca3af"/> : <PreviewCloseOne size="18" fill="#9ca3af"/>}
                          </div>
                        </InputRightElement>
                      </InputGroup>
                      <div className="flex">
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                        <div className="flex-grow" />
                        <Link href="/forgot"><a className="mt-1 underline transition font-semibold text-sm hover:text-teal-500">Forgot password</a></Link>
                      </div>
                    </FormControl>
                  )}
                </Field>
                <button className="btn btn-dark w-full mt-10" type="submit">Continue</button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="flex-grow" />
        <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid pt-3 text-sm text-gray-500">
          <div className="flex justify-between">
            <Link href="/"><a className="underline transition font-semibold text-teal-500 hover:text-teal-600">More login options</a></Link>
            <div>Can’t login? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600" onClick={toggleMode}>Sign up</a></Link> for new user?</div>
          </div>
        </div>
      </div>
    </div>
  )
}
